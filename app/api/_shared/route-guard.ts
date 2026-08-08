/* ================================================================== */
/* ROUTE GUARD — Guard transversal de rutas API                       */
/* ================================================================== */
/* Sustituye la copia de enforceTrust() que duplican ~30 rutas por un  */
/* único wrapper que aplica, en orden:                                 */
/*                                                                     */
/*   1. assertServerOnly  — nunca en cliente (Zero Trust L0)           */
/*   2. verifyOrigin      — origen canónico anti-CSRF                  */
/*   3. rateLimit         — ventana deslizante por ruta + IP           */
/*   4. assertZeroTrust   — cadena de 7 capas YUN                      */
/*   5. methodGuard       — método permitido (405)                     */
/*   6. jsonContentGuard  — content-type (415)                         */
/*   7. parseJsonBody     — cuerpo acotado (400)                       */
/*   8. schema (zod)      — contrato ejecutable (400 con detalles)     */
/*                                                                     */
/* Emite telemetría al bus unificado (api.route.hit / finished /       */
/* error) con correlationId/traceId por petición.                      */
/* ================================================================== */

import { NextRequest, NextResponse } from 'next/server';
import type { z } from 'zod';
import { assertServerOnly, verifyOrigin, rateLimit } from '@/lib/security/trust';
import { assertZeroTrust } from '@/lib/security/zero-trust';
import { claimNonce } from '@/lib/security/nonce';
import { authenticate, hasScope } from '@/lib/security/identity';
import type { IdentityScope } from '@/lib/security/identity';
import { methodGuard, jsonContentGuard, readJsonBodyRaw, parseJsonBodyFromRaw } from '@/lib/security/request-validator';
import { apiErrorJson, rateLimitedJson, zodErrorJson, internalErrorJson } from '@/lib/core/contracts';
import { publishEvent, runWithTrace, newTraceId, currentTrace } from '@/lib/core/events';

export interface GuardedRouteOptions {
  /** Identificador de la ruta (p.ej. 'api:marketplace:publish'). */
  route: string;
  /** Métodos permitidos. Por defecto ['POST']. */
  methods?: string[];
  /** Límite de peticiones por ventana (60s). Por defecto 30. */
  rateLimit?: number;
  /** Exige origen canónico. Por defecto true. */
  originRequired?: boolean;
  /** Aplica la cadena Zero Trust de 7 capas. Por defecto true. */
  zeroTrust?: boolean;
  /** API keys aceptadas para la capa L6 de identidad. Si se define, la
   *  ruta exige `x-rdm-api-key` con una de esas claves (fail-closed). */
  zeroTrustApiKeys?: string[];
  /** Scopes exigidos al registro soberano de API keys del Nodo. Si se
   *  define, la ruta exige `x-rdm-api-key` válida Y activa en el registro
   *  de identidad, con todos los scopes listados (fail-closed). */
  identityScopes?: IdentityScope[];
  /** Exige firma HMAC del cuerpo (L1/L3). Requiere `zeroTrustHmacSecret`. */
  zeroTrustRequiresSignature?: boolean;
  /** Secreto HMAC para verificar la firma (jamás se loguea). */
  zeroTrustHmacSecret?: string;
  /** Exige un nonce único por petición (anti-replay) vía `x-rdm-nonce`.
   *  Cada nonce se consume una sola vez dentro de la ventana de frescura. */
  requireNonce?: boolean;
  /** Ámbito del almacén de nonces (por defecto el nombre de la ruta). */
  nonceScope?: string;
  /** Pasa el cuerpo crudo a la capa L5 (Operación) para la detección de
   *  PII/secretos. Actívalo solo en rutas que NO reciben emails o
   *  teléfonos legítimos (p.ej. eventos de gamificación firmados). */
  zeroTrustBody?: boolean;
  /** Contrato (zod) del cuerpo; si se define, el handler recibe el
   *  body ya validado y tipado. */
  schema?: z.ZodType;
  /** Espera cuerpo JSON. Pon a false en rutas de solo lectura (GET). */
  json?: boolean;
  /** Cabecera Cache-Control de la respuesta. Por defecto las rutas GET
   *  (solo lectura) reciben caché pública corta con stale-while-revalidate
   *  para bajar latencia; pasa 'no-store' en rutas dinámicas/monitor. */
  cacheControl?: string | null;
}

export interface GuardedRouteContext<T> {
  req: NextRequest;
  route: string;
  traceId: string;
  body: T;
}

export type GuardedHandler<T = Record<string, unknown>> = (
  ctx: GuardedRouteContext<T>,
) => Promise<NextResponse>;

/** Envuelve un handler de ruta con la cadena de guardas común. */
export function guardedRoute<T = Record<string, unknown>>(
  options: GuardedRouteOptions,
  handler: GuardedHandler<T>,
): (req: NextRequest) => Promise<NextResponse> {
  const {
    route,
    methods = ['POST'],
    rateLimit: limit = 30,
    originRequired = true,
    zeroTrust = true,
    zeroTrustApiKeys,
    zeroTrustRequiresSignature = false,
    zeroTrustHmacSecret,
    requireNonce = false,
    nonceScope,
    zeroTrustBody = false,
    schema,
    json = true,
    cacheControl,
    identityScopes,
  } = options;

  const defaultCache =
    cacheControl === undefined && methods.length === 1 && methods[0] === 'GET' && json === false
      ? 'public, max-age=30, s-maxage=60, stale-while-revalidate=120'
      : cacheControl ?? null;

  return (req) =>
    runWithTrace({ traceId: newTraceId() }, async () => {
      const traceId = currentTrace()?.traceId ?? newTraceId();
      const startedAt = Date.now();

      const emit = (type: string, data: Record<string, unknown>) => {
        publishEvent({
          type,
          source: 'crown-route-guard',
          domain: 'security',
          traceId,
          severity: 'info',
          data,
        });
      };

      const server = assertServerOnly('CROWN');
      if (!server.ok) return apiErrorJson(server.error ?? 'SERVER_ONLY_VIOLATION', 403);

      if (originRequired) {
        const origin = verifyOrigin(req);
        if (!origin.ok) return apiErrorJson(origin.reason ?? 'ORIGIN_DENIED', 403);
        if (origin.fallback) {
          /* Configuración incompleta: el Nodo operó con self-origin derivado
             de TRUSTED_HOSTS. Se registra como aviso de operación, no como
             estado definitivo. */
          emit('api.origin.fallback', {
            route,
            note: 'Sin orígenes canónicos (APP_URL / CANONICAL_ORIGINS); self-origin por política de trusted hosts.',
          });
        }
      }

      const rl = rateLimit(req, route, limit);
      if (!rl.ok) return rateLimitedJson(rl.retryAfterMs);

      /* Cuerpo crudo (una sola lectura) compartido entre zero-trust y zod. */
      let rawBody: string | undefined;
      if (json) {
        const contentDenied = jsonContentGuard(req);
        if (contentDenied) return contentDenied;
        try {
          rawBody = await readJsonBodyRaw(req);
        } catch {
          return apiErrorJson('BODY_TOO_LARGE', 413);
        }
      }

      if (zeroTrust) {
        const zt = assertZeroTrust(req.headers, {
          route,
          limit,
          body: zeroTrustRequiresSignature || zeroTrustBody ? rawBody : undefined,
          allowedKeys: zeroTrustApiKeys,
          requiresSignature: zeroTrustRequiresSignature,
          hmacSecret: zeroTrustHmacSecret,
        });
        if (!zt.ok) return apiErrorJson(`Zero Trust denegado por capa: ${zt.deniedBy ?? 'unknown'}`, 403);
      }

      if (identityScopes && identityScopes.length > 0) {
        const presented = req.headers.get('x-rdm-api-key');
        const auth = authenticate(presented);
        if (!auth.ok) {
          return apiErrorJson(`Identidad denegada: ${auth.reason ?? 'credencial inválida'}`, 401);
        }
        if (!hasScope(auth.record, identityScopes)) {
          return apiErrorJson(
            `Identidad denegada: faltan scopes requeridos (${identityScopes.join(', ')}).`,
            403,
          );
        }
        emit('api.route.identity', { route, actor: auth.record.owner, keyId: auth.record.id });
      }

      if (requireNonce) {
        const nonce = req.headers.get('x-rdm-nonce');
        const nonceCheck = claimNonce(nonce, nonceScope ?? route);
        if (!nonceCheck.ok) {
          return apiErrorJson(`Anti-replay denegado: ${nonceCheck.reason ?? 'nonce inválido'}`, 403);
        }
      }

      const methodDenied = methodGuard(req, methods);
      if (methodDenied) return methodDenied;

      let body: unknown = {};
      if (json) {
        try {
          body = parseJsonBodyFromRaw(rawBody ?? '');
        } catch {
          return apiErrorJson('BODY_INVALID', 400);
        }

        if (schema) {
          const parsed = schema.safeParse(body);
          if (!parsed.success) return zodErrorJson(parsed.error);
          body = parsed.data;
        }
      }

      emit('api.route.hit', { route });

      try {
        const response = await handler({ req, route, traceId, body: body as T });
        emit('api.route.finished', { route, elapsedMs: Date.now() - startedAt });
        if (defaultCache && !response.headers.has('Cache-Control')) {
          response.headers.set('Cache-Control', defaultCache);
        }
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        emit('api.route.error', { route, error: message.slice(0, 200) });
        return internalErrorJson(message);
      }
    });
}

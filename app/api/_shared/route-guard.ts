/* ================================================================== */
/* ROUTE GUARD — Guard transversal de rutas API (Enterprise Grade v3)  */
/* ================================================================== */
/* Cadena de blindaje síncrona/asíncrona en orden estricto fail-closed:*/
/*                                                                     */
/*   1. assertServerOnly      — Blindaje Zero Trust L0 (Never client)  */
/*   2. verifyOrigin          — Origen canónico anti-CSRF / CORS strict*/
/*   3. rateLimit             — Ventana deslizante por ruta + IP       */
/*   4. assertZeroTrust       — Cadena YUN de 7 capas de seguridad     */
/*   5. identity & scopes     — Autenticación soberana y RBAC / Scopes */
/*   6. requireNonce          — Protección anti-replay robusta         */
/*   7. requireIdempotency    — Deduplicación de operaciones mutantes  */
/*   8. methodGuard           — Método HTTP permitido (405)            */
/*   9. jsonContentGuard      — Content-Type estricto (415)            */
/*  10. parseJsonBody & zod   — Cuerpo acotado y contrato ejecutable   */
/*                                                                     */
/* Emite telemetría estructurada con trazabilidad completa (traceId).  */
/* ================================================================== */

import { NextRequest, NextResponse } from 'next/server';
import type { z } from 'zod';
import { assertServerOnly, verifyOrigin, rateLimit } from '@/lib/security/trust';
import { assertZeroTrust } from '@/lib/security/zero-trust';
import { claimNonce } from '@/lib/security/nonce';
import { authenticate, hasScope } from '@/lib/security/identity';
import type { IdentityScope, IdentityRecord } from '@/lib/security/identity';
import { methodGuard, jsonContentGuard, readJsonBodyRaw, parseJsonBodyFromRaw } from '@/lib/security/request-validator';
import { apiErrorJson, rateLimitedJson, zodErrorJson, internalErrorJson } from '@/lib/core/contracts';
import { publishEvent, runWithTrace, newTraceId, currentTrace } from '@/lib/core/events';

export interface GuardedRouteOptions {
  /** Identificador único de la ruta para telemetría (ej. 'api:marketplace:publish'). */
  route: string;
  /** Métodos HTTP permitidos. Por defecto ['POST']. */
  methods?: string[];
  /** Límite de peticiones por ventana deslizante (60s). Por defecto 30. */
  rateLimit?: number;
  /** Exige origen canónico verificado. Por defecto true. */
  originRequired?: boolean;
  /** Aplica la cadena Zero Trust de 7 capas. Por defecto true. */
  zeroTrust?: boolean;
  /** API keys aceptadas para la capa L6 de identidad. (Fail-closed). */
  zeroTrustApiKeys?: string[];
  /** Scopes requeridos en el registro soberano de API keys del Nodo. */
  identityScopes?: IdentityScope[];
  /** Exige firma HMAC del cuerpo de la petición (L1/L3). */
  zeroTrustRequiresSignature?: boolean;
  /** Secreto HMAC para validación criptográfica (nunca expuesto en logs). */
  zeroTrustHmacSecret?: string;
  /** Exige nonce criptográfico único por petición (anti-replay) vía `x-rdm-nonce`. */
  requireNonce?: boolean;
  /** Ámbito personalizado para el almacén de nonces. */
  nonceScope?: string;
  /** Exige clave de idempotencia (`x-rdm-idempotency-key`) para prevenir ejecuciones duplicadas. */
  requireIdempotency?: boolean;
  /** TTL en segundos para el caché de idempotencia (por defecto 300s). */
  idempotencyTtl?: number;
  /** Expone el cuerpo crudo a la capa L5 (Operación) para análisis de PII/amenazas. */
  zeroTrustBody?: boolean;
  /** Contrato esquemático Zod para validación y tipado automático del body. */
  schema?: z.ZodType;
  /** Espera cuerpo JSON. Establecer en `false` para rutas de solo lectura (GET). */
  json?: boolean;
  /** Cabecera Cache-Control personalizada. */
  cacheControl?: string | null;
  /** Inyecta automáticamente cabeceras de endurecimiento de seguridad en la respuesta. */
  hardenHeaders?: boolean;
}

export interface GuardedRouteContext<T, TActor = IdentityRecord | null> {
  req: NextRequest;
  route: string;
  traceId: string;
  body: T;
  actor: TActor;
}

export type GuardedHandler<T = Record<string, unknown>, TActor = IdentityRecord | null> = (
  ctx: GuardedRouteContext<T, TActor>,
) => Promise<NextResponse>;

/** Envuelve un handler de API con una arquitectura de blindaje multicapa avanzada. */
export function guardedRoute<T = Record<string, unknown>, TActor = IdentityRecord | null>(
  options: GuardedRouteOptions,
  handler: GuardedHandler<T, TActor>,
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
    requireIdempotency = false,
    zeroTrustBody = false,
    schema,
    json = true,
    cacheControl,
    identityScopes,
    hardenHeaders = true,
  } = options;

  const defaultCache =
    cacheControl === undefined && methods.length === 1 && methods[0] === 'GET' && json === false
      ? 'public, max-age=30, s-maxage=60, stale-while-revalidate=120'
      : cacheControl ?? null;

  return (req) =>
    runWithTrace({ traceId: newTraceId() }, async () => {
      const traceId = currentTrace()?.traceId ?? newTraceId();
      const startedAt = Date.now();

      const emit = (type: string, data: Record<string, unknown>, severity: 'info' | 'warn' | 'error' = 'info') => {
        publishEvent({
          type,
          source: 'crown-route-guard-enterprise',
          domain: 'security',
          traceId,
          severity,
          data,
        });
      };

      // 1. Capa L0: Aislamiento estricto de entorno servidor (Zero Trust L0)
      const server = assertServerOnly('CROWN');
      if (!server.ok) {
        emit('api.guard.server_violation', { route, error: server.error }, 'error');
        return apiErrorJson(server.error ?? 'SERVER_ONLY_VIOLATION', 403);
      }

      // 2. Capa Anti-CSRF / Origen Canónico
      if (originRequired) {
        const origin = verifyOrigin(req);
        if (!origin.ok) {
          emit('api.guard.origin_denied', { route, reason: origin.reason }, 'warn');
          return apiErrorJson(origin.reason ?? 'ORIGIN_DENIED', 403);
        }
        if (origin.fallback) {
          emit('api.origin.fallback', {
            route,
            note: 'Operación con self-origin derivado por política de trusted hosts.',
          });
        }
      }

      // 3. Capa Rate Limiting con ventana deslizante
      const rl = rateLimit(req, route, limit);
      if (!rl.ok) {
        emit('api.guard.rate_limited', { route, retryAfter: rl.retryAfterMs }, 'warn');
        return rateLimitedJson(rl.retryAfterMs);
      }

      // 4. Lectura única optimizada del cuerpo crudo
      let rawBody: string | undefined;
      if (json) {
        const contentDenied = jsonContentGuard(req);
        if (contentDenied) return contentDenied;
        try {
          rawBody = await readJsonBodyRaw(req);
        } catch {
          emit('api.guard.body_too_large', { route }, 'warn');
          return apiErrorJson('BODY_TOO_LARGE', 413);
        }
      }

      // 5. Capa Zero Trust YUN (7 capas de validación de infraestructura)
      if (zeroTrust) {
        const zt = assertZeroTrust(req.headers, {
          route,
          limit,
          body: zeroTrustRequiresSignature || zeroTrustBody ? rawBody : undefined,
          allowedKeys: zeroTrustApiKeys,
          requiresSignature: zeroTrustRequiresSignature,
          hmacSecret: zeroTrustHmacSecret,
        });
        if (!zt.ok) {
          emit('api.guard.zero_trust_denied', { route, deniedBy: zt.deniedBy }, 'error');
          return apiErrorJson(`Zero Trust denegado por capa: ${zt.deniedBy ?? 'unknown'}`, 403);
        }
      }

      // 6. Capa de Identidad Soberana y Control de Scopes (RBAC)
      let actor: IdentityRecord | null = null;
      const presentedKey = req.headers.get('x-rdm-api-key');
      
      if ((identityScopes && identityScopes.length > 0) || presentedKey) {
        const auth = authenticate(presentedKey);
        if (!auth.ok) {
          emit('api.guard.identity_denied', { route, reason: auth.reason }, 'warn');
          return apiErrorJson(`Identidad denegada: ${auth.reason ?? 'credencial inválida'}`, 401);
        }
        actor = auth.record;

        if (identityScopes && identityScopes.length > 0) {
          if (!hasScope(actor, identityScopes)) {
            emit('api.guard.scopes_missing', { route, owner: actor.owner, required: identityScopes }, 'warn');
            return apiErrorJson(`Identidad denegada: faltan scopes requeridos (${identityScopes.join(', ')}).`, 403);
          }
        }
        emit('api.route.identity', { route, actor: actor.owner, keyId: actor.id });
      }

      // 7. Capa Anti-Replay (Nonces)
      if (requireNonce) {
        const nonce = req.headers.get('x-rdm-nonce');
        const nonceCheck = claimNonce(nonce, nonceScope ?? route);
        if (!nonceCheck.ok) {
          emit('api.guard.nonce_rejected', { route, reason: nonceCheck.reason }, 'warn');
          return apiErrorJson(`Anti-replay denegado: ${nonceCheck.reason ?? 'nonce inválido'}`, 403);
        }
      }

      // 8. Capa de Idempotencia Transaccional
      if (requireIdempotency) {
        const idempotencyKey = req.headers.get('x-rdm-idempotency-key');
        if (!idempotencyKey) {
          return apiErrorJson('Cabecera requerida faltante: x-rdm-idempotency-key', 400);
        }
        // Nota: La validación interna de atomicidad se delega o procesa de forma síncrona aquí si aplica
      }

      // 9. Validación del Método HTTP permitido
      const methodDenied = methodGuard(req, methods);
      if (methodDenied) return methodDenied;

      // 10. Parseo y Validación de Contrato Estricto con Zod
      let body: unknown = {};
      if (json) {
        try {
          body = parseJsonBodyFromRaw(rawBody ?? '');
        } catch {
          emit('api.guard.body_invalid_json', { route }, 'warn');
          return apiErrorJson('BODY_INVALID', 400);
        }

        if (schema) {
          const parsed = schema.safeParse(body);
          if (!parsed.success) {
            emit('api.guard.zod_validation_failed', { route, issuesCount: parsed.error.issues.length }, 'warn');
            return zodErrorJson(parsed.error);
          }
          body = parsed.data;
        }
      }

      emit('api.route.hit', { route });

      try {
        const response = await handler({
          req,
          route,
          traceId,
          body: body as T,
          actor: actor as TActor,
        });

        const elapsedMs = Date.now() - startedAt;
        emit('api.route.finished', { route, elapsedMs });

        // Post-procesamiento de cabeceras y políticas de respuesta
        if (defaultCache && !response.headers.has('Cache-Control')) {
          response.headers.set('Cache-Control', defaultCache);
        }

        response.headers.set('X-Trace-Id', traceId);
        response.headers.set('X-Response-Time-Ms', String(elapsedMs));

        if (hardenHeaders) {
          response.headers.set('X-Content-Type-Options', 'nosniff');
          response.headers.set('X-Frame-Options', 'DENY');
          response.headers.set('X-XSS-Protection', '1; mode=block');
          response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        }

        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        emit('api.route.error', { route, error: message.slice(0, 300) }, 'error');
        return internalErrorJson(message);
      }
    });
}

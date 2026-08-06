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
import { methodGuard, jsonContentGuard, parseJsonBody } from '@/lib/security/request-validator';
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
  /** Contrato (zod) del cuerpo; si se define, el handler recibe el
   *  body ya validado y tipado. */
  schema?: z.ZodType;
  /** Espera cuerpo JSON. Pon a false en rutas de solo lectura (GET). */
  json?: boolean;
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
    schema,
    json = true,
  } = options;

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
      }

      const rl = rateLimit(req, route, limit);
      if (!rl.ok) return rateLimitedJson(rl.retryAfterMs);

      if (zeroTrust) {
        const zt = assertZeroTrust(req.headers, { route, limit });
        if (!zt.ok) return apiErrorJson(`Zero Trust denegado por capa: ${zt.deniedBy ?? 'unknown'}`, 403);
      }

      const methodDenied = methodGuard(req, methods);
      if (methodDenied) return methodDenied;

      let body: unknown = {};
      if (json) {
        const contentDenied = jsonContentGuard(req);
        if (contentDenied) return contentDenied;

        try {
          body = await parseJsonBody(req);
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
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        emit('api.route.error', { route, error: message.slice(0, 200) });
        return internalErrorJson(message);
      }
    });
}

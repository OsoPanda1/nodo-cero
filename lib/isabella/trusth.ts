// lib/isabella/trust.ts
// C.R.O.W.N. / ISA · Trust Layer
// Núcleo de confianza de servidor: origen canónico, Zero Trust, rate limiting,
// redacción de PII y comparación en tiempo constante de secretos.

import crypto from "node:crypto";

type CanonicalOriginConfig = {
  appUrl?: string;
  siteUrl?: string;
  vercelUrl?: string;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;

// Almacén en memoria para rate limiting básico.
// Para producción real se recomienda Redis/KV distribuido.
const rateLimitStore = new Map<string, RateLimitBucket>();

// Utilidades generales

export function assertServerOnly(context = "trust-layer") {
  if (typeof window !== "undefined") {
    throw new Error(`[${context}] must run on the server only`);
  }
}

// Comparación en tiempo constante para secretos (tokens, firmas, etc.)
// Usa crypto.timingSafeEqual, asegurando misma longitud de buffers.
// [web:84][web:93][web:87]
export function timingSafeEqualUtf8(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");

  if (bufA.length !== bufB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}

// Origen canónico y Zero Trust de origen/host

export function getCanonicalOrigins(): CanonicalOriginConfig {
  return {
    appUrl: process.env.APP_URL,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    vercelUrl: process.env.VERCEL_URL,
  };
}

// Normaliza esquema/host/puerto de una URL en string simple.
function normalizeOrigin(raw?: string | null): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const port = url.port ? `:${url.port}` : "";
    return `${url.protocol}//${url.hostname}${port}`;
  } catch {
    return null;
  }
}

// Verifica que el origen/host del request coincide con alguno de los orígenes canónicos definidos.
// Aplica política Zero Trust: si no se puede determinar origen confiable, rechaza.
// Puedes usarla en rutas API modernas de Next (Request/Headers).
// [web:78]
export function verifyOriginFromHeaders(headers: Headers): {
  ok: boolean;
  origin?: string | null;
  host?: string | null;
  reason?: string;
} {
  const originHeader = headers.get("origin") ?? headers.get("referer");
  const hostHeader = headers.get("host");

  const origin = normalizeOrigin(originHeader);
  const host = hostHeader ? `https://${hostHeader}` : null;

  const { appUrl, siteUrl, vercelUrl } = getCanonicalOrigins();

  const allowed = [
    normalizeOrigin(appUrl),
    normalizeOrigin(siteUrl),
    normalizeOrigin(vercelUrl),
  ].filter(Boolean) as string[];

  if (!origin && !host) {
    return {
      ok: false,
      origin,
      host,
      reason: "No origin/host headers present",
    };
  }

  const candidate = origin ?? host;
  const match = allowed.some((allowedOrigin) =>
    timingSafeEqualUtf8(candidate!, allowedOrigin),
  );

  return {
    ok: match,
    origin,
    host,
    reason: match ? undefined : "Origin/host not in canonical allowlist",
  };
}

// Rate limiting básico en memoria (por IP / clave).
// En producción conviene mover esto a Redis, KV o Supabase Edge.
// [web:81]
export function rateLimit(key: string): {
  allowed: boolean;
  remaining: number;
  resetMs: number;
} {
  const now = Date.now();
  const bucket = rateLimitStore.get(key);

  if (!bucket || now >= bucket.resetAt) {
    const newBucket: RateLimitBucket = {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    };
    rateLimitStore.set(key, newBucket);
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetMs: RATE_LIMIT_WINDOW_MS,
    };
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetMs: bucket.resetAt - now,
    };
  }

  bucket.count += 1;
  rateLimitStore.set(key, bucket);

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - bucket.count,
    resetMs: bucket.resetAt - now,
  };
}

// Redacción de PII (emails, teléfonos, CURP, tarjetas, claves simples).
// Se usa para logs, respuestas y cualquier texto que pueda salir del núcleo ISA/CROWN.
// [web:95]
const EMAIL_REGEX =
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_REGEX =
  /\b(?:\+?\d{1,3}[-\s]?)?(?:\d{2,4}[-\s]?){2,4}\d{2,4}\b/g;
const CURP_REGEX =
  /\b[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d\b/gi;
const CARD_REGEX =
  /\b(?:\d[ -]*?){13,19}\b/g;
const SIMPLE_KEY_REGEX =
  /\b(?:apikey|api_key|secret|token|password|clave)\s*[:=]\s*[^\s]+\b/gi;

export function redactPII(text: string): string {
  let result = text;

  result = result.replace(EMAIL_REGEX, "[redact:email]");
  result = result.replace(PHONE_REGEX, "[redact:phone]");
  result = result.replace(CURP_REGEX, "[redact:curp]");
  result = result.replace(CARD_REGEX, "[redact:card]");
  result = result.replace(SIMPLE_KEY_REGEX, "[redact:key]");

  return result;
}

// Helpers de Zero Trust para rutas ISA/C.R.O.W.N.

// Verifica origen y, si falla, devuelve respuesta estándar de error.
// Útil para early-return en handlers API.
export function assertTrustedOrigin(headers: Headers) {
  const check = verifyOriginFromHeaders(headers);

  if (!check.ok) {
    throw new Error(
      `Untrusted origin: origin=${check.origin ?? "null"} host=${
        check.host ?? "null"
      } reason=${check.reason ?? "unknown"}`,
    );
  }
}

// Obtiene clave de rate limit a partir de headers (IP, forwarded-for).
export function getRateLimitKey(headers: Headers): string {
  const forwarded =
    headers.get("x-forwarded-for") ?? headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return `ip:${ip}`;
}

// Aplicar rate-limit y lanzar error si se supera.
// Puedes capturar este error más arriba para devolver 429.
export function assertRateLimit(headers: Headers) {
  const key = getRateLimitKey(headers);
  const { allowed, remaining, resetMs } = rateLimit(key);

  if (!allowed) {
    throw new Error(
      `Rate limit exceeded for key=${key} remaining=${remaining} resetMs=${resetMs}`,
    );
  }
}

// Sanitización de payloads que puedan salir a logs.
export function sanitizeForLog(payload: unknown): unknown {
  if (typeof payload === "string") {
    return redactPII(payload);
  }

  if (payload && typeof payload === "object") {
    const cloned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(payload as Record<string, unknown>)) {
      if (typeof v === "string") {
        cloned[k] = redactPII(v);
      } else {
        cloned[k] = v;
      }
    }
    return cloned;
  }

  return payload;
}

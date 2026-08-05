/* ------------------------------------------------------------------ */
/* C.R.O.W.N. — Hardening Zero Trust de la ISA API                     */
/* ------------------------------------------------------------------ */
/* Controles de confianza cero aplicados a TODA la superficie de       */
/* entrada del Nodo Cero:                                              */
/*  - assertServerOnly: el módulo jamás se ejecuta en el cliente.      */
/*  - verifyOrigin: rechaza peticiones CSRF/cross-origin no autorizadas*/
/*    (comparación con APP_URL / NEXT_PUBLIC_SITE_URL).                */
/*  - rateLimit: ventana deslizante por IP en memoria del runtime.     */
/*  - redact: ofuscación de PII y secretos en cualquier log/traza.     */
/*  - constantTimeCompare: comparación de claves sin timing attacks.   */
/* ------------------------------------------------------------------ */

import { NextRequest } from 'next/server';

/* ------------------------------------------------------------------ */
/* 1. SOLO SERVIDOR                                                    */
/* ------------------------------------------------------------------ */

export function assertServerOnly(context = 'CROWN'):
  { ok: boolean; error?: string } {
  if (typeof window !== 'undefined') {
    return { ok: false, error: `${context}: módulo de servidor invocado en el cliente (violación de Zero Trust).` };
  }
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* 2. VERIFICACIÓN DE ORIGEN (anti-CSRF)                               */
/* ------------------------------------------------------------------ */

function normalizeOrigin(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}

function allowedOrigins(): string[] {
  const origins = new Set<string>();
  for (const env of ['APP_URL', 'NEXT_PUBLIC_SITE_URL', 'VERCEL_URL']) {
    const value = process.env[env];
    if (!value) continue;
    if (env === 'VERCEL_URL' && !value.startsWith('http')) {
      origins.add(normalizeOrigin(`https://${value}`));
    } else {
      origins.add(normalizeOrigin(value));
    }
  }
  /* En desarrollo local se permite el origen de Next dev */
  if (process.env.NODE_ENV === 'development') {
    origins.add('http://localhost:3000');
    origins.add('http://127.0.0.1:3000');
  }
  return [...origins];
}

export function verifyOrigin(req: NextRequest): { ok: boolean; reason?: string } {
  if (process.env.NODE_ENV === 'development') return { ok: true };
  const origins = allowedOrigins();
  if (origins.length === 0) return { ok: true }; /* sin origen configurado: no se puede comparar */
  const origin = req.headers.get('origin') ?? req.headers.get('referer');
  if (!origin) return { ok: true }; /* peticiones server-to-server sin origen */
  const normalized = normalizeOrigin(origin);
  if (origins.includes(normalized)) return { ok: true };
  return { ok: false, reason: 'Origen no autorizado (Zero Trust).' };
}

/* ------------------------------------------------------------------ */
/* 3. RATE LIMIT (ventana deslizante en memoria del runtime)           */
/* ------------------------------------------------------------------ */

interface Bucket {
  timestamps: number[];
}

const rateBuckets = new Map<string, Bucket>();
const RATE_WINDOW_MS = 60_000;

export function rateLimit(
  req: NextRequest,
  key: string,
  limit: number,
  windowMs: number = RATE_WINDOW_MS
): { ok: boolean; remaining: number; retryAfterMs: number } {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();

  let bucket = rateBuckets.get(bucketKey);
  if (!bucket) {
    bucket = { timestamps: [] };
    rateBuckets.set(bucketKey, bucket);
  }
  bucket.timestamps = bucket.timestamps.filter(t => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0];
    return { ok: false, remaining: 0, retryAfterMs: Math.max(1, oldest + windowMs - now) };
  }

  bucket.timestamps.push(now);
  return { ok: true, remaining: Math.max(0, limit - bucket.timestamps.length), retryAfterMs: 0 };
}

/** Libera memoria: poda los buckets expirados (llamar ocasionalmente). */
export function pruneRateBuckets(): void {
  const now = Date.now();
  for (const [key, bucket] of rateBuckets) {
    bucket.timestamps = bucket.timestamps.filter(t => now - t < RATE_WINDOW_MS);
    if (bucket.timestamps.length === 0) rateBuckets.delete(key);
  }
}

/* ------------------------------------------------------------------ */
/* 4. REDACCIÓN DE PII / SECRETOS (para logs y trazas)                 */
/* ------------------------------------------------------------------ */

const PII_PATTERNS: Array<[RegExp, string]> = [
  [/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[EMAIL]'],
  [/\+\d[\d\s-]{8,}/g, '[TEL]'],
  [/\b[A-Z]{4}\d{6}H[A-Z0-9]{9}\b/g, '[CURP]'],
  [/\b\d{13,19}\b/g, '[TARJETA]'],
  [/AIza[A-Za-z0-9_\-]{20,}/g, '[GEMINI_KEY]'],
  [/\bsk-[A-Za-z0-9]{16,}/g, '[SK_KEY]'],
  [/\bgsk_[A-Za-z0-9]{16,}/g, '[GATEWAY_KEY]'],
];

export function redact(input: string): string {
  let output = input;
  for (const [pattern, replacement] of PII_PATTERNS) {
    output = output.replace(pattern, replacement);
  }
  return output;
}

export function redactRecord(record: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (typeof value === 'string') out[key] = redact(value);
    else if (value && typeof value === 'object') out[key] = JSON.parse(redact(JSON.stringify(value)));
    else out[key] = value;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* 5. COMPARACIÓN EN TIEMPO CONSTANTE (anti timing-attack)             */
/* ------------------------------------------------------------------ */

export function constantTimeCompare(a: string, b: string): boolean {
  const ba = new TextEncoder().encode(a);
  const bb = new TextEncoder().encode(b);
  if (ba.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < ba.length; i++) diff |= ba[i] ^ bb[i];
  return diff === 0;
}

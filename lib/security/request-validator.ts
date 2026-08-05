/* ------------------------------------------------------------------ */
/* SECURITY YUN — Validación de requests de gamificación               */
/* ------------------------------------------------------------------ */

import { NextRequest, NextResponse } from 'next/server';

const MAX_BODY_BYTES = 16 * 1024;

export function methodGuard(req: NextRequest, allowed: string[]): NextResponse | null {
  if (!allowed.includes(req.method)) {
    return NextResponse.json(
      { ok: false, error: 'METHOD_NOT_ALLOWED' },
      { status: 405, headers: { Allow: allowed.join(', ') } },
    );
  }
  return null;
}

export function jsonContentGuard(req: NextRequest): NextResponse | null {
  const contentType = req.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json(
      { ok: false, error: 'UNSUPPORTED_MEDIA_TYPE', message: 'El cuerpo debe ser JSON (application/json).' },
      { status: 415 },
    );
  }
  return null;
}

export async function parseJsonBody(req: NextRequest): Promise<Record<string, unknown>> {
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    throw new Error('BODY_TOO_LARGE');
  }
  if (!raw) return {};
  const parsed = JSON.parse(raw) as unknown;
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('BODY_NOT_OBJECT');
  }
  return parsed as Record<string, unknown>;
}

export function requiredString(body: Record<string, unknown>, field: string): string | null {
  const value = body[field];
  if (typeof value !== 'string' || value.trim().length === 0) return field;
  return null;
}

export function requiredNumber(body: Record<string, unknown>, field: string): number | null {
  const value = body[field];
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return value;
}

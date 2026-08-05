import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { publishCityEvent, recentCityEvents } from '@/lib/city/city-event-bus';
import { methodGuard, jsonContentGuard, parseJsonBody } from '@/lib/security/request-validator';
import type { CityDomain, CitySeverity } from '@/lib/city/city-types';

const ROUTE_ID = 'api:city:events';
const RATE_LIMIT = 60;
const DOMAINS: CityDomain[] = ['police', 'fire', 'traffic', 'utilities', 'publicWorks', 'health', 'civilProtection', 'mobility', 'energy', 'water', 'environment'];
const SEVERITIES: CitySeverity[] = ['low', 'medium', 'high', 'critical'];

function enforceTrust(req: NextRequest): NextResponse | null {
  const server = assertServerOnly('CITY IOC');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });
  const origin = verifyOrigin(req);
  if (!origin.ok) return NextResponse.json({ ok: false, error: origin.reason }, { status: 403 });
  const rl = rateLimit(req, ROUTE_ID, RATE_LIMIT);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'Límite de eventos de ciudad alcanzado. Reintenta en un momento.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }
  return null;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const denied = enforceTrust(req);
  if (denied) return denied;
  const limit = Number(req.nextUrl.searchParams.get('limit') ?? 25);
  return NextResponse.json({ ok: true, events: recentCityEvents(Math.min(200, Math.max(1, limit))) });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const denied = enforceTrust(req);
  if (denied) return denied;
  const methodDenied = methodGuard(req, ['POST']);
  if (methodDenied) return methodDenied;
  const contentDenied = jsonContentGuard(req);
  if (contentDenied) return contentDenied;

  let body: Record<string, unknown>;
  try {
    body = await parseJsonBody(req);
  } catch {
    return NextResponse.json({ ok: false, error: 'BODY_INVALID' }, { status: 400 });
  }
  const type = typeof body.type === 'string' ? body.type : 'city.event';
  const domain = DOMAINS.includes(body.domain as CityDomain) ? (body.domain as CityDomain) : null;
  const severity = SEVERITIES.includes(body.severity as CitySeverity) ? (body.severity as CitySeverity) : 'medium';
  if (!domain) {
    return NextResponse.json({ ok: false, error: 'domain inválido' }, { status: 400 });
  }
  const event = publishCityEvent({
    type,
    domain,
    severity,
    payload: (body.payload ?? {}) as Record<string, unknown>,
  });
  return NextResponse.json({ ok: true, event }, { status: 201 });
}

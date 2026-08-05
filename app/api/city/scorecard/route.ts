import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { buildCityScorecard, scorecardToKpis } from '@/lib/city/city-scorecard';
import { buildCityIocState } from '@/lib/city/city-ioc-state';
import { listIncidents } from '@/lib/city/city-event-bus';

const ROUTE_ID = 'api:city:scorecard';
const RATE_LIMIT = 40;

function enforceTrust(req: NextRequest): NextResponse | null {
  const server = assertServerOnly('CITY IOC');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });
  const origin = verifyOrigin(req);
  if (!origin.ok) return NextResponse.json({ ok: false, error: origin.reason }, { status: 403 });
  const rl = rateLimit(req, ROUTE_ID, RATE_LIMIT);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'Límite de consultas del Nodo alcanzado. Reintenta en un momento.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }
  return null;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const denied = enforceTrust(req);
  if (denied) return denied;

  const incidents = listIncidents();
  const iocState = buildCityIocState(incidents);
  const scorecard = buildCityScorecard({ incidents, iocState });

  return NextResponse.json({
    ok: true,
    scorecard,
    kpis: scorecardToKpis(scorecard),
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { computeInfrastructureHealth } from '@/lib/city/city-infrastructure-engine';
import { buildCityIocState } from '@/lib/city/city-ioc-state';
import { buildMobilityState, seedTrafficSegments } from '@/lib/city/city-mobility-engine';
import { listIncidents } from '@/lib/city/city-event-bus';

const ROUTE_ID = 'api:city:infrastructure';
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
  const ioc = buildCityIocState(incidents);
  const mobility = buildMobilityState(seedTrafficSegments());
  const health = computeInfrastructureHealth({
    energyLoadPercent: ioc.energyLoadPercent,
    waterPressureAlerts: ioc.waterPressureAlerts,
    congestionIndex: mobility.congestionIndex,
    openWorkOrders: ioc.openWorkOrders,
    incidents,
  });

  return NextResponse.json({ ok: true, health, mobility, ioc });
}

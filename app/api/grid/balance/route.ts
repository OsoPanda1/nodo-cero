import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { seedPowerNodes, seedWaterNodes } from '@/lib/grid/grid-network';
import { computePowerBalance, computeWaterBalance } from '@/lib/grid/grid-balance';

const ROUTE_ID = 'api:grid:balance';
const RATE_LIMIT = 40;

function enforceTrust(req: NextRequest): NextResponse | null {
  const server = assertServerOnly('SMART GRID');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });
  const origin = verifyOrigin(req);
  if (!origin.ok) return NextResponse.json({ ok: false, error: origin.reason }, { status: 403 });
  const rl = rateLimit(req, ROUTE_ID, RATE_LIMIT);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'Límite de consultas de red alcanzado. Reintenta en un momento.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }
  return null;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const denied = enforceTrust(req);
  if (denied) return denied;
  const power = seedPowerNodes();
  const water = seedWaterNodes();
  return NextResponse.json({
    ok: true,
    power: computePowerBalance(power),
    water: computeWaterBalance(water),
  });
}

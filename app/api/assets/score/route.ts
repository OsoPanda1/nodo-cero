import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { listAssets } from '@/lib/assets/asset-registry';
import { computeApmScore } from '@/lib/assets/asset-apm-score';
import { generateWorkOrders, workOrderStats } from '@/lib/assets/asset-work-orders';

const ROUTE_ID = 'api:assets:score';
const RATE_LIMIT = 40;

function enforceTrust(req: NextRequest): NextResponse | null {
  const server = assertServerOnly('EAM/APM');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });
  const origin = verifyOrigin(req);
  if (!origin.ok) return NextResponse.json({ ok: false, error: origin.reason }, { status: 403 });
  const rl = rateLimit(req, ROUTE_ID, RATE_LIMIT);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'Límite de consultas EAM alcanzado. Reintenta en un momento.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }
  return null;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const denied = enforceTrust(req);
  if (denied) return denied;
  const assets = listAssets();
  const score = computeApmScore(assets);
  const orders = generateWorkOrders(assets);
  return NextResponse.json({
    ok: true,
    score,
    workOrders: orders,
    workOrderStats: workOrderStats(orders),
  });
}

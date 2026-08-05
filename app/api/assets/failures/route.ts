import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { listAssets, getAsset } from '@/lib/assets/asset-registry';
import { failureProbability, fleetFailureRisk } from '@/lib/assets/asset-failure-model';

const ROUTE_ID = 'api:assets:failures';
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
  const assetId = req.nextUrl.searchParams.get('assetId');
  if (assetId) {
    const asset = getAsset(assetId);
    if (!asset) return NextResponse.json({ ok: false, error: 'Activo no encontrado.' }, { status: 404 });
    return NextResponse.json({ ok: true, failure: failureProbability(asset) });
  }
  return NextResponse.json({ ok: true, fleet: fleetFailureRisk(assets) });
}

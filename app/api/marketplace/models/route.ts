import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { getListing, listListings } from '@/lib/marketplace/marketplace-store';

const ROUTE_ID = 'api:marketplace:models';
const RATE_LIMIT = 60;

function enforceTrust(req: NextRequest): NextResponse | null {
  const server = assertServerOnly('MARKETPLACE');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });
  const origin = verifyOrigin(req);
  if (!origin.ok) return NextResponse.json({ ok: false, error: origin.reason }, { status: 403 });
  const rl = rateLimit(req, ROUTE_ID, RATE_LIMIT);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'Límite de consultas del mercado alcanzado. Reintenta en un momento.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }
  return null;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const denied = enforceTrust(req);
  if (denied) return denied;
  const id = req.nextUrl.searchParams.get('id');
  if (id) {
    const listing = getListing(id);
    if (!listing) return NextResponse.json({ ok: false, error: 'Listado no encontrado.' }, { status: 404 });
    return NextResponse.json({ ok: true, listing });
  }
  const type = req.nextUrl.searchParams.get('type');
  const listings = type ? listListings().filter((l) => l.type === type) : listListings();
  return NextResponse.json({ ok: true, listings });
}

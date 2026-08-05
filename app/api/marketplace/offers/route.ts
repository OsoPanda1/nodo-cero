import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { listListings } from '@/lib/marketplace/marketplace-store';
import { searchListings } from '@/lib/marketplace/marketplace-search';
import { marketplaceSummary } from '@/lib/marketplace/marketplace-license';

const ROUTE_ID = 'api:marketplace:offers';
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
  const params = {
    type: req.nextUrl.searchParams.get('type') ?? undefined,
    status: req.nextUrl.searchParams.get('status') ?? undefined,
    tag: req.nextUrl.searchParams.get('tag') ?? undefined,
    query: req.nextUrl.searchParams.get('query') ?? undefined,
    maxPriceUsd: req.nextUrl.searchParams.get('maxPriceUsd') ? Number(req.nextUrl.searchParams.get('maxPriceUsd')) : undefined,
  };
  return NextResponse.json({
    ok: true,
    offers: searchListings(params),
    summary: marketplaceSummary(listListings()),
  });
}

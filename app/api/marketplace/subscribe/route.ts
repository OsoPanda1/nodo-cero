import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { getListing, listSubscriptions } from '@/lib/marketplace/marketplace-store';
import { acquireListing } from '@/lib/marketplace/marketplace-search';
import { methodGuard, jsonContentGuard, parseJsonBody } from '@/lib/security/request-validator';

const ROUTE_ID = 'api:marketplace:subscribe';
const RATE_LIMIT = 30;

function enforceTrust(req: NextRequest): NextResponse | null {
  const server = assertServerOnly('MARKETPLACE');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });
  const origin = verifyOrigin(req);
  if (!origin.ok) return NextResponse.json({ ok: false, error: origin.reason }, { status: 403 });
  const rl = rateLimit(req, ROUTE_ID, RATE_LIMIT);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'Límite de suscripciones alcanzado. Reintenta en un momento.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }
  return null;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const denied = enforceTrust(req);
  if (denied) return denied;
  const licensee = req.nextUrl.searchParams.get('licensee') ?? 'yun-node';
  const subs = listSubscriptions().filter((s) => s.licensee === licensee);
  const withListings = subs
    .map((sub) => {
      const listing = getListing(sub.listingId);
      return listing ? { subscription: sub, listing } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  return NextResponse.json({ ok: true, subscriptions: withListings });
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
  const listingId = typeof body.listingId === 'string' ? body.listingId : null;
  if (!listingId) return NextResponse.json({ ok: false, error: 'listingId requerido' }, { status: 400 });
  const licensee = typeof body.licensee === 'string' && body.licensee ? String(body.licensee) : 'yun-node';

  const result = acquireListing(listingId, licensee);
  if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  return NextResponse.json({ ...result }, { status: 201 });
}

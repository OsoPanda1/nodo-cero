import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { getListing, listSubscriptions } from '@/lib/marketplace/marketplace-store';
import { checkLicense, usageEntitlement } from '@/lib/marketplace/marketplace-license';
import { methodGuard, jsonContentGuard, parseJsonBody } from '@/lib/security/request-validator';

const ROUTE_ID = 'api:marketplace:license';
const RATE_LIMIT = 60;

function enforceTrust(req: NextRequest): NextResponse | null {
  const server = assertServerOnly('MARKETPLACE');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });
  const origin = verifyOrigin(req);
  if (!origin.ok) return NextResponse.json({ ok: false, error: origin.reason }, { status: 403 });
  const rl = rateLimit(req, ROUTE_ID, RATE_LIMIT);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'Límite de validaciones de licencia alcanzado. Reintenta en un momento.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }
  return null;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const denied = enforceTrust(req);
  if (denied) return denied;
  const listingId = req.nextUrl.searchParams.get('listingId');
  if (!listingId) return NextResponse.json({ ok: false, error: 'listingId requerido' }, { status: 400 });
  const licensee = req.nextUrl.searchParams.get('licensee') ?? 'yun-node';

  const listing = getListing(listingId);
  if (!listing) return NextResponse.json({ ok: false, error: 'Listado no encontrado.' }, { status: 404 });
  const subscription = listSubscriptions().find((s) => s.listingId === listingId && s.licensee === licensee);

  return NextResponse.json({
    ok: true,
    check: checkLicense(listing, subscription),
    entitlement: usageEntitlement(listing, subscription),
  });
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

  const listing = getListing(listingId);
  if (!listing) return NextResponse.json({ ok: false, error: 'Listado no encontrado.' }, { status: 404 });
  const subscription = listSubscriptions().find((s) => s.listingId === listingId && s.licensee === licensee);

  const check = checkLicense(listing, subscription);
  return NextResponse.json({ ok: true, check, entitlement: usageEntitlement(listing, subscription) });
}

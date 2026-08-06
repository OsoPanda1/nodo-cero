import { NextResponse } from 'next/server';
import { guardedRoute } from '@/app/api/_shared/route-guard';
import { getListing, listSubscriptions } from '@/lib/marketplace/marketplace-store';
import { checkLicense, usageEntitlement } from '@/lib/marketplace/marketplace-license';

/* Ruta migrada al route-guard único (antes duplicaba enforceTrust con
   assertServerOnly + verifyOrigin + rateLimit y el bloque
   methodGuard + jsonContentGuard + parseJsonBody). */

export const GET = guardedRoute(
  {
    route: 'api:marketplace:license',
    methods: ['GET'],
    rateLimit: 60,
    json: false,
  },
  async ({ req }) => {
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
  },
);

export const POST = guardedRoute(
  {
    route: 'api:marketplace:license',
    methods: ['POST'],
    rateLimit: 60,
  },
  async ({ body }) => {
    const listingId = typeof body.listingId === 'string' ? body.listingId : null;
    if (!listingId) return NextResponse.json({ ok: false, error: 'listingId requerido' }, { status: 400 });
    const licensee = typeof body.licensee === 'string' && body.licensee ? String(body.licensee) : 'yun-node';

    const listing = getListing(listingId);
    if (!listing) return NextResponse.json({ ok: false, error: 'Listado no encontrado.' }, { status: 404 });
    const subscription = listSubscriptions().find((s) => s.listingId === listingId && s.licensee === licensee);

    const check = checkLicense(listing, subscription);
    return NextResponse.json({ ok: true, check, entitlement: usageEntitlement(listing, subscription) });
  },
);

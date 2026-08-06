import { NextResponse } from 'next/server';
import { guardedRoute } from '@/app/api/_shared/route-guard';
import { getListing, listSubscriptions } from '@/lib/marketplace/marketplace-store';
import { acquireListing } from '@/lib/marketplace/marketplace-search';

/* Ruta migrada al route-guard único (antes duplicaba enforceTrust con
   assertServerOnly + verifyOrigin + rateLimit y el bloque
   methodGuard + jsonContentGuard + parseJsonBody). */

export const GET = guardedRoute(
  {
    route: 'api:marketplace:subscribe',
    methods: ['GET'],
    rateLimit: 30,
    json: false,
  },
  async ({ req }) => {
    const licensee = req.nextUrl.searchParams.get('licensee') ?? 'yun-node';
    const subs = listSubscriptions().filter((s) => s.licensee === licensee);
    const withListings = subs
      .map((sub) => {
        const listing = getListing(sub.listingId);
        return listing ? { subscription: sub, listing } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
    return NextResponse.json({ ok: true, subscriptions: withListings });
  },
);

export const POST = guardedRoute(
  {
    route: 'api:marketplace:subscribe',
    methods: ['POST'],
    rateLimit: 30,
  },
  async ({ body }) => {
    const listingId = typeof body.listingId === 'string' ? body.listingId : null;
    if (!listingId) return NextResponse.json({ ok: false, error: 'listingId requerido' }, { status: 400 });
    const licensee = typeof body.licensee === 'string' && body.licensee ? String(body.licensee) : 'yun-node';

    const result = acquireListing(listingId, licensee);
    if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    return NextResponse.json({ ...result }, { status: 201 });
  },
);

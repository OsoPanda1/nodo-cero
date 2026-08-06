import { NextResponse } from 'next/server';
import { guardedRoute } from '@/app/api/_shared/route-guard';
import { publishCityEvent, recentCityEvents } from '@/lib/city/city-event-bus';
import type { CityDomain, CitySeverity } from '@/lib/city/city-types';

const DOMAINS: CityDomain[] = ['police', 'fire', 'traffic', 'utilities', 'publicWorks', 'health', 'civilProtection', 'mobility', 'energy', 'water', 'environment'];
const SEVERITIES: CitySeverity[] = ['low', 'medium', 'high', 'critical'];

/* Ruta migrada al route-guard único (antes duplicaba enforceTrust
   con assertServerOnly + verifyOrigin + rateLimit + parseJsonBody).
   La validación manual de dominio/severidad se conserva en el handler. */

export const GET = guardedRoute(
  {
    route: 'api:city:events',
    methods: ['GET'],
    rateLimit: 60,
    json: false,
  },
  async ({ req }) => {
    const limit = Number(req.nextUrl.searchParams.get('limit') ?? 25);
    return NextResponse.json({ ok: true, events: recentCityEvents(Math.min(200, Math.max(1, limit))) });
  },
);

export const POST = guardedRoute(
  {
    route: 'api:city:events',
    methods: ['POST'],
    rateLimit: 60,
  },
  async ({ body }) => {
    const type = typeof body.type === 'string' ? body.type : 'city.event';
    const domain = DOMAINS.includes(body.domain as CityDomain) ? (body.domain as CityDomain) : null;
    const severity = SEVERITIES.includes(body.severity as CitySeverity) ? (body.severity as CitySeverity) : 'medium';
    if (!domain) {
      return NextResponse.json({ ok: false, error: 'domain inválido' }, { status: 400 });
    }
    const event = publishCityEvent({
      type,
      domain,
      severity,
      payload: (body.payload ?? {}) as Record<string, unknown>,
    });
    return NextResponse.json({ ok: true, event }, { status: 201 });
  },
);

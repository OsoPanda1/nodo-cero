import { NextResponse } from 'next/server';
import { guardedRoute } from '@/app/api/_shared/route-guard';
import { addIncident, getIncident, listIncidents, updateIncident } from '@/lib/city/city-event-bus';
import { autoTriageIncident, rankIncidents } from '@/lib/city/city-incident-engine';
import type { CityDomain, CityIncident, CitySeverity, CityIncidentSource } from '@/lib/city/city-types';

const DOMAINS: CityDomain[] = ['police', 'fire', 'traffic', 'utilities', 'publicWorks', 'health', 'civilProtection', 'mobility', 'energy', 'water', 'environment'];
const SEVERITIES: CitySeverity[] = ['low', 'medium', 'high', 'critical'];
const SOURCES: CityIncidentSource[] = ['sensor', 'citizen', 'operator', 'integration', 'ai'];

/* Ruta migrada al route-guard único (antes duplicaba enforceTrust
   con assertServerOnly + verifyOrigin + rateLimit + parseJsonBody).
   La validación manual de los cuerpos se conserva en cada handler. */

export const GET = guardedRoute(
  {
    route: 'api:city:incidents',
    methods: ['GET'],
    rateLimit: 50,
    json: false,
  },
  async () => {
    const incidents = rankIncidents(listIncidents());
    return NextResponse.json({ ok: true, incidents });
  },
);

export const POST = guardedRoute(
  {
    route: 'api:city:incidents',
    methods: ['POST'],
    rateLimit: 50,
  },
  async ({ body }) => {
    const domain = DOMAINS.includes(body.domain as CityDomain) ? (body.domain as CityDomain) : null;
    const severity = SEVERITIES.includes(body.severity as CitySeverity) ? (body.severity as CitySeverity) : 'medium';
    const source = SOURCES.includes(body.source as CityIncidentSource) ? (body.source as CityIncidentSource) : 'operator';
    if (!domain || typeof body.title !== 'string' || !body.title) {
      return NextResponse.json({ ok: false, error: 'Campos requeridos: domain, title' }, { status: 400 });
    }

    const draft: CityIncident = {
      id: `inc-${Math.random().toString(36).slice(2, 8)}`,
      domain,
      title: String(body.title).slice(0, 160),
      description: typeof body.description === 'string' ? body.description.slice(0, 500) : '',
      severity,
      status: 'open',
      source,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: Array.isArray(body.tags) ? (body.tags as string[]).slice(0, 12) : [],
      relatedEntityIds: Array.isArray(body.relatedEntityIds) ? (body.relatedEntityIds as string[]).slice(0, 12) : [],
    };
    const incident = addIncident(autoTriageIncident(draft));

    if (body.id && typeof body.id === 'string') {
      const existing = getIncident(body.id);
      if (existing && incident) {
        return NextResponse.json({ ok: true, incident: existing }, { status: 200 });
      }
    }

    return NextResponse.json({ ok: true, incident }, { status: 201 });
  },
);

export const PATCH = guardedRoute(
  {
    route: 'api:city:incidents',
    methods: ['PATCH'],
    rateLimit: 50,
  },
  async ({ body }) => {
    const id = typeof body.id === 'string' ? body.id : null;
    if (!id) return NextResponse.json({ ok: false, error: 'id requerido' }, { status: 400 });

    const statuses: Array<CityIncident['status']> = ['open', 'triaged', 'assigned', 'mitigated', 'closed'];
    const patch: Parameters<typeof updateIncident>[1] = {};
    if (statuses.includes(body.status as CityIncident['status'])) patch.status = body.status as CityIncident['status'];
    if (SEVERITIES.includes(body.severity as CitySeverity)) patch.severity = body.severity as CitySeverity;
    if (typeof body.description === 'string') patch.description = body.description;
    if (Array.isArray(body.tags)) patch.tags = body.tags as string[];

    const updated = updateIncident(id, patch);
    if (!updated) return NextResponse.json({ ok: false, error: 'Incidente no encontrado.' }, { status: 404 });
    return NextResponse.json({ ok: true, incident: updated });
  },
);

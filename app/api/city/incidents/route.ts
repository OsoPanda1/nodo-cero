import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { addIncident, getIncident, listIncidents, updateIncident } from '@/lib/city/city-event-bus';
import { autoTriageIncident, rankIncidents } from '@/lib/city/city-incident-engine';
import { methodGuard, jsonContentGuard, parseJsonBody } from '@/lib/security/request-validator';
import type { CityDomain, CityIncident, CitySeverity, CityIncidentSource } from '@/lib/city/city-types';

const ROUTE_ID = 'api:city:incidents';
const RATE_LIMIT = 50;
const DOMAINS: CityDomain[] = ['police', 'fire', 'traffic', 'utilities', 'publicWorks', 'health', 'civilProtection', 'mobility', 'energy', 'water', 'environment'];
const SEVERITIES: CitySeverity[] = ['low', 'medium', 'high', 'critical'];
const SOURCES: CityIncidentSource[] = ['sensor', 'citizen', 'operator', 'integration', 'ai'];

function enforceTrust(req: NextRequest): NextResponse | null {
  const server = assertServerOnly('CITY IOC');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });
  const origin = verifyOrigin(req);
  if (!origin.ok) return NextResponse.json({ ok: false, error: origin.reason }, { status: 403 });
  const rl = rateLimit(req, ROUTE_ID, RATE_LIMIT);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'Límite de consultas del Nodo alcanzado. Reintenta en un momento.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }
  return null;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const denied = enforceTrust(req);
  if (denied) return denied;
  const incidents = rankIncidents(listIncidents());
  return NextResponse.json({ ok: true, incidents });
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
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const denied = enforceTrust(req);
  if (denied) return denied;
  const methodDenied = methodGuard(req, ['PATCH']);
  if (methodDenied) return methodDenied;
  const contentDenied = jsonContentGuard(req);
  if (contentDenied) return contentDenied;

  let body: Record<string, unknown>;
  try {
    body = await parseJsonBody(req);
  } catch {
    return NextResponse.json({ ok: false, error: 'BODY_INVALID' }, { status: 400 });
  }
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
}

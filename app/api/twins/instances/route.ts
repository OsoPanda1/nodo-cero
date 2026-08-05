import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { getTwinInstance, getTwinInstances, upsertTwinInstance } from '@/lib/twins/twin-store';
import type { TwinInstanceRecord } from '@/lib/twins/twin-types';

const ROUTE_ID = 'api:twins:instances';
const RATE_LIMIT = 40;

function enforceTrust(req: NextRequest): NextResponse | null {
  const server = assertServerOnly('TWINS');
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

  const id = req.nextUrl.searchParams.get('id');
  if (id) {
    const instance = getTwinInstance(id);
    return NextResponse.json({ ok: Boolean(instance), instance });
  }
  return NextResponse.json({ ok: true, instances: getTwinInstances() });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const denied = enforceTrust(req);
  if (denied) return denied;

  let body: Partial<TwinInstanceRecord>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'BODY_INVALID' }, { status: 400 });
  }
  if (!body.id || !body.modelId || !body.name) {
    return NextResponse.json({ ok: false, error: 'Campos requeridos: id, modelId, name' }, { status: 400 });
  }
  const instance: TwinInstanceRecord = {
    id: String(body.id),
    modelId: String(body.modelId),
    name: String(body.name),
    externalRef: typeof body.externalRef === 'string' ? body.externalRef : undefined,
    lat: typeof body.lat === 'number' ? body.lat : undefined,
    lng: typeof body.lng === 'number' ? body.lng : undefined,
    properties: (body.properties ?? {}) as Record<string, unknown>,
    telemetry: (body.telemetry ?? {}) as Record<string, unknown>,
    status: body.status ?? 'healthy',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  upsertTwinInstance(instance);
  return NextResponse.json({ ok: true, instance });
}

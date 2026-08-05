import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { getTwinInstance } from '@/lib/twins/twin-store';
import { simulateTwin } from '@/lib/twins/twin-simulator';
import type { TwinInstanceRecord } from '@/lib/twins/twin-types';

const ROUTE_ID = 'api:twins:simulate';
const RATE_LIMIT = 60;

function enforceTrust(req: NextRequest): NextResponse | null {
  const server = assertServerOnly('TWINS');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });
  const origin = verifyOrigin(req);
  if (!origin.ok) return NextResponse.json({ ok: false, error: origin.reason }, { status: 403 });
  const rl = rateLimit(req, ROUTE_ID, RATE_LIMIT);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'Límite de simulaciones del Nodo alcanzado. Reintenta en un momento.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }
  return null;
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

  const instanceId = typeof body.id === 'string' ? body.id : null;
  const instance = instanceId ? getTwinInstance(instanceId) : undefined;
  const candidate: TwinInstanceRecord = instance ?? {
    id: instanceId ?? 'sim-unknown',
    modelId: typeof body.modelId === 'string' ? body.modelId : 'dtmi:rdm:twin:Building;1',
    name: typeof body.name === 'string' ? body.name : 'Simulación',
    properties: (body.properties ?? {}) as Record<string, unknown>,
    telemetry: (body.telemetry ?? {}) as Record<string, unknown>,
    status: 'healthy',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = simulateTwin(candidate);
  return NextResponse.json({ ok: true, result });
}

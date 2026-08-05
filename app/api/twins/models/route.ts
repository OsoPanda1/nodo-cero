import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { getModels, registerModel } from '@/lib/twins/twin-store';
import { TWIN_MODELS } from '@/lib/twins/dtdl';
import type { TwinModelRecord } from '@/lib/twins/twin-types';

const ROUTE_ID = 'api:twins:models';
const RATE_LIMIT = 30;

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

  if (getModels().length === 0) {
    for (const model of TWIN_MODELS) {
      registerModel({
        id: String(model['@id']),
        dtmi: String(model['@id']),
        name: String(model.displayName),
        version: 1,
        domain: model['@id'].includes('Building') ? 'building' : 'custom',
        schema: model,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  const custom = getModels();
  const domain =
    typeof req.nextUrl.searchParams.get('domain') === 'string' ? req.nextUrl.searchParams.get('domain') : null;
  const models = domain ? custom.filter((m) => m.domain === domain) : custom;
  return NextResponse.json({ ok: true, models });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const denied = enforceTrust(req);
  if (denied) return denied;

  let body: Partial<TwinModelRecord>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'BODY_INVALID' }, { status: 400 });
  }
  if (!body.dtmi || !body.name || !body.schema) {
    return NextResponse.json({ ok: false, error: 'Campos requeridos: dtmi, name, schema' }, { status: 400 });
  }
  const model: TwinModelRecord = {
    id: body.id ?? body.dtmi,
    dtmi: String(body.dtmi),
    name: String(body.name),
    version: Number(body.version ?? 1),
    domain: body.domain ?? 'custom',
    schema: body.schema,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  registerModel(model);
  return NextResponse.json({ ok: true, model });
}

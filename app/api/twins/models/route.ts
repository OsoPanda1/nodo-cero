import { NextResponse } from 'next/server';
import { guardedRoute } from '@/app/api/_shared/route-guard';
import { getModels, registerModel } from '@/lib/twins/twin-store';
import { TWIN_MODELS } from '@/lib/twins/dtdl';
import type { TwinModelRecord } from '@/lib/twins/twin-types';

/* Ruta migrada al route-guard único (antes duplicaba enforceTrust
   con assertServerOnly + verifyOrigin + rateLimit). La validación de
   campos obligatorios (dtmi, name, schema) se conserva en el handler. */

export const GET = guardedRoute(
  {
    route: 'api:twins:models',
    methods: ['GET'],
    rateLimit: 30,
    json: false,
  },
  async ({ req }) => {
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
  },
);

export const POST = guardedRoute<Partial<TwinModelRecord>>(
  {
    route: 'api:twins:models',
    methods: ['POST'],
    rateLimit: 30,
  },
  async ({ body }) => {
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
  },
);

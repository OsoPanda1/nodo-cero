import { NextResponse } from 'next/server';
import { guardedRoute } from '@/app/api/_shared/route-guard';
import { getTwinInstance, getTwinInstances, upsertTwinInstance } from '@/lib/twins/twin-store';
import type { TwinInstanceRecord } from '@/lib/twins/twin-types';

/* Ruta migrada al route-guard único (antes duplicaba enforceTrust
   con assertServerOnly + verifyOrigin + rateLimit). La validación de
   campos obligatorios (id, modelId, name) se conserva en el handler. */

export const GET = guardedRoute(
  {
    route: 'api:twins:instances',
    methods: ['GET'],
    rateLimit: 40,
    json: false,
  },
  async ({ req }) => {
    const id = req.nextUrl.searchParams.get('id');
    if (id) {
      const instance = getTwinInstance(id);
      return NextResponse.json({ ok: Boolean(instance), instance });
    }
    return NextResponse.json({ ok: true, instances: getTwinInstances() });
  },
);

export const POST = guardedRoute<Partial<TwinInstanceRecord>>(
  {
    route: 'api:twins:instances',
    methods: ['POST'],
    rateLimit: 40,
  },
  async ({ body }) => {
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
  },
);

import { NextResponse } from 'next/server';
import { guardedRoute } from '@/app/api/_shared/route-guard';
import { getTwinInstance } from '@/lib/twins/twin-store';
import { simulateTwin } from '@/lib/twins/twin-simulator';
import type { TwinInstanceRecord } from '@/lib/twins/twin-types';

/* Ruta migrada al route-guard único (antes duplicaba enforceTrust
   con assertServerOnly + verifyOrigin + rateLimit). */

export const POST = guardedRoute<Partial<TwinInstanceRecord>>(
  {
    route: 'api:twins:simulate',
    methods: ['POST'],
    rateLimit: 60,
  },
  async ({ body }) => {
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
  },
);

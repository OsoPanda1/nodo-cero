import { NextResponse } from 'next/server';
import { guardedRoute } from '@/app/api/_shared/route-guard';
import { monitor } from '@/lib/monitoring/monitor';
import type { HealthStatus } from '@/lib/monitoring/monitor';
import { verifyInternalKey, hasInternalKey } from '@/lib/security/keys';
import { getTwinInstances } from '@/lib/twins/twin-store';
import { listIncidents } from '@/lib/city/city-event-bus';
import { listAssets } from '@/lib/assets/asset-registry';
import { seedPowerNodes, seedWaterNodes } from '@/lib/grid/grid-network';
import { listListings } from '@/lib/marketplace/marketplace-store';
import { getGatewayStatus } from '@/lib/isabella/crown-gateway';
import { getGamificationStats } from '@/lib/gamification/store';

/* ------------------------------------------------------------------ */
/* Health checks por dominio del Nodo Cero                             */
/* ------------------------------------------------------------------ */
/* Todos los chequeos son de SOLO LECTURA: no se re-siembra ni se      */
/* muta estado (los builders de grid son puros y deterministas).       */
/* ------------------------------------------------------------------ */
function registerDomainHealth(): void {
  const register = (name: string, fn: () => { status: HealthStatus; detail: string }) =>
    monitor.registerHealth(name, fn);

  register('twins', () => {
    const count = getTwinInstances().length;
    return {
      status: count > 0 ? 'up' : 'degraded',
      detail: `${count} gemelos registrados`,
    };
  });

  register('city-ioc', () => {
    const count = listIncidents().length;
    return {
      status: count > 0 ? 'up' : 'degraded',
      detail: `${count} incidentes en el IOC`,
    };
  });

  register('eam-assets', () => {
    const count = listAssets().length;
    return {
      status: count > 0 ? 'up' : 'degraded',
      detail: `${count} activos registrados`,
    };
  });

  register('grid', () => {
    const power = seedPowerNodes().length;
    const water = seedWaterNodes().length;
    return {
      status: power + water > 0 ? 'up' : 'degraded',
      detail: `${power} nodos de energía · ${water} nodos de agua`,
    };
  });

  register('marketplace', () => {
    const count = listListings().length;
    return {
      status: count > 0 ? 'up' : 'degraded',
      detail: `${count} ofertas publicadas`,
    };
  });

  register('isabella', () => {
    const status = getGatewayStatus();
    return {
      status: status.providers?.length > 0 ? 'up' : 'degraded',
      detail: `${status.providers?.length ?? 0} proveedores · modo=${status.mode}`,
    };
  });

  register('gamification', () => {
    const stats = getGamificationStats();
    return {
      status: 'up',
      detail: `sesiones=${stats.activeSessions} · kills=${stats.totalKills} · pts=${stats.totalPoints}`,
    };
  });
}

registerDomainHealth();

export const dynamic = 'force-dynamic';

/* ------------------------------------------------------------------ */
/* GET /api/monitor/health — salud de todos los dominios               */
/* ------------------------------------------------------------------ */
/* Ruta migrada al route-guard único. La clave interna MONITOR_API_KEY */
/* se conserva dentro del handler (condicionada a hasInternalKey).     */
/* ------------------------------------------------------------------ */
export const GET = guardedRoute(
  {
    route: 'api:monitor:health',
    methods: ['GET'],
    rateLimit: 120,
    json: false,
  },
  async ({ req }) => {
    if (hasInternalKey('MONITOR_API_KEY')) {
      const key = req.headers.get('x-rdm-api-key');
      if (!verifyInternalKey('MONITOR_API_KEY', key)) {
        return NextResponse.json({ ok: false, error: 'Clave de monitor no autorizada.' }, { status: 401 });
      }
    }

    const checks = await monitor.healthSnapshot();
    const overall = monitor.overallHealth(checks);

    monitor.metrics.set('health_up', overall.up, {});
    monitor.metrics.set('health_degraded', overall.degraded, {});
    monitor.metrics.set('health_down', overall.down, {});

    return NextResponse.json({ ok: true, overall, checkedAt: Date.now(), checks });
  },
);

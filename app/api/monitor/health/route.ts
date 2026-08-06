import { NextRequest, NextResponse } from 'next/server';
import { monitor } from '@/lib/monitoring/monitor';
import type { HealthStatus } from '@/lib/monitoring/monitor';
import { assertServerOnly } from '@/lib/isabella/trust';
import { verifyInternalKey, hasInternalKey } from '@/lib/security/keys';
import { assertZeroTrust } from '@/lib/security/zero-trust';

/* ------------------------------------------------------------------ */
/* Health checks por dominio del Nodo Cero                             */
/* ------------------------------------------------------------------ */
function registerDomainHealth(): void {
  const register = (name: string, fn: () => { status: HealthStatus; detail: string }) =>
    monitor.registerHealth(name, fn);

  register('twins', () => {
    const { getTwinInstances } = require('@/lib/twins/twin-store') as typeof import('@/lib/twins/twin-store');
    const count = getTwinInstances().length;
    return {
      status: count > 0 ? 'up' : 'degraded',
      detail: `${count} gemelos registrados`,
    };
  });

  register('city-ioc', () => {
    const { listIncidents } = require('@/lib/city/city-event-bus') as typeof import('@/lib/city/city-event-bus');
    const count = listIncidents().length;
    return {
      status: count > 0 ? 'up' : 'degraded',
      detail: `${count} incidentes en el IOC`,
    };
  });

  register('eam-assets', () => {
    const { listAssets } = require('@/lib/assets/asset-registry') as typeof import('@/lib/assets/asset-registry');
    const count = listAssets().length;
    return {
      status: count > 0 ? 'up' : 'degraded',
      detail: `${count} activos registrados`,
    };
  });

  register('grid', () => {
    const { seedPowerNodes, seedWaterNodes } = require('@/lib/grid/grid-network') as typeof import('@/lib/grid/grid-network');
    const power = seedPowerNodes().length;
    const water = seedWaterNodes().length;
    return {
      status: power + water > 0 ? 'up' : 'degraded',
      detail: `${power} nodos de energía · ${water} nodos de agua`,
    };
  });

  register('marketplace', () => {
    const { listListings } = require('@/lib/marketplace/marketplace-store') as typeof import('@/lib/marketplace/marketplace-store');
    const count = listListings().length;
    return {
      status: count > 0 ? 'up' : 'degraded',
      detail: `${count} ofertas publicadas`,
    };
  });

  register('isabella', () => {
    const { getGatewayStatus } = require('@/lib/isabella/crown-gateway') as typeof import('@/lib/isabella/crown-gateway');
    const status = getGatewayStatus();
    return {
      status: status.providers?.length > 0 ? 'up' : 'degraded',
      detail: `${status.providers?.length ?? 0} proveedores · modo=${status.mode}`,
    };
  });

  register('gamification', () => {
    const { getGamificationStats } = require('@/lib/gamification/store') as typeof import('@/lib/gamification/store');
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
export async function GET(req: NextRequest) {
  const server = assertServerOnly('Monitor Health');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });

  const zt = assertZeroTrust(req.headers, { route: '/api/monitor/health', limit: 120 });
  if (!zt.ok) {
    return NextResponse.json({ ok: false, error: `Zero Trust: ${zt.deniedBy}` }, { status: 403 });
  }

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
}

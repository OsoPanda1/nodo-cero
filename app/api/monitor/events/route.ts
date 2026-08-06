import { NextRequest, NextResponse } from 'next/server';
import { monitor } from '@/lib/monitoring/monitor';
import type { EventSeverity } from '@/lib/monitoring/events';
import { assertServerOnly } from '@/lib/isabella/trust';
import { verifyInternalKey, hasInternalKey } from '@/lib/security/keys';
import { assertZeroTrust } from '@/lib/security/zero-trust';

export const dynamic = 'force-dynamic';

/* ------------------------------------------------------------------ */
/* GET /api/monitor/events?type=&source=&minSeverity=&sinceMs=&limit= */
/* Consulta de eventos correlacionados del sistema.                   */
/* ------------------------------------------------------------------ */
export async function GET(req: NextRequest) {
  const server = assertServerOnly('Monitor Events');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });

  const zt = assertZeroTrust(req.headers, { route: '/api/monitor/events', limit: 120 });
  if (!zt.ok) {
    return NextResponse.json({ ok: false, error: `Zero Trust: ${zt.deniedBy}` }, { status: 403 });
  }

  if (hasInternalKey('MONITOR_API_KEY')) {
    const key = req.headers.get('x-rdm-api-key');
    if (!verifyInternalKey('MONITOR_API_KEY', key)) {
      return NextResponse.json({ ok: false, error: 'Clave de monitor no autorizada.' }, { status: 401 });
    }
  }

  const params = req.nextUrl.searchParams;
  const minSeverity = (params.get('minSeverity') ?? undefined) as EventSeverity | undefined;
  const limit = Math.min(500, Number(params.get('limit') ?? 200));

  const events = monitor.events.query({
    type: params.get('type') ?? undefined,
    source: params.get('source') ?? undefined,
    minSeverity,
    sinceMs: params.get('sinceMs') ? Number(params.get('sinceMs')) : undefined,
    limit,
    correlationId: params.get('correlationId') ?? undefined,
  });

  return NextResponse.json({ ok: true, count: events.length, events });
}

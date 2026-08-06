import { NextRequest, NextResponse } from 'next/server';
import { monitor } from '@/lib/monitoring/monitor';
import { assertServerOnly } from '@/lib/isabella/trust';
import { verifyInternalKey, hasInternalKey } from '@/lib/security/keys';
import { assertZeroTrust } from '@/lib/security/zero-trust';

export const dynamic = 'force-dynamic';

/* ------------------------------------------------------------------ */
/* GET /api/monitor/state — estado completo del sistema                */
/* Protegida con MONITOR_API_KEY (si está configurada).               */
/* ------------------------------------------------------------------ */
export async function GET(req: NextRequest) {
  const server = assertServerOnly('Monitor');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });

  const zt = assertZeroTrust(req.headers, { route: '/api/monitor/state', limit: 120 });
  if (!zt.ok) {
    return NextResponse.json(
      { ok: false, error: `Zero Trust: ${zt.deniedBy}`, layers: zt.layers },
      { status: 403 },
    );
  }

  if (hasInternalKey('MONITOR_API_KEY')) {
    const key = req.headers.get('x-rdm-api-key');
    if (!verifyInternalKey('MONITOR_API_KEY', key)) {
      return NextResponse.json({ ok: false, error: 'Clave de monitor no autorizada.' }, { status: 401 });
    }
  }

  const snapshot = monitor.statusSnapshot();
  return NextResponse.json({
    ok: true,
    ...snapshot,
  });
}

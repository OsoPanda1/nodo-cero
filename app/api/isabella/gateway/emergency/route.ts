import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin, constantTimeCompare } from '@/lib/isabella/trust';
import {
  armEmergency,
  disarmEmergency,
  getEmergencyStatus,
  heartbeat,
} from '@/lib/isabella/dead-man-switch';

/* ------------------------------------------------------------------ */
/* GET /api/isabella/gateway/emergency — estado del plan de emergencia */
/* ------------------------------------------------------------------ */
export async function GET() {
  return NextResponse.json({ ok: true, emergency: getEmergencyStatus() });
}

/* ------------------------------------------------------------------ */
/* POST /api/isabella/gateway/emergency                               */
/*   body: { action: 'arm' | 'disarm' | 'heartbeat', reason?, key? }  */
/*  - arm:       activa LOCKDOWN (requiere CROWN_EMERGENCY_KEY)       */
/*  - disarm:    desactiva (requiere CROWN_EMERGENCY_KEY)             */
/*  - heartbeat: renueva el latido del Dead Man's Switch              */
/* ------------------------------------------------------------------ */
export async function POST(req: NextRequest) {
  const server = assertServerOnly('CROWN Emergency');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });

  const origin = verifyOrigin(req);
  if (!origin.ok) return NextResponse.json({ ok: false, error: origin.reason }, { status: 403 });

  const rl = rateLimit(req, 'crown-emergency', 10);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'Límite de operaciones de emergencia alcanzado.' },
      { status: 429 }
    );
  }

  try {
    const body = (await req.json().catch(() => null)) as
      | { action?: string; reason?: string; key?: string }
      | null;

    if (!body || typeof body.action !== 'string') {
      return NextResponse.json({ ok: false, error: 'Campo action requerido: arm | disarm | heartbeat.' }, { status: 400 });
    }

    switch (body.action) {
      case 'heartbeat': {
        const at = heartbeat();
        return NextResponse.json({ ok: true, heartbeatAt: at, emergency: getEmergencyStatus() });
      }

      case 'arm': {
        if (typeof body.key !== 'string') {
          return NextResponse.json({ ok: false, error: 'Clave de operador requerida para armar.' }, { status: 401 });
        }
        const expected = process.env.CROWN_EMERGENCY_KEY;
        if (!expected || !constantTimeCompare(body.key, expected)) {
          return NextResponse.json({ ok: false, error: 'Clave de emergencia inválida.' }, { status: 403 });
        }
        armEmergency('manual', body.reason ?? 'Activado manualmente por el operador del Nodo.');
        return NextResponse.json({ ok: true, emergency: getEmergencyStatus() });
      }

      case 'disarm': {
        if (typeof body.key !== 'string') {
          return NextResponse.json({ ok: false, error: 'Clave de operador requerida para desarmar.' }, { status: 401 });
        }
        const result = disarmEmergency(body.key);
        if (!result.ok) {
          return NextResponse.json({ ok: false, error: result.error }, { status: 403 });
        }
        return NextResponse.json({ ok: true, emergency: getEmergencyStatus() });
      }

      default:
        return NextResponse.json({ ok: false, error: 'Acción desconocida. Usa arm | disarm | heartbeat.' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({
      ok: false,
      error: 'CROWN Emergency: error interno.',
    }, { status: 500 });
  }
}

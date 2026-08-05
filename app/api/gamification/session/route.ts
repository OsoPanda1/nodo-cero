import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { signSessionToken } from '@/lib/security/auth-tokens';
import { jsonContentGuard, methodGuard, parseJsonBody, requiredString } from '@/lib/security/request-validator';
import { createSession, endSession, getActiveSessionByDevice } from '@/lib/gamification/store';
import { uuid } from '@/lib/isabella/utils';

export const runtime = 'nodejs';
const ROUTE_ID = 'api:gamification:session';
const RATE_LIMIT = 20;

function enforceTrust(req: NextRequest): NextResponse | null {
  const server = assertServerOnly('GAMIFICATION');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });
  const origin = verifyOrigin(req);
  if (!origin.ok) return NextResponse.json({ ok: false, error: origin.reason }, { status: 403 });
  const rl = rateLimit(req, ROUTE_ID, RATE_LIMIT);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'Límite de sesiones del Nodo alcanzado. Reintenta en un momento.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }
  return null;
}

async function startSession(body: Record<string, unknown>) {
  const deviceId = requiredString(body, 'deviceId');
  if (deviceId) {
    return NextResponse.json({ ok: false, error: `Campo requerido: ${deviceId}` }, { status: 400 });
  }
  const deviceIdValue = String(body.deviceId).slice(0, 128);
  const name = typeof body.name === 'string' ? body.name.slice(0, 40) : undefined;
  const actorId = typeof body.actorId === 'string' && body.actorId ? String(body.actorId).slice(0, 64) : `guardian-${deviceIdValue.slice(0, 12)}`;

  const existing = getActiveSessionByDevice(deviceIdValue);
  if (existing) {
    const token = signSessionToken({ sessionId: existing.id, deviceId: deviceIdValue, actorId: existing.actorId });
    return NextResponse.json({
      ok: true,
      resumed: true,
      sessionId: existing.id,
      token: token.token,
      mode: token.mode,
      actorId: existing.actorId,
      totalPoints: existing.totalPoints,
      startedAt: existing.startedAt,
      serverTime: Date.now(),
    });
  }

  const sessionId = uuid();
  createSession({
    id: sessionId,
    actorId,
    deviceId: deviceIdValue,
    startedAt: Date.now(),
    totalPoints: 0,
    kills: 0,
    waves: 0,
    maxCombo: 0,
    missions: [],
    redeemed: [],
    flags: [],
    leaderboardName: name,
  });

  const token = signSessionToken({ sessionId, deviceId: deviceIdValue, actorId });
  return NextResponse.json({
    ok: true,
    resumed: false,
    sessionId,
    token: token.token,
    mode: token.mode,
    actorId,
    startedAt: Date.now(),
    serverTime: Date.now(),
  });
}

async function endSessionHandler(body: Record<string, unknown>) {
  const missing = requiredString(body, 'sessionId');
  if (missing) {
    return NextResponse.json({ ok: false, error: `Campo requerido: ${missing}` }, { status: 400 });
  }
  const session = endSession(String(body.sessionId));
  if (!session) {
    return NextResponse.json({ ok: false, error: 'Sesión no encontrada.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, sessionId: session.id, endedAt: session.endedAt, totalPoints: session.totalPoints });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const denied = enforceTrust(req);
  if (denied) return denied;

  const methodDenied = methodGuard(req, ['POST']);
  if (methodDenied) return methodDenied;
  const contentDenied = jsonContentGuard(req);
  if (contentDenied) return contentDenied;

  let body: Record<string, unknown>;
  try {
    body = await parseJsonBody(req);
  } catch {
    return NextResponse.json({ ok: false, error: 'BODY_INVALID' }, { status: 400 });
  }

  const action = typeof body.action === 'string' ? body.action : 'start';
  if (action === 'start') return startSession(body);
  if (action === 'end') return endSessionHandler(body);
  return NextResponse.json({ ok: false, error: 'Acción no soportada (start | end).' }, { status: 400 });
}

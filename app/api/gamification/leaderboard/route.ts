import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { verifySessionToken } from '@/lib/security/auth-tokens';
import { jsonContentGuard, methodGuard, parseJsonBody, requiredString } from '@/lib/security/request-validator';
import { snapshotLeaderboard, submitToLeaderboard } from '@/lib/gamification/leaderboard';
import { getSession, getActiveSessionByDevice } from '@/lib/gamification/store';

export const runtime = 'nodejs';
const ROUTE_ID = 'api:gamification:leaderboard';
const RATE_LIMIT = 40;

function enforceTrust(req: NextRequest): NextResponse | null {
  const server = assertServerOnly('GAMIFICATION');
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

  const deviceId = req.nextUrl.searchParams.get('deviceId') ?? undefined;
  const limitRaw = Number(req.nextUrl.searchParams.get('limit') ?? 50);
  const limit = Number.isFinite(limitRaw) ? Math.min(100, Math.max(1, Math.floor(limitRaw))) : 50;

  return NextResponse.json(snapshotLeaderboard(deviceId, limit));
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

  const missing = requiredString(body, 'sessionId');
  if (missing) {
    return NextResponse.json({ ok: false, error: `Campo requerido: ${missing}` }, { status: 400 });
  }
  const sessionId = String(body.sessionId);

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ ok: false, error: 'Sesión no encontrada.' }, { status: 404 });
  }

  const tokenCheck = verifySessionToken(String(body.token ?? ''), session.id);
  if (!tokenCheck.ok) {
    return NextResponse.json({ ok: false, error: `Token inválido: ${tokenCheck.reason}` }, { status: 401 });
  }

  const name = typeof body.name === 'string' && body.name.trim() ? body.name : 'Guardián Anónimo';
  const entry = submitToLeaderboard(session, name);

  return NextResponse.json({ ok: true, entry });
}

export async function HEAD(req: NextRequest): Promise<NextResponse> {
  const denied = enforceTrust(req);
  if (denied) return denied;
  const byDevice = req.nextUrl.searchParams.get('deviceId');
  if (byDevice) {
    const session = getActiveSessionByDevice(byDevice);
    if (session) {
      return NextResponse.json({ ok: true, sessionId: session.id });
    }
  }
  return NextResponse.json({ ok: true, sessionId: null });
}

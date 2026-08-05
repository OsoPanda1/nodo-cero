import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { verifySessionToken } from '@/lib/security/auth-tokens';
import { jsonContentGuard, methodGuard, parseJsonBody, requiredString } from '@/lib/security/request-validator';
import { applyEvent } from '@/lib/gamification/points-engine';
import { recordGameplayEvent } from '@/lib/gamification/events';
import { getSession } from '@/lib/gamification/store';
import type { GameplayEvent, SpawnZone, ZombieRarity } from '@/lib/gamification/contracts';

export const runtime = 'nodejs';
const ROUTE_ID = 'api:gamification:events';
const RATE_LIMIT = 60;

const VALID_TYPES = ['kill-zombie', 'wave-completed', 'combo', 'mission-completed', 'prize-redeemed'];

function enforceTrust(req: NextRequest): NextResponse | null {
  const server = assertServerOnly('GAMIFICATION');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });
  const origin = verifyOrigin(req);
  if (!origin.ok) return NextResponse.json({ ok: false, error: origin.reason }, { status: 403 });
  const rl = rateLimit(req, ROUTE_ID, RATE_LIMIT);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'Límite de eventos del Nodo alcanzado. Reintenta en un momento.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }
  return null;
}

function clampNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function clampBool(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function enumValue<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : undefined;
}

const ZONES = ['mina', 'cultura', 'naturaleza', 'gastronomia', 'calles'] as const;
const RARITIES = ['comun', 'raro', 'epico'] as const;

function buildGameplayEvent(body: Record<string, unknown>): GameplayEvent | null {
  const type = String(body.type ?? '');
  const sessionId = String(body.sessionId ?? '');
  const timestamp = clampNumber(body.timestamp, Date.now());

  switch (type) {
    case 'kill-zombie':
      return {
        type,
        sessionId,
        timestamp,
        archetypeId: String(body.archetypeId ?? 'unknown'),
        archetypeName: typeof body.archetypeName === 'string' ? body.archetypeName : undefined,
        rarity: enumValue<ZombieRarity>(body.rarity, RARITIES),
        zone: enumValue<SpawnZone>(body.zone, ZONES),
        poiId: typeof body.poiId === 'string' ? body.poiId : undefined,
        basePoints: clampNumber(body.basePoints, 100),
        night: clampBool(body.night),
        fog: clampBool(body.fog),
        eventMonth: clampBool(body.eventMonth),
        comboCount: clampNumber(body.comboCount, 0),
      };
    case 'wave-completed':
      return {
        type,
        sessionId,
        timestamp,
        waveNumber: clampNumber(body.waveNumber, 1),
      };
    case 'combo':
      return {
        type,
        sessionId,
        timestamp,
        comboCount: clampNumber(body.comboCount, 1),
      };
    case 'mission-completed':
      return {
        type,
        sessionId,
        timestamp,
        missionId: String(body.missionId ?? 'unknown'),
        reward: clampNumber(body.reward, 0),
      };
    case 'prize-redeemed':
      return {
        type,
        sessionId,
        timestamp,
        prizeId: String(body.prizeId ?? 'unknown'),
        cost: clampNumber(body.cost, 0),
      };
    default:
      return null;
  }
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

  const type = typeof body.type === 'string' ? body.type : '';
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ ok: false, error: `Tipo de evento no soportado (${VALID_TYPES.join(', ')}).` }, { status: 400 });
  }

  const missing = requiredString(body, 'sessionId');
  if (missing) {
    return NextResponse.json({ ok: false, error: `Campo requerido: ${missing}` }, { status: 400 });
  }

  const session = getSession(String(body.sessionId));
  if (!session) {
    return NextResponse.json({ ok: false, error: 'Sesión no encontrada. Inicia una sesión primero.' }, { status: 404 });
  }

  const tokenCheck = verifySessionToken(String(body.token ?? ''), session.id, session.deviceId);
  if (!tokenCheck.ok) {
    return NextResponse.json({ ok: false, error: `Token inválido: ${tokenCheck.reason}` }, { status: 401 });
  }

  const event = buildGameplayEvent(body);
  if (!event) {
    return NextResponse.json({ ok: false, error: 'Evento malformado.' }, { status: 400 });
  }

  const result = applyEvent(event);

  if (result.accepted) {
    recordGameplayEvent({
      sessionId: session.id,
      actorId: session.actorId,
      eventType: type,
      payload: { ...event, pointsAwarded: result.pointsAwarded } as unknown as Record<string, unknown>,
    });
  }

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}

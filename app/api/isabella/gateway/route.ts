import { NextRequest, NextResponse } from 'next/server';
import { buildPerception } from '@/lib/isabella/http';
import { processPerception } from '@/lib/isabella/processPerception';
import { crownGatewayGenerate, getGatewayStatus } from '@/lib/isabella/crown-gateway';
import { guardPrompt } from '@/lib/isabella/prompt-guard';
import { parseIntention } from '@/lib/isabella/intention-parser';
import { auditTrace } from '@/lib/isabella/audit-tracer';
import { emitYunEvent } from '@/lib/isabella/events';
import { uuid } from '@/lib/isabella/utils';
import { rateLimit, verifyOrigin, assertServerOnly, redact } from '@/lib/isabella/trust';
import { getEmergencyStatus } from '@/lib/isabella/dead-man-switch';

/* ------------------------------------------------------------------ */
/* POST /api/isabella/gateway — genera una respuesta vía el CROWN      */
/* Gateway (flota federada de IAs) para un dominio canónico.           */
/* ------------------------------------------------------------------ */
export async function POST(req: NextRequest) {
  const server = assertServerOnly('CROWN Gateway');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });

  const origin = verifyOrigin(req);
  if (!origin.ok) return NextResponse.json({ ok: false, error: origin.reason }, { status: 403 });

  const rl = rateLimit(req, 'crown-gateway', 60);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'Límite de peticiones del Nodo alcanzado. Reintenta en un momento.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  try {
    const body = await req.json().catch(() => null);
    const { perception, error } = buildPerception(body);

    if (error || !perception) {
      return NextResponse.json({ ok: false, error: error ?? 'Percepción inválida' }, { status: 400 });
    }

    /* Doble saneamiento antes de tocar la flota: Prompt Guard + Intention Parser */
    const guard = guardPrompt(perception.payload.text ?? '');
    if (guard.blocked) {
      auditTrace('gateway.guard_blocked', {
        severity: guard.severity,
        categories: guard.matches.map(m => m.categoryId),
        prompt: redact(perception.payload.text ?? '').slice(0, 120),
      }, {
        traceId: uuid(),
        actorId: perception.actorId,
        sessionId: perception.sessionId,
        domain: 'security',
      });
      return NextResponse.json({
        ok: false,
        blocked: true,
        reason: 'Solicitud bloqueada por el Prompt Guard C.R.O.W.N.',
        severity: guard.severity,
        categories: guard.matches.map(m => m.categoryId),
      }, { status: 403 });
    }

    const canonical = parseIntention(perception.payload.text ?? '');
    const result = await processPerception(perception);
    const traceId = result.traceId;

    const gateway = await crownGatewayGenerate({
      prompt: perception.payload.text ?? '',
      canonicalDomain: canonical.domain,
      intent: String(result.decision.details.intent),
      riskLevel: result.decision.riskLevel,
      confidence: result.decision.confidence,
      traceId,
      fallbackText: result.decision.summary,
      territory: perception.territory?.place ?? 'Real del Monte, Hidalgo, México',
      sessionId: result.sessionId,
    });

    emitYunEvent({
      eventType: 'gateway.response.generated',
      domain: 'knowledge',
      federationId: perception.territory?.federationId,
      traceId,
      source: 'crown-gateway',
      entityId: perception.actorId,
      severity: gateway.emergency ? 'warning' : 'info',
      payload: {
        provider: gateway.provider,
        model: gateway.model,
        latencyMs: gateway.latencyMs,
        trustZone: gateway.trustZone,
        simulation: gateway.simulation,
        emergency: gateway.emergency,
        fallbacksTried: gateway.fallbacksTried.length,
        domain: canonical.domain,
      },
    });

    return NextResponse.json({
      ok: true,
      text: gateway.text,
      gateway: {
        provider: gateway.provider,
        model: gateway.model,
        latencyMs: gateway.latencyMs,
        trustZone: gateway.trustZone,
        simulation: gateway.simulation,
        emergency: gateway.emergency,
        fallbacksTried: gateway.fallbacksTried,
      },
      decision: result.decision,
      traceId,
      sessionId: result.sessionId,
    });
  } catch (err) {
    const traceId = uuid();
    auditTrace('gateway.error', {
      error: err instanceof Error ? err.message : 'Error desconocido',
    }, {
      traceId,
      actorId: 'ciudadano-yun',
      sessionId: '',
    });
    return NextResponse.json({ ok: false, error: 'CROWN Gateway: error interno del Nodo', traceId }, { status: 500 });
  }
}

/* ------------------------------------------------------------------ */
/* GET /api/isabella/gateway — estado de la flota y del panel          */
/* ------------------------------------------------------------------ */
export async function GET() {
  return NextResponse.json({
    ...getGatewayStatus(),
    emergency: getEmergencyStatus(),
  });
}

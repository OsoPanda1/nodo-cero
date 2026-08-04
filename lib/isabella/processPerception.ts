import {
  IsabellaDecision,
  IsabellaPerception,
  IsabellaProcessResult,
  IsabellaToolCall,
  EngineName,
} from './contracts';
import { auditTrace } from './audit-tracer';
import { emitYunEvent, YunDomain } from './events';
import {
  ARGUS_assess,
  KERNEL_verify,
  MNEMOS_cycle,
  ORION_perceive,
  SOPHIA_reason,
  TOPOLOGY_snapshot,
} from './engines';
import { policyGate } from './policy-gate';
import { executeTool } from './tools';
import { nowIso, uuid } from './utils';

/**
 * Flujo canónico de Isabella: Perceive → Remember → Decide → Act → Audit.
 *
 * Capa de aplicación del Nodo Cero: cada percepción se audita, se gobierna
 * por el policy gate (Constitución YUN), se razona con los motores cognitivos
 * y se registra trazabilidad completa en el bus de eventos YUN.
 */
export async function processPerception(perception: IsabellaPerception): Promise<IsabellaProcessResult> {
  const traceId = uuid();
  const engines: EngineName[] = [];

  /* 1. AUDIT — percepción recibida */
  const receivedAudit = auditTrace('perception.received', {
    type: perception.type,
    intent: perception.payload.intent ?? null,
    textPreview: (perception.payload.text ?? '').slice(0, 120),
  }, {
    traceId,
    actorId: perception.actorId,
    sessionId: perception.sessionId,
    federationId: perception.territory?.federationId,
    domain: (perception.territory?.domain as YunDomain) ?? 'knowledge',
  });

  /* 2. REMEMBER + CONTEXT — identidad, señales, riesgo y memoria */
  engines.push('KERNEL');
  const kernel = KERNEL_verify(perception);
  perception = { ...perception, actorId: kernel.actorId, sessionId: kernel.sessionId };

  engines.push('ORION');
  const orion = ORION_perceive(perception);

  engines.push('ARGUS');
  const argus = ARGUS_assess(perception, orion);

  engines.push('LUMEN');
  const gate = policyGate(perception);

  engines.push('TOPOLOGY');
  const territory = TOPOLOGY_snapshot();

  engines.push('MNEMOS');
  const memory = MNEMOS_cycle(perception, orion);

  const baseDetails: Record<string, unknown> = {
    intent: orion.intent,
    entities: orion.entities,
    sentiment: orion.sentiment,
    riskScore: argus.score,
    appliedPolicies: gate.appliedPolicies,
    recalledMemories: memory.recalled.length,
    traceId,
  };

  /* 3. DECIDE — gobernanza as code */
  let decision: IsabellaDecision;

  if (gate.status !== 'allowed') {
    const deniedSummary =
      gate.status === 'denied'
        ? `No puedo continuar con esa solicitud. ${gate.reason}`
        : `Tu solicitud requiere aprobación humana antes de ejecutarse. ${gate.reason}`;

    decision = {
      id: uuid(),
      perceptionId: perception.id,
      summary: deniedSummary,
      confidence: 0.62,
      riskLevel: argus.level,
      policyStatus: gate.status,
      engines,
      toolCalls: [],
      details: {
        ...baseDetails,
        blockReason: gate.reason,
      },
      createdAt: nowIso(),
    };

    const decisionAudit = auditTrace('decision.created', {
      decisionId: decision.id,
      policyStatus: decision.policyStatus,
      confidence: decision.confidence,
    }, {
      traceId,
      actorId: perception.actorId,
      sessionId: perception.sessionId,
      federationId: perception.territory?.federationId,
    });

    const blockedEvent = emitYunEvent({
      eventType: gate.status === 'denied' ? 'isabella.decision.denied' : 'isabella.decision.requires_approval',
      domain: 'security',
      federationId: perception.territory?.federationId,
      traceId,
      source: 'isabella-s-mind',
      payload: {
        decisionId: decision.id,
        perceptionId: perception.id,
        riskLevel: argus.level,
        appliedPolicies: gate.appliedPolicies,
      },
    });

    const processedAudit = auditTrace('perception.processed', { policyStatus: gate.status }, {
      traceId,
      actorId: perception.actorId,
      sessionId: perception.sessionId,
    });

    return {
      traceId,
      sessionId: perception.sessionId,
      decision,
      auditEvents: [receivedAudit, decisionAudit, processedAudit],
      events: [blockedEvent],
      memoryItems: memory.stored,
    };
  }

  /* 4. REASON + ACT — motores cognitivos y herramientas autorizadas */
  engines.push('SOPHIA');
  const sophia = SOPHIA_reason(perception, orion, memory.recalled, territory);

  const toolCalls: IsabellaToolCall[] = [];
  for (const toolName of sophia.suggestedTools.slice(0, 3)) {
    const started = Date.now();
    const outcome = executeTool(toolName, {});
    toolCalls.push({
      id: uuid(),
      tool: toolName,
      arguments: {},
      result: outcome.ok ? outcome.result : undefined,
      status: outcome.ok ? 'success' : 'error',
      durationMs: Date.now() - started,
    });
  }

  const toolsAudit = auditTrace('tools.executed', {
    count: toolCalls.length,
    tools: toolCalls.map(t => t.tool),
  }, {
    traceId,
    actorId: perception.actorId,
    sessionId: perception.sessionId,
  });

  decision = {
    id: uuid(),
    perceptionId: perception.id,
    summary: sophia.response,
    confidence: 0.88,
    riskLevel: argus.level,
    policyStatus: 'allowed',
    engines,
    toolCalls,
    details: {
      ...baseDetails,
      supportingFacts: sophia.supportingFacts,
    },
    createdAt: nowIso(),
  };

  /* 5. AUDIT + EVENTOS — trazabilidad completa */
  const decisionAudit = auditTrace('decision.created', {
    decisionId: decision.id,
    policyStatus: decision.policyStatus,
    confidence: decision.confidence,
    engines: engines.join(','),
  }, {
    traceId,
    actorId: perception.actorId,
    sessionId: perception.sessionId,
    federationId: perception.territory?.federationId,
  });

  const event = emitYunEvent({
    eventType: 'isabella.decision.created',
    domain: 'knowledge',
    federationId: perception.territory?.federationId,
    traceId,
    source: 'isabella-s-mind',
    payload: {
      decisionId: decision.id,
      perceptionId: perception.id,
      intent: orion.intent,
      riskLevel: argus.level,
      confidence: decision.confidence,
      engines: engines.join(','),
    },
  });

  const processedAudit = auditTrace('perception.processed', { policyStatus: 'allowed' }, {
    traceId,
    actorId: perception.actorId,
    sessionId: perception.sessionId,
  });

  return {
    traceId,
    sessionId: perception.sessionId,
    decision,
    auditEvents: [receivedAudit, toolsAudit, decisionAudit, processedAudit],
    events: [event],
    memoryItems: memory.stored,
  };
}

/* ------------------------------------------------------------------ */
/* ISA API — Structured Output (envelope ISA-AI)                       */
/* ------------------------------------------------------------------ */
/* Construye el envelope MEXA-AI (schema `isa-ai.schema.json`) a       */
/* partir del resultado canónico del pipeline (processPerception) y    */
/* del CROWN Gateway. NO realiza egress: solo reempaqueta datos que    */
/* ya viven en memoria dentro del Nodo Cero.                           */
/* ------------------------------------------------------------------ */

import {
  isaAiEnvelopeSchema,
  IsaAiEnvelope,
  IsaAiHeptaDomain,
  IsaAiStructuredType,
  IsaAiToolKind,
  IsaAiToolStatus,
} from '@/lib/core/contracts/isa-ai';
import { sha256 } from '@/lib/continuity/hash-chain';
import { CanonicalDomain } from './intention-parser';
import { IsabellaDecision, IsabellaProcessResult } from './contracts';

export const ISA_AI_VERSION = 'mexa-ai-v2.1.0';
export const ISA_AI_DEFAULT_MODEL = 'mexa-ai-v2';

/* ------------------------------------------------------------------ */
/* Mapeo de dominio canónico → heptaDomain del schema ISA-AI           */
/* ------------------------------------------------------------------ */

const CANONICAL_TO_HEPTA: Record<CanonicalDomain, IsaAiHeptaDomain> = {
  submission: 'tourism',
  library: 'rdm',
  constitution: 'governance',
  governance: 'governance',
  ecosystem: 'rdm',
  education: 'tourism',
  skills: 'tourism',
  ethics: 'governance',
};

const CANONICAL_TO_STRUCTURED_TYPE: Record<CanonicalDomain, IsaAiStructuredType> = {
  submission: 'text',
  library: 'faq',
  constitution: 'text',
  governance: 'text',
  ecosystem: 'rdm-node',
  education: 'faq',
  skills: 'text',
  ethics: 'text',
};

const TOOL_KIND_BY_NAME: Record<string, IsaAiToolKind> = {
  get_territory_status: 'radar',
  get_yun_overview: 'radar',
  get_gamification_status: 'radar',
  get_upcoming_events: 'library',
  get_tourism_routes: 'library',
  get_rdm_dicho: 'library',
  get_business_directory: 'library',
  get_poi_info: 'library',
  get_zombie_challenge: 'governance',
};

function toolStatus(status: string): IsaAiToolStatus {
  if (status === 'success') return 'applied';
  if (status === 'error') return 'failed';
  return 'skipped';
}

function canonicalDomainOf(decision: IsabellaDecision): CanonicalDomain {
  const raw = decision.details.canonicalIntent;
  if (
    raw === 'submission' ||
    raw === 'library' ||
    raw === 'constitution' ||
    raw === 'governance' ||
    raw === 'ecosystem' ||
    raw === 'education' ||
    raw === 'skills' ||
    raw === 'ethics'
  ) {
    return raw;
  }
  return 'submission';
}

export interface BuildStructuredEnvelopeOptions {
  text: string;
  prompt: string;
  latencyMs: number;
  provider: string;
  model: string;
}

export function buildStructuredEnvelope(
  result: IsabellaProcessResult,
  options: BuildStructuredEnvelopeOptions,
): IsaAiEnvelope {
  const { decision } = result;
  const canonical = canonicalDomainOf(decision);
  const appliedPolicies = Array.isArray(decision.details.appliedPolicies)
    ? (decision.details.appliedPolicies as unknown[]).map(String)
    : [];
  const guardSeverity = typeof decision.details.guardSeverity === 'string'
    ? (decision.details.guardSeverity as string)
    : 'none';
  const riskScore = typeof decision.details.riskScore === 'number'
    ? decision.details.riskScore
    : undefined;

  let structuredType: IsaAiStructuredType = CANONICAL_TO_STRUCTURED_TYPE[canonical];
  if (decision.toolCalls.length > 0) {
    structuredType = 'tool';
  }

  const tools = decision.toolCalls.map(call => ({
    name: call.tool,
    kind: TOOL_KIND_BY_NAME[call.tool] ?? 'library',
    status: toolStatus(call.status),
    ...(call.result !== undefined ? { result: call.result } : {}),
  }));

  const sources = Array.isArray(decision.sources) ? decision.sources : [];
  const entriesUsed = sources.map(source => ({ id: source, score: 1 }));

  return {
    version: ISA_AI_VERSION,
    provider: 'isa-ai',
    model: options.model,
    traceId: result.traceId,
    intent: canonical,
    confidence: decision.confidence,
    heptaDomain: CANONICAL_TO_HEPTA[canonical],
    topic: decision.details.intent !== undefined ? String(decision.details.intent) : undefined,
    sessionId: result.sessionId,
    content: options.text,
    structured: {
      type: structuredType,
      ...(tools.length > 0 ? { toolName: tools[0].name } : {}),
      tools,
      pipelines: {
        inputHex: sha256(options.prompt),
        outputHex: sha256(options.text),
      },
      data: {
        riskScore,
        engines: decision.engines,
        guardSeverity,
        riskLevel: decision.riskLevel,
      },
    },
    policy: {
      alignment: 'local-cultural',
      dataScope: 'tourism-real-del-monte',
      korimaCodex: {
        appliedPolicies,
      },
    },
    observability: {
      radars: [
        {
          name: 'radar_ojo_de_ra',
          status: decision.policyStatus,
          latencyMs: options.latencyMs,
        },
      ],
      latencyMs: options.latencyMs,
    },
    security: {
      systems: [
        {
          name: 'anubis_core',
          status: decision.riskLevel,
          decision: decision.policyStatus,
        },
        {
          name: 'crown_prompt_guard',
          status: guardSeverity,
          decision: guardSeverity === 'critical' ? 'denied' : 'allowed',
        },
      ],
    },
    kb: {
      entriesUsed,
    },
  };
}

export function validateStructuredEnvelope(
  envelope: IsaAiEnvelope,
): { ok: true; envelope: IsaAiEnvelope } | { ok: false; reason: string } {
  const parsed = isaAiEnvelopeSchema.safeParse(envelope);
  if (!parsed.success) {
    return {
      ok: false,
      reason: parsed.error.issues
        .map(issue => `${issue.path.join('.')}: ${issue.message}`)
        .join('; '),
    };
  }
  return { ok: true, envelope: parsed.data };
}

import { NextRequest, NextResponse } from 'next/server';
import { processPerception } from '@/lib/isabella/processPerception';
import { IsabellaPerception, PerceptionType, RiskLevel } from '@/lib/isabella/contracts';
import { ISABELLA_POLICIES, YUN_CONSTITUTION_VERSION, YUN_FEDERATIONS } from '@/lib/isabella/constitution';
import { ISABELLA_TOOLS } from '@/lib/isabella/tools';
import { auditTrace } from '@/lib/isabella/audit-tracer';
import { uuid } from '@/lib/isabella/utils';

function validRisk(value: unknown): RiskLevel {
  return value === 'high' || value === 'medium' || value === 'low' ? value : 'low';
}

function validType(value: unknown): PerceptionType {
  return value === 'chat' || value === 'event' || value === 'signal' || value === 'api' || value === 'ui'
    ? value
    : 'chat';
}

function strField(body: Record<string, unknown>, key: string): string | undefined {
  const value = body[key];
  return typeof value === 'string' ? value : undefined;
}

function buildPerception(body: unknown): { perception: IsabellaPerception; error?: string } {
  if (typeof body !== 'object' || body === null) {
    return { perception: null as unknown as IsabellaPerception, error: 'Cuerpo de petición inválido' };
  }

  const record = body as Record<string, unknown>;
  const prompt = typeof record.prompt === 'string' ? record.prompt.trim() : '';

  if (!prompt && typeof record.payload !== 'object') {
    return { perception: null as unknown as IsabellaPerception, error: 'Campo prompt o payload requerido' };
  }

  const context = record.context as Record<string, unknown> | undefined;
  const sessionId = typeof record.sessionId === 'string' ? record.sessionId : '';

  const center = Array.isArray(context?.center) ? context.center as unknown[] : [];
  const latitude = typeof center[0] === 'number' ? center[0] : 20.1398;
  const longitude = typeof center[1] === 'number' ? center[1] : -98.6738;
  const altitude = typeof context?.altitude === 'number' ? context.altitude : 2710;

  return {
    perception: {
      id: uuid(),
      type: validType(record.type),
      actorId: 'ciudadano-yun',
      sessionId,
      payload: {
        text: prompt,
        intent: strField(record, 'intent'),
        riskLevel: validRisk(strField(record, 'riskLevel')),
        action: strField(record, 'action'),
        targetDomain: strField(record, 'targetDomain'),
      },
      timestamp: new Date().toISOString(),
      metadata: { source: 'rdm-hub/isa-api' },
      territory: {
        federationId: strField(context ?? {}, 'federationId') ?? 'Fed1',
        domain: strField(context ?? {}, 'domain') ?? 'knowledge',
        place: strField(context ?? {}, 'place') ?? 'Real del Monte, Hidalgo, México',
        latitude,
        longitude,
        altitude,
        geosite: strField(context ?? {}, 'geosite') ?? 'Geoparque Mundial UNESCO Comarca Minera',
        status: strField(context ?? {}, 'status') ?? 'Optimal',
      },
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const { perception, error } = buildPerception(body);

    if (error || !perception) {
      return NextResponse.json({ ok: false, error: error ?? 'Percepción inválida' }, { status: 400 });
    }

    const result = await processPerception(perception);

    let text = result.decision.summary;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && result.decision.policyStatus === 'allowed' && perception.payload.text) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{
            role: 'user',
            parts: [{ text: `${result.decision.summary}\n\n[Isabella Cognitive Context]\nIntent: ${String(result.decision.details.intent)}\nConfidence: ${result.decision.confidence}\nTerritorio: ${perception.territory?.place ?? 'Real del Monte'}` }],
          }],
        });
        if (response.text) text = response.text;
      } catch {
        /* modo simulación seguro: se conserva la respuesta de SOPHIA */
      }
    }

    return NextResponse.json({
      ok: true,
      text,
      decision: result.decision,
      traceId: result.traceId,
      sessionId: result.sessionId,
      auditEvents: result.auditEvents,
      events: result.events,
    });
  } catch (err) {
    const traceId = uuid();
    auditTrace('api.error', {
      error: err instanceof Error ? err.message : 'Error desconocido',
    }, {
      traceId,
      actorId: 'ciudadano-yun',
      sessionId: '',
    });
    return NextResponse.json({
      ok: false,
      error: 'Isabella AI: error interno del Nodo Cero',
      traceId,
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    name: 'ISA-API — Isabella Cognitive Layer',
    version: 'v1',
    node: 'Nodo Cero',
    principle: 'Always by your side',
    constitutionVersion: YUN_CONSTITUTION_VERSION,
    federations: YUN_FEDERATIONS,
    engines: ['ORION', 'SOPHIA', 'ARGUS', 'MNEMOS', 'LUMEN', 'KERNEL', 'TOPOLOGY'],
    policies: ISABELLA_POLICIES.map(p => ({ id: p.id, name: p.name, action: p.action, riskLevel: p.riskLevel })),
    tools: ISABELLA_TOOLS.map(t => ({ name: t.name, description: t.description })),
    endpoints: {
      POST: 'POST /api/isabella — envía una percepción y recibe una decisión gobernada',
      GET: 'GET /api/isabella — información de la capa cognitiva',
    },
  });
}

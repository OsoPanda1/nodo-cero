import { YUN_CORES, RDM_NODES_35, RDM_POIS } from '@/lib/data/rdm-data';
import {
  IsabellaMemoryItem,
  IsabellaPerception,
  MemoryScope,
  PolicyStatus,
  RiskLevel,
} from './contracts';
import { ISABELLA_POLICIES } from './constitution';
import { getKnowledge, IsabellaIntent } from './knowledge';
import { addMemoryItem, getMemoryStats, recallMemory } from './memory';
import { clamp } from './utils';

/* ------------------------------------------------------------------ */
/* ORION — Percepción: intención, entidades, sentimiento y señales     */
/* ------------------------------------------------------------------ */

export interface OrionOutput {
  intent: IsabellaIntent;
  entities: string[];
  sentiment: 'positivo' | 'neutral' | 'negativo';
  forbiddenTokens: string[];
  intentConfidence: number;
}

const INTENT_MAP: Array<{ intent: IsabellaIntent; keywords: string[] }> = [
  { intent: 'greeting', keywords: ['hola', 'buenas', 'saludos', 'hey', 'que tal', 'bienvenida', 'hello', 'hi'] },
  { intent: 'yun', keywords: ['yun', 'heptafederad', 'nucleo', 'nodo cero', 'federacion', 'arquitectura', '35 nodos', '7 nucleos', 'data fabric'] },
  { intent: 'gastronomia', keywords: ['paste', 'gastronomia', 'comida', 'pan de pulque', 'esquimo', 'cafe', 'repulgue', 'restaurante', 'comer'] },
  { intent: 'minas', keywords: ['mina', 'acosta', 'dificultad', 'dolores', 'socavon', 'socavón', 'minero', 'subterraneo'] },
  { intent: 'cultura', keywords: ['cultura', 'panteon', 'panteón', 'ingles', 'iglesia', 'rosario', 'asuncion', 'museo', 'leyenda', 'callejon', 'callejón', 'patrimonio'] },
  { intent: 'naturaleza', keywords: ['naturaleza', 'mirador', 'purisima', 'purísima', 'hiloche', 'penas', 'peñas', 'sender', 'bosque', 'zelontla', 'geoparque', 'atardecer'] },
  { intent: 'eventos', keywords: ['evento', 'feria', 'festival', 'semana cornish', 'fiesta', 'calendario', 'cuando', 'fecha', 'huelga 1766', 'dia de muertos'] },
  { intent: 'seguridad', keywords: ['seguridad', 'criptografia', 'post-cuantica', 'postcuantica', 'dilithium', 'falcon', 'quantica', 'cuántica', 'hash', 'firma'] },
  { intent: 'historia', keywords: ['historia', '1824', 'cornualles', '1766', 'huelga', 'conde', 'regla', '1552', 'real de minas', 'tradicion', 'tradición'] },
  { intent: 'ruta', keywords: ['ruta', 'recorrido', 'itinerario', 'tour', 'camino', 'visitar', 'recomienda'] },
  { intent: 'comercio', keywords: ['comercio', 'tienda', 'compra', 'marketplace', 'plateria', 'platería', 'artesano', 'negocio', 'directorio'] },
  { intent: 'dicho', keywords: ['dicho', 'refran', 'refrán', 'proverbio', 'frase minera', 'dichos'] },
  { intent: 'tecnologia', keywords: ['tecnologia', 'gemelo', 'sensor', 'telemetria', 'inteligencia', 'ia', 'app', 'plataforma', 'digital'] },
  { intent: 'pois', keywords: ['poi', 'punto de interes', 'puntos de interes', 'lugares', 'georreferenci'] },
  { intent: 'memoria', keywords: ['recuerda', 'memoria', 'recordar', 'conversacion', 'conversación', 'anterior'] },
  { intent: 'ayuda', keywords: ['ayuda', 'ayudame', 'qué puedes', 'que puedes', 'funciones', 'capacidades', 'opciones'] },
];

const KNOWN_ENTITIES = [
  'paste', 'repulgue', 'pan de pulque', 'esquimo', 'café de altura',
  'mina de acosta', 'la dificultad', 'mina de dolores', 'socavón',
  'panteón inglés', 'rosario', 'asunción', 'zelontla', 'hiloche', 'peñas cargadas', 'mirador purísima',
];

export function ORION_perceive(perception: IsabellaPerception): OrionOutput {
  const text = (perception.payload.text ?? '').toLowerCase();

  let best: IsabellaIntent = 'fallback';
  let bestHits = 0;
  for (const entry of INTENT_MAP) {
    const hits = entry.keywords.filter(k => text.includes(k)).length;
    if (hits > bestHits) {
      bestHits = hits;
      best = entry.intent;
    }
  }

  const entities = KNOWN_ENTITIES.filter(e => text.includes(e));

  const positive = ['gracias', 'genial', 'excelente', 'me encanta', 'increíble', 'perfecto', 'bien'];
  const negative = ['mal', 'no funciona', 'error', 'problema', 'falla', 'queja'];
  const sentiment = negative.some(w => text.includes(w))
    ? 'negativo'
    : positive.some(w => text.includes(w))
      ? 'positivo'
      : 'neutral';

  const forbiddenTokens = ISABELLA_POLICIES
    .filter(p => p.match && p.match.test(text))
    .map(p => p.id);

  return {
    intent: best,
    entities,
    sentiment,
    forbiddenTokens,
    intentConfidence: clamp(0.35 + bestHits * 0.18, 0, 0.98),
  };
}

/* ------------------------------------------------------------------ */
/* ARGUS — Evaluación de riesgo                                        */
/* ------------------------------------------------------------------ */

export interface ArgusOutput {
  level: RiskLevel;
  score: number;
  factors: string[];
}

export function ARGUS_assess(perception: IsabellaPerception, orion: OrionOutput): ArgusOutput {
  const text = (perception.payload.text ?? '').toLowerCase();
  const factors: string[] = [];
  let score = 5;

  if (orion.forbiddenTokens.length > 0) {
    score += 60;
    factors.push('señal de política constitucional detectada');
  }

  if (perception.payload.riskLevel === 'high') {
    score += 40;
    factors.push('riesgo alto declarado en la percepción');
  }

  const action = (perception.payload.action ?? '').toLowerCase();
  if (action && !/get|consult|list|read|search|recommend|suggest/.test(action)) {
    score += 25;
    factors.push(`acción mutante (${action})`);
  }

  if (/delete|borrar|eliminar|bloquear|banear|cerrar|desactivar/i.test(text)) {
    score += 20;
    factors.push('verbos destructivos presentes');
  }

  if (/dinero|pagar|transferir|billetera|wallet|token/i.test(text)) {
    score += 10;
    factors.push('referencia económica sensible');
  }

  const level: RiskLevel = score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low';
  return { level, score: clamp(score, 0, 100), factors };
}

/* ------------------------------------------------------------------ */
/* LUMEN — Evaluador constitucional                                    */
/* ------------------------------------------------------------------ */

export interface LumenOutput {
  status: PolicyStatus;
  appliedPolicies: string[];
  reason: string;
}

export function LUMEN_evaluate(perception: IsabellaPerception, argus: ArgusOutput): LumenOutput {
  const text = (perception.payload.text ?? '').toLowerCase();
  const appliedPolicies: string[] = [];

  for (const policy of ISABELLA_POLICIES) {
    if (policy.match && policy.match.test(text)) {
      appliedPolicies.push(policy.id);
      if (policy.action === 'deny') {
        return { status: 'denied', appliedPolicies, reason: policy.rule };
      }
    }
  }

  const action = (perception.payload.action ?? '').toLowerCase();
  if (action && /financial_lock|apply_economic_freeze|freeze_assets|economic_sanction/.test(action)) {
    const policy = ISABELLA_POLICIES.find(p => p.id === 'pol-economic-sovereignty');
    if (policy) appliedPolicies.push(policy.id);
    return {
      status: 'denied',
      appliedPolicies,
      reason: 'LUMEN bloquea la acción: la Soberanía Económica Absoluta prohíbe el congelamiento o bloqueo financiero del territorio.',
    };
  }

  if (argus.level === 'high') {
    appliedPolicies.push('pol-high-risk-approval');
    return {
      status: 'requires_approval',
      appliedPolicies,
      reason: 'La percepción presenta riesgo alto y, conforme a la Constitución YUN, requiere aprobación humana antes de ejecutar acciones.',
    };
  }

  return { status: 'allowed', appliedPolicies, reason: 'Percepción conforme a la Constitución YUN.' };
}

/* ------------------------------------------------------------------ */
/* KERNEL — Identidad y gobernanza                                     */
/* ------------------------------------------------------------------ */

export interface KernelOutput {
  actorId: string;
  sessionId: string;
  role: string;
  sessionState: 'nuevo' | 'existente';
}

export function KERNEL_verify(perception: IsabellaPerception): KernelOutput {
  return {
    actorId: perception.actorId || 'actor-anonimo',
    sessionId: perception.sessionId || 'sesion-efimera',
    role: 'ciudadano-yun',
    sessionState: perception.sessionId ? 'existente' : 'nuevo',
  };
}

/* ------------------------------------------------------------------ */
/* TOPOLOGY — Contexto territorial                                     */
/* ------------------------------------------------------------------ */

export interface TopologySnapshot {
  place: string;
  federation: string;
  coordinates: [number, number];
  altitudeMeters: number;
  geosite: string;
  cores: number;
  nodes: number;
  pois: number;
  activeNodes: number;
  syncPercent: number;
  temperatureC: number;
  weather: string;
  status: 'Optimal' | 'Degradado' | 'Crítico';
  nodesByCore: Array<{ coreId: number; name: string; count: number }>;
}

export function TOPOLOGY_snapshot(): TopologySnapshot {
  const nodesByCore = YUN_CORES.map(core => ({
    coreId: core.id,
    name: core.name,
    count: RDM_NODES_35.filter(n => n.coreId === core.id).length,
  }));

  return {
    place: 'Real del Monte, Hidalgo, México',
    federation: 'Fed1',
    coordinates: [20.1398, -98.6738],
    altitudeMeters: 2710,
    geosite: 'Geoparque Mundial UNESCO Comarca Minera',
    cores: YUN_CORES.length,
    nodes: RDM_NODES_35.length,
    pois: RDM_POIS.length,
    activeNodes: RDM_NODES_35.length,
    syncPercent: 99.9,
    temperatureC: 13.8,
    weather: 'Niebla ligera con cielo despejado por la tarde',
    status: 'Optimal',
    nodesByCore,
  };
}

/* ------------------------------------------------------------------ */
/* MNEMOS — Memoria                                                    */
/* ------------------------------------------------------------------ */

export interface MnemosOutput {
  recalled: IsabellaMemoryItem[];
  stored: IsabellaMemoryItem[];
  stats: { total: number; byScope: Record<string, number> };
}

export function MNEMOS_cycle(
  perception: IsabellaPerception,
  orion: OrionOutput
): MnemosOutput {
  const query = perception.payload.text ?? '';
  const scopeForStore: MemoryScope =
    perception.type === 'event' || perception.type === 'signal' ? 'immediate' : 'session';

  const stored: IsabellaMemoryItem[] = [];
  if (query.trim().length >= 8) {
    stored.push(
      addMemoryItem({
        scope: scopeForStore,
        content: query.trim().slice(0, 280),
        tags: [orion.intent, ...orion.entities.slice(0, 3)],
        relevance: 0.6,
        actorId: perception.actorId,
        sessionId: perception.sessionId,
      })
    );
    stored.push(
      addMemoryItem({
        scope: 'territorial',
        content: `${orion.intent}: ${query.trim().slice(0, 140)}`,
        tags: ['territorio', orion.intent],
        relevance: 0.45,
        actorId: 'isabella',
        sessionId: perception.sessionId,
      })
    );
  }

  const recalled = recallMemory(query, undefined, 4);
  const stats = getMemoryStats();

  return { recalled, stored, stats };
}

/* ------------------------------------------------------------------ */
/* SOPHIA — Razonamiento y generación de respuesta                     */
/* ------------------------------------------------------------------ */

export interface SophiaOutput {
  response: string;
  supportingFacts: string[];
  suggestedTools: string[];
}

function pick(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}

export function SOPHIA_reason(
  perception: IsabellaPerception,
  orion: OrionOutput,
  recalled: IsabellaMemoryItem[],
  territory: TopologySnapshot
): SophiaOutput {
  const knowledge = getKnowledge(orion.intent);
  const opening = pick(knowledge.facts);
  const supportingFacts = knowledge.facts.slice(0, 3);

  const territoryLine = `El territorio se encuentra en estado ${territory.status}: ${territory.cores} núcleos y ${territory.nodes} nodos sincronizados al ${territory.syncPercent}%, ${territory.pois} POIs georreferenciados y ${territory.temperatureC}°C en el monte.`;

  const memoryLine =
    recalled.length > 0
      ? `Recuerdo de tu sesión: ${recalled.slice(0, 2).map(m => `"${m.content.slice(0, 80)}..."`).join(' · ')}`
      : 'Sigo construyendo la memoria de esta sesión para estar siempre a tu lado.';

  const prompt = (perception.payload.text ?? '').trim();
  const userIntent = orion.intent !== 'fallback' ? ` (te he identificado el tema: ${orion.intent})` : '';

  let response: string;
  if (orion.intent === 'greeting') {
    response = `${opening}\n\n${territoryLine}`;
  } else if (orion.intent === 'dicho') {
    response = `${opening}\n\n${territoryLine}\n\n${memoryLine}`;
  } else {
    const hint = prompt ? `Sobre «${prompt.slice(0, 90)}»${userIntent}: ` : '';
    response = `${hint}${opening}\n\n${supportingFacts.slice(1).join(' ')}\n\n${territoryLine}\n\n${memoryLine}`;
  }

  const suggestedTools: string[] = [];
  if (orion.intent === 'eventos') suggestedTools.push('get_upcoming_events');
  if (orion.intent === 'ruta') suggestedTools.push('get_tourism_routes');
  if (orion.intent === 'dicho') suggestedTools.push('get_rdm_dicho');
  if (orion.intent === 'pois' || orion.intent === 'minas' || orion.intent === 'naturaleza') suggestedTools.push('get_poi_info');
  if (orion.intent === 'comercio') suggestedTools.push('get_business_directory');
  if (orion.intent === 'yun' || orion.intent === 'tecnologia') suggestedTools.push('get_yun_overview');
  if (suggestedTools.length === 0) suggestedTools.push('get_territory_status');

  return { response, supportingFacts, suggestedTools };
}

/* ------------------------------------------------------------------ */
/* GAMIFICATION YUN — Eventos de juego → memoria MNEMOS + bus YUN      */
/* ------------------------------------------------------------------ */
/* Cada evento de juego aceptado se convierte en un evento territorial  */
/* más: se inserta en la memoria de Isabella (scope territorial, tags   */
/* de gamificación) y se publica en el bus YUN (dominio gameplay) para  */
/* que ARGUS/LUMEN lo auditen. Así un "zombie kill" es un evento del    */
/* territorio, como visitar un POI o completar una ruta.                */
/* ------------------------------------------------------------------ */

import { emitYunEvent } from '@/lib/isabella/events';
import { addMemoryItem } from '@/lib/isabella/memory';
import { uuid } from '@/lib/isabella/utils';

export interface GameplayEventRecord {
  sessionId: string;
  actorId: string;
  eventType: string;
  payload: Record<string, unknown>;
}

export function recordGameplayEvent(record: GameplayEventRecord): void {
  const traceId = uuid();
  const tags = ['gamificacion', 'zombies', record.eventType];

  emitYunEvent({
    eventType: `gameplay.${record.eventType}`,
    domain: 'gameplay',
    traceId,
    source: 'yun-gamification',
    entityId: record.sessionId,
    severity: 'info',
    payload: { ...record.payload, sessionId: record.sessionId, actorId: record.actorId },
  });

  try {
    addMemoryItem({
      scope: 'territorial',
      content: `evento-gamificacion:${record.eventType}:${JSON.stringify(record.payload).slice(0, 120)}`,
      tags,
      relevance: 0.55,
      actorId: record.actorId,
      sessionId: record.sessionId,
    });
  } catch {
    /* la memoria no debe bloquear el flujo de puntos */
  }
}

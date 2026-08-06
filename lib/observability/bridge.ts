/* ================================================================== */
/* OBSERVABILIDAD YUN — Puente al bus unificado                        */
/* ================================================================== */
/* Conecta el bus YUN al fabric de observabilidad (idempotente):       */
/* cada evento alimenta el grafo causal; los eventos api.route.*       */
/* alimentan RED y el SLO de disponibilidad. Solo ESCUCHA, nunca       */
/* publica, por lo que no puede crear lazos.                           */
/* ================================================================== */

import { subscribe } from '@/lib/core/events';
import { eventGraph, redMetrics, sloManager, registerDefaultSlo } from './index';

let unsubscribe: (() => void) | null = null;

export function wireObservabilityToBus(): void {
  if (unsubscribe) return;
  registerDefaultSlo();
  unsubscribe = subscribe(envelope => {
    eventGraph.ingest(envelope);

    const route = typeof envelope.data.route === 'string' ? envelope.data.route : null;
    if (!route) return;

    if (envelope.type === 'api.route.hit') {
      redMetrics.record({ route, ok: true, durationMs: 0 });
    } else if (envelope.type === 'api.route.finished') {
      const elapsedMs = typeof envelope.data.elapsedMs === 'number' ? envelope.data.elapsedMs : 0;
      redMetrics.record({ route, ok: true, durationMs: elapsedMs });
      sloManager.recordOutcome('api.core.availability', { ok: true });
    } else if (envelope.type === 'api.route.error') {
      redMetrics.record({ route, ok: false, durationMs: 0 });
      sloManager.recordOutcome('api.core.availability', { ok: false });
    }
  });
}

/** Desconecta el puente y limpia el estado (uso en pruebas). */
export function resetObservabilityBridgeForTests(): void {
  unsubscribe?.();
  unsubscribe = null;
  eventGraph.clear();
  redMetrics.clear();
  sloManager.clear();
}

# ADR-0003 — Observabilidad: Monitor General del Nodo Cero

- **Estado:** Aceptado
- **Fecha:** 2026
- **Área:** Observabilidad / Resiliencia

## Contexto

El Nodo Cero carecía de una vista unificada de su estado: no había métricas,
trazas, correlación de eventos ni alertas. La operación era a ciegas.

## Decisión

`lib/monitoring/` define un `SystemMonitor` singleton (`monitor`) con cuatro
subsistemas en memoria:

- **MetricsRegistry** — counters, gauges e histogramas con tags y `snapshot()`.
- **Tracer** — spans con jerarquía parent/child, latencia y estado.
- **EventCorrelator** — eventos con `correlationId` (p. ej. trazado de un request).
- **AlertEngine** — reglas sobre métricas en vivo (`gt/ge/lt/le/eq`) con severidad.

Superficie HTTP (`/api/monitor/*`), protegida por `assertServerOnly` + cadena Zero
Trust + `MONITOR_API_KEY` (fail-open si no está configurada en demo):

- `GET /api/monitor/health` — health checks por dominio (twins, city-ioc, eam-assets,
  grid, marketplace, isabella, gamification).
- `GET /api/monitor/events` — eventos correlacionados.
- `GET /api/monitor/state` — snapshot completo.

UI: `/monitor` (LiveSystems eager + SystemMonitor lazy con Suspense).

La resiliencia (`lib/resilience/`) emite cambios de estado del circuit breaker como
eventos y métricas hacia el monitor.

## Consecuencias

- Los health checks se registran con `monitor.registerHealth(name, fn)` (síncronos o
  asíncronos).
- Los datos son en memoria: se pierden al reiniciar. Para producción, persistir
  métricas agregadas (p. ej. Pushgateway/Postgres) y correlacionar con logs.

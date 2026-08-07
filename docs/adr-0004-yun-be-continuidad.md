# ADR-0004 — YUN BE: Bastión de Emergencia y Continuidad del Nodo Cero

- **Estado:** Aceptado
- **Fecha:** 2026
- **Área:** Continuidad / Resiliencia / Licenciamiento

## Contexto

El Nodo Cero dependía de un razonamiento centralizado y de un proveedor único
para sus funciones constitucionales. Ante una caída del primario no existía
procedimiento de promoción, no había journal de emergencia, no había fencing
ni protocolo de reconciliación: la recuperación era manual y sin evidencia.

## Decisión

Se implementa **YUN BE**, el Bastión de Emergencia, como dominio propio del Nodo
(`lib/continuity/` + rutas `/api/continuity/*`). Su misión **no es reemplazar
la plataforma en tiempo real** sino preservar las funciones constitucionales
mínimas, la integridad de eventos, la identidad de sesión, las decisiones
críticas y la recuperación ordenada. Principio rector:

> "Continuidad sin inventar estado."

Si YUN BE no puede demostrar autorización, integridad, versión de política o
frescura de un dato, degrada o deniega; nunca simula normalidad.

### Componentes

- **`state-machine.ts`** — máquina de estados
  `DORMANT → READY → SUSPECT → ISOLATED → ACTIVE_ISLAND → RECOVERY_PENDING →
  RECONCILING → DORMANT`. La promoción a `ACTIVE_ISLAND` exige: 2 fuentes de
  fallo independientes + lease primario expirado + bastión READY + fencing
  token.
- **`sentinel.ts`** — quórum de señales independientes (`healthcheck`,
  `heartbeat`, `lease`, `dependency`, `operator`) en ventana de 90 s. Una
  caída aislada NO promueve: evita split-brain.
- **`lease-manager.ts`** — lease del primario y fencing tokens
  `<epoch>.<instanceId>.<nonce>`. La época solo sube con promociones; los
  escritores de épocas anteriores quedan inválidos.
- **`journal.ts`** — journal append-only con hash-chain SHA-256
  (`previousHash` + `entryHash`), idempotencia por `idempotencyKey`.
- **`continuity-guard.ts`** — disposiciones en modo isla (fail-closed):
  `ACCEPTED / QUEUED / DENIED / REPLAYED / CONFLICT / COMPENSATED`.
- **`outbox.ts`** — intenciones idempotentes para reconciliar tras la
  recuperación. "Intención registrada" ≠ "operación exitosa".
- **`recovery-orchestrator.ts`** — protocolo de reconciliación en 8 pasos:
  confirmar recuperación, mantener aislado, congelar journal, reproducir por
  idempotencia (mismo `idempotencyKey`/`event_id`/`trace_id`/`fencing_epoch`),
  validar recibos, resolver conflictos sin last-write-wins, conciliar evidencia
  y cerrar con **aprobación dual**.

### Rutas

| Ruta | Método | Descripción |
| --- | --- | --- |
| `/api/continuity/status` | GET | Estado del bastión (modo, época, capacidades, sentinel, lease, journal). |
| `/api/continuity/journal` | GET | Journal inmutable con verificación de integridad. |
| `/api/continuity/activate` | POST | Promoción a `ACTIVE_ISLAND` (quórum + lease expirado + READY). |
| `/api/continuity/isolate-primary` | POST | Aislamiento del primario (orden firmada). |
| `/api/continuity/reconcile` | POST | Protocolo de 8 pasos; nunca cierra automático. |
| `/api/intentions` | POST | Registro de intenciones con disposición por modo. |

## Consecuencias

- La reconciliación **nunca es automática al primer 200 OK**: requiere recibos
  validados por idempotencia y aprobación dual para resolver conflictos.
- Los datos del journal/outbox son en memoria: para producción deben persistirse
  (WORM) y firmarse checkpoints con una clave fuera del nodo.
- El monitor del Nodo consume `/api/continuity/status` como health check de la
  cadena de continuidad.

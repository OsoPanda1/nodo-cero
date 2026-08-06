# Catálogo de APIs — Contratos del Nodo Cero

Fuente de verdad: `lib/governance/contracts.ts` (10 contratos, semver estricto,
ciclo de vida `preview → stable → deprecated → sunset`, política de despliegue
`canary | stable | blue-green`).

| Contrato | Ruta | Métodos | Versión | Dueño (YUN) |
|---|---|---|---|---|
| `api.isabella.chat` | `/api/isabella` | POST, GET | 4.0.0 | núcleo-cognitivo |
| `api.isabella.reason` | `/api/isabella/isa/reason` | POST | 4.0.0 | núcleo-cognitivo |
| `api.isabella.gateway` | `/api/isabella/gateway` | POST, GET | 1.0.0 | crown |
| `api.isabella.crypto` | `/api/isabella/crypto/{sign,verify}` | POST | 2.0.0 | trazabilidad |
| `api.monitor.state` | `/api/monitor/state` | GET | 1.0.0 | observabilidad |
| `api.monitor.health` | `/api/monitor/health` | GET | 1.0.0 | observabilidad |
| `api.monitor.events` | `/api/monitor/events` | GET | 1.0.0 | observabilidad |
| `api.twins` | `/api/twins/{models,instances,graph,simulate,query}` | GET, POST | 1.0.0 | experiencia |
| `api.city` | `/api/city/{ioc,incidents,mobility,response,scorecard}` | GET, POST | 1.0.0 | operacion |
| `api.gamification` | `/api/gamification/{events,session}` | POST, GET | 1.0.0 | experiencia |

## Reglas de compatibilidad

- **Bump major** (v4 → v5): siempre *breaking* → migración coordinada.
- Cambios **minor/patch**: permitidos si el contrato es `additive`.
- Contratos declarados `breaking`: cualquier cambio de versión exige migración.
- Despliegue: `preview → canary`, `sunset → blue-green`, resto `stable`.
- Contratos `deprecated`/`sunset` aparecen en `contractsNeedingAttention()`.

## Aplicación

`checkCompatibility(contractId, from, to)` y `deployPolicy(contract)` se prueban en
`tests/governance.test.ts`.

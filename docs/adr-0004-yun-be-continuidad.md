ADR-0004 — YUN BE: Bastión de Emergencia y Continuidad del Nodo Cero
Estado: Aceptado

Fecha: 2026

Área: Continuidad / Resiliencia / Licenciamiento

Repositorio: docs/adr-0004-yun-be-continuidad.md

Contexto
El Nodo Cero dependía de un razonamiento centralizado y de un proveedor único para ejecutar funciones constitucionales. Ante una caída del sistema primario, no existían un procedimiento automatizado de promoción, un journal de emergencia, mecanismos de fencing ni un protocolo formal de reconciliación.

En consecuencia, la recuperación era manual, vulnerable a escenarios de split-brain y carente de evidencia auditable. Esta limitación resulta especialmente relevante en una plataforma que integra identidad soberana, eventos territoriales, operaciones urbanas, pagos, marketplace, gemelo digital y funciones cognitivas.

Decisión
Se aprueba la implementación de YUN BE — Bastión de Emergencia como dominio nativo del Nodo Cero, ubicado en:

text
lib/continuity/
app/api/continuity/*
YUN BE no reemplaza la plataforma primaria en tiempo real. Su misión es preservar, durante una degradación o aislamiento:

Las funciones constitucionales mínimas.

La integridad y trazabilidad de los eventos.

La identidad y continuidad de las sesiones.

Las decisiones críticas autorizadas.

Las intenciones pendientes.

La evidencia necesaria para una recuperación ordenada.

La reconciliación controlada entre primario y réplica.

El dominio Continuity aparece integrado en la arquitectura del repositorio junto con journal, activación, aislamiento y reconciliación primario-réplica.

Principio rector
“Continuidad sin inventar estado.”

Si YUN BE no puede demostrar autorización, integridad, versión de política, identidad, frescura o resultado verificable, debe degradar o denegar la operación mediante una política fail-closed.

YUN BE nunca debe simular normalidad, confirmar una operación sin recibo válido ni transformar una intención registrada en una operación supuestamente exitosa.

Invariantes constitucionales
YUN BE deberá cumplir permanentemente las siguientes reglas:

Nunca pueden existir dos escritores activos para la misma función y época.

Todo escritor de una época anterior debe quedar inválido después de una promoción.

Toda operación constitucional aceptada debe producir evidencia en el journal.

Toda intención debe terminar en un resultado verificable o permanecer explícitamente en estado UNKNOWN.

La reconciliación nunca elimina ni sobrescribe evidencia histórica.

Una respuesta HTTP 200 OK nunca constituye, por sí sola, prueba de operación exitosa.

Ningún conflicto se resuelve mediante last-write-wins.

Ninguna promoción se ejecuta si no se demuestra la expiración del lease y el aislamiento del primario.

Los datos obsoletos, incompletos o criptográficamente inválidos no pueden presentarse como estado actual.

Toda transición crítica debe ser autorizada, registrada y auditable.

Máquina de estados
state-machine.ts administra el ciclo operativo del bastión:

text
DORMANT
  → READY
  → SUSPECT
  → ISOLATED
  → ACTIVE_ISLAND
  → RECOVERY_PENDING
  → RECONCILING
  → DORMANT
Estados
Estado	Significado
DORMANT	Bastión inactivo o sin capacidades suficientes para operar.
READY	Bastión preparado, validado y elegible para responder a una emergencia.
SUSPECT	Se detectan señales anómalas, pero todavía no existe evidencia suficiente para promover.
ISOLATED	El primario se considera aislado o se encuentra en proceso formal de aislamiento.
ACTIVE_ISLAND	YUN BE opera en modo isla con capacidades constitucionales limitadas.
RECOVERY_PENDING	El primario o la dependencia principal han regresado, pero aún no se permite reconciliar.
RECONCILING	Se ejecuta la reconciliación controlada y se validan recibos, eventos y conflictos.
La transición a ACTIVE_ISLAND exige simultáneamente:

Dos fuentes de fallo independientes.

Lease del primario expirado.

Bastión en estado READY.

Token de fencing válido.

Orden de aislamiento confirmada o evidencia equivalente de aislamiento.

Política vigente y capacidades mínimas disponibles.

Componentes principales
state-machine.ts
Implementa las transiciones válidas, rechaza saltos de estado no autorizados y registra cada transición con identidad de operador, época, política y motivo.

Ninguna transición crítica debe depender únicamente de una variable local o de un reinicio de proceso.

sentinel.ts
Evalúa señales independientes dentro de una ventana de 90 segundos:

healthcheck

heartbeat

lease

dependency

operator

Una caída aislada no debe provocar una promoción automática. El quórum deberá distinguir entre señales verdaderamente independientes y señales que compartan red, región, proveedor, reloj o dependencia común.

El criterio de promoción deberá registrar:

text
signal_id
signal_type
observed_at
source
fresh_until
independence_group
signature_or_attestation
decision
Las señales obsoletas, duplicadas, contradictorias o sin autenticación deben descartarse.

lease-manager.ts
Administra el lease del primario y los tokens de fencing con la estructura:

text
<epoch>.<instanceId>.<nonce>
La epoch solo aumenta como consecuencia de una promoción válida. Todo escritor debe rechazar tokens de épocas inferiores, incluso si el token tiene una firma formalmente correcta.

El componente deberá definir explícitamente:

TTL del lease.

Intervalo de renovación.

Margen de seguridad.

Fuente de tiempo.

Tolerancia al desfase horario.

Persistencia atómica de la época.

Comportamiento ante respuestas ambiguas.

Revocación de escritores antiguos.

Validación del token en cada escritura crítica.

journal.ts
Implementa un registro append-only con cadena hash SHA-256:

text
previousHash + entryHash
Cada entrada debe incluir, como mínimo:

text
journalId
sequence
eventId
traceId
correlationId
idempotencyKey
fencingEpoch
actor
operation
policyVersion
payloadDigest
previousHash
entryHash
createdAt
El journal debe detectar:

Alteraciones de entradas.

Huecos de secuencia.

Duplicación de eventos.

Cambios de política no declarados.

Timestamps inválidos.

Reproducción de entradas ya procesadas.

Uso de una época anterior.

La cadena hash demuestra continuidad interna, pero requiere un anclaje externo para demostrar la autenticidad del último estado. Por ello, producción exige checkpoints firmados fuera del nodo.

continuity-guard.ts
Controla las operaciones en modo isla con política estricta de denegación por defecto.

Disposiciones válidas:

text
ACCEPTED
QUEUED
DENIED
REPLAYED
CONFLICT
COMPENSATED
UNKNOWN
El estado UNKNOWN se añade como estado constitucional necesario cuando no existe evidencia suficiente para afirmar que una operación se ejecutó o no se ejecutó.

outbox.ts
Registra intenciones idempotentes destinadas a ser reproducidas durante la recuperación.

La regla operativa es:

Intención registrada ≠ operación exitosa.

Cada intención debe conservar:

text
intentionId
idempotencyKey
eventId
traceId
fencingEpoch
operation
payloadDigest
policyVersion
createdAt
disposition
receipt
attempts
lastError
Una intención no debe eliminarse al ser enviada. Solo puede marcarse como aplicada después de validar un recibo compatible con su identidad, contenido, época y política.

recovery-orchestrator.ts
Ejecuta la recuperación mediante ocho pasos obligatorios:

Confirmar la recuperación del primario y sus dependencias.

Mantener aislado el primario mientras se valida su identidad y época.

Congelar el journal de isla para impedir modificaciones concurrentes.

Reproducir intenciones mediante idempotencyKey, event_id, trace_id y fencing_epoch.

Validar los recibos devueltos por el primario.

Clasificar y resolver conflictos sin last-write-wins.

Conciliar la evidencia del journal, outbox, primario y réplica.

Cerrar exclusivamente mediante aprobación dual y checkpoint final firmado.

El cierre nunca debe producirse automáticamente después del primer 200 OK.

Estados de reconciliación
Estado	Significado
PENDING	Intención registrada, aún no reproducida.
APPLIED	Operación aplicada y confirmada mediante recibo válido.
REJECTED	Operación rechazada por autorización, política o integridad.
CONFLICT	Existe divergencia que requiere resolución explícita.
COMPENSATED	Se aplicó y verificó una compensación.
UNKNOWN	No existe evidencia suficiente para determinar el resultado.
El estado UNKNOWN debe conservarse hasta que una investigación o reconciliación posterior aporte evidencia suficiente. No debe convertirse automáticamente en APPLIED ni en REJECTED.

Superficie API
Todas las rutas deberán utilizar el route-guard canónico del Nodo Cero, aplicar validación de contratos, autenticación, autorización, control de origen, rate limiting, trazabilidad y política fail-closed.

Ruta	Método	Descripción
/api/continuity/status	GET	Consulta el modo, época, capacidades, sentinel, lease, journal y condiciones de promoción.
/api/continuity/journal	POST	Registra una entrada inmutable en el journal.
/api/continuity/journal	GET	Obtiene entradas y resultado de la verificación de integridad.
/api/continuity/activate	POST	Solicita la promoción a ACTIVE_ISLAND tras validar quórum, lease, estado READY y fencing.
/api/continuity/isolate-primary	POST	Emite y registra una orden firmada de aislamiento del primario.
/api/continuity/reconcile	POST	Ejecuta el protocolo de reconciliación en ocho pasos sin cierre automático.
/api/intentions	POST	Registra una intención y asigna su disposición según el modo operativo.
Las rutas de Continuity forman parte del dominio lib/continuity/ y de la superficie /api/continuity/* documentada para el Nodo Cero.

Persistencia y evidencia
La implementación actual puede utilizar memoria para desarrollo y demostración, pero esa modalidad no constituye continuidad de producción. El journal y el outbox deben persistirse en almacenamiento durable y resistente a alteraciones.

Para producción se requiere:

Almacenamiento WORM (Write Once, Read Many).

Replicación fuera del proceso.

Checkpoints firmados con claves externas al nodo.

Custodia y rotación de claves.

Registro de revocación de claves.

Backups inmutables.

Pruebas de restauración.

Retención legal y operativa.

Exportación de evidencia con secuencias completas.

Verificación posterior a cada despliegue.

Cada checkpoint debe incluir:

text
journalId
firstSequence
lastSequence
lastEntryHash
fencingEpoch
policyVersion
createdAt
keyId
signature
Observabilidad
El Monitor General del Nodo Cero consumirá:

text
GET /api/continuity/status
El endpoint deberá funcionar como health check de la cadena de continuidad, no únicamente como indicador de disponibilidad HTTP.

Debe exponer, como mínimo:

Estado actual.

Última transición.

Época vigente.

Estado del lease.

Frescura de señales.

Resultado del quórum.

Estado del aislamiento.

Capacidad del journal.

Integridad del último checkpoint.

Cantidad de intenciones pendientes.

Operaciones UNKNOWN.

Conflictos abiertos.

Última aprobación dual.

Versión de política.

Último error constitucional.

El repositorio integra Continuity con el Monitor y documenta el estado del dominio junto con journal, reconciliación, aislamiento y activación.

Supuestos de fallo
YUN BE debe diseñarse y probarse frente a los siguientes escenarios:

Caída completa del primario.

Partición de red entre primario y bastión.

Partición entre bastión y almacenamiento durable.

Relojes desincronizados.

Lease vencido sin confirmación de aislamiento.

Reinicio del bastión durante modo isla.

Corrupción o truncamiento del journal.

Duplicación de eventos.

Pérdida de una respuesta después de una escritura.

Reproducción de una intención durante un cambio de época.

Compromiso o revocación de una clave.

Recuperación parcial del primario.

Respuestas contradictorias entre primario y réplica.

Caída del proveedor de almacenamiento.

Operador no disponible o con autorización insuficiente.

RTO, RPO y límites operativos
La implementación deberá declarar por dominio:

RTO: tiempo máximo para recuperar la capacidad constitucional.

RPO: pérdida máxima de datos aceptable.

Capacidad máxima del journal en modo isla.

TTL máximo de datos aceptables.

Número máximo de reintentos.

Tiempo máximo de permanencia en ACTIVE_ISLAND.

Condiciones de degradación completa.

Operaciones prohibidas durante aislamiento.

Estos valores deberán vincularse con la matriz RTO/RPO del Nodo Cero y no quedar como supuestos implícitos.

Consecuencias
Consecuencias positivas
Reduce el riesgo de split-brain mediante quórum, lease y fencing.

Preserva evidencia auditable durante la interrupción.

Separa las funciones constitucionales de las funciones de tiempo real.

Permite reproducir intenciones sin asumir que fueron ejecutadas.

Hace explícitos los conflictos y los estados indeterminados.

Evita reconciliaciones destructivas basadas en la última escritura.

Integra continuidad, observabilidad, identidad y autorización en un único dominio.

Consecuencias negativas
La operación en modo isla tendrá capacidad limitada.

La reconciliación requiere intervención y aprobación dual.

La persistencia WORM y los checkpoints externos aumentan la complejidad operativa.

El sistema puede denegar operaciones legítimas cuando no exista evidencia suficiente.

La coordinación de épocas, leases y fencing exige pruebas distribuidas específicas.

El estado UNKNOWN puede requerir investigación manual prolongada.

Criterios de aceptación
ADR-0004 se considerará implementada para producción cuando se cumplan todos estos criterios:

Journal durable y verificable.

Outbox durable e idempotente.

Checkpoints firmados fuera del nodo.

Lease y época persistidos atómicamente.

Validación de fencing en cada escritor crítico.

Quórum con grupos de independencia documentados.

Aislamiento primario verificable.

Estado UNKNOWN soportado de extremo a extremo.

Reconciliación sin last-write-wins.

Aprobación dual registrada criptográficamente.

Monitor integrado con métricas de frescura e integridad.

Pruebas de partición, reinicio, replay, duplicación y recuperación.

Prueba documentada de restauración desde backup.

Runbook de emergencia validado por un operador distinto del autor.

Auditoría de licenciamiento, claves y permisos completada.

Licenciamiento
YUN BE forma parte del Nodo Cero y queda sujeto al régimen de propiedad, identidad, marca, arquitectura Heptafederada YUN y demás componentes establecido por el repositorio. El proyecto declara uso privado y de demostración, con autorización expresa requerida para uso comercial, despliegue público masivo o redistribución.

Resolución final
Se acepta YUN BE como dominio constitucional de continuidad del Nodo Cero, con operación fail-closed, promoción condicionada, journal encadenado, fencing, outbox idempotente, reconciliación no destructiva y aprobación dual.

La persistencia durable, los checkpoints externos, el quórum formal de señales, la validación de aislamiento y el estado UNKNOWN son requisitos obligatorios para considerar la implementación apta para producción.


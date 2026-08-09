# ADR-0005 — YUN Quantum Semantic Core: sobres semánticos híbridos

- **Estado:** Aceptado
- **Fecha:** 2026
- **Área:** Seguridad / Integridad / Post-cuántica

## Contexto

El Nodo Cero transporta eventos entre dominios y federaciones sin un sobre que
garantice de forma verificable sensibilidad, dominio, procedencia e integridad.
El blueprint `yun-quantum-semantic-core` define un sobre semántico cifrado con
firma híbrida (clásica + post-cuántica). La amenaza: cómputo cuántico futuro
sobre el tráfico capturado hoy ("harvest now, decrypt later") y alteración
silenciosa de la clasificación semántica.

## Decisión

Se implementa el **Quantum Semantic Core** como dominio propio del Nodo
(`lib/yun/` + rutas `/api/yun/*`).

### Sobre semántico (`yun.semantic-envelope.v1`)

- **Contexto semántico**: `sensitivity` (public→critical), `domain`,
  `federationId`, `entityType/entityId`, `ontology`, `retentionPolicy`,
  `provenance` (hash-chain) y `confidence`.
- **Cabecera pública**: `messageId`, `traceId`, `correlationId`, `createdAt`,
  `producer`.
- **Cifrado del cuerpo**: KEM `X25519 | ML-KEM-768 | ML-KEM-1024` +
  AEAD `AES-256-GCM | ChaCha20-Poly1305`.
- **Firma híbrida**: clásica `Ed25519 | ECDSA-P256` + post-cuántica
  `ML-DSA-65 | ML-DSA-87`.
- **Integridad**: hash SHA-256 del contenido canónico (`stableJson`).

### Reglas de seguridad (rígidas)

1. **No se implementa ML-KEM ni ML-DSA manualmente.** Solo un proveedor externo
   auditado (KMS/HSM, KAT vectors, interoperabilidad). Sin proveedor, todo
   falla cerrado con `CRYPTO_PROVIDER_NOT_CONFIGURED`.
2. **Verificación AND**: `clásica AND post-cuántica AND política semántica AND
   hash`. Nunca se acepta con una sola firma.
3. **Política semántica**: sensibilidad `restricted`/`critical` exige sellado
   híbrido y firma presente.
4. **`UnconfiguredCryptoProvider`** como defecto: genera IDs, pero toda
   operación criptográfica lanza error fail-closed.
5. **Plano de investigación aislado** (PennyLane, puerto 8090): solo ingiere
   buckets agregados; campos prohibidos (`key`, `payload`, `text`, ...) se
   rechazan por forma (`RESEARCH_BUCKET_DENIED`); `authoritative: false`.

### Componentes

| Módulo | Responsabilidad |
| --- | --- |
| `contracts.ts` | Contratos zod `.strict()` del sobre y las suites. |
| `crypto-provider.ts` | Interfaz KMS-like (`randomId`, `generateDataKey`, `encrypt/decrypt`, `sign/verify` clásica y PQ) + `UnconfiguredCryptoProvider` fail-closed. |
| `semantic-core.ts` | `createEnvelope`, `sealEnvelope`, `verifyEnvelope`, `validateSemanticPolicy`, estado y contadores. |
| `federations.ts` | Salud Fed1..Fed7 (HEALTHY/DEGRADED/DOWN) + evento `yun.federation.health.changed`. |
| `ready.ts` | Prontitud operativa para `/api/yun/ready`. |
| `policy.ts` | Traducción ejecutable de `policy/constitution.rego`. |
| `research-plane.ts` | Ingesta aislada de buckets agregados. |
| `audit.ts` | Eventos al bus YUN (dominio `yun`, traza heredada). |

### Rutas

| Ruta | Método | Descripción |
| --- | --- | --- |
| `/api/yun/status` | GET | Estado del core (versión, proveedor, contadores). |
| `/api/yun/ready` | GET | Prontitud operativa (200/503). |
| `/api/yun/federations/health` | GET | Salud Fed1..Fed7. |
| `/api/yun/envelope/create` | POST | Crea sobre sin sellar. |
| `/api/yun/envelope/seal` | POST | Sella (cifra + firma híbrida); 503 sin proveedor. |
| `/api/yun/envelope/verify` | POST | Verifica con regla AND; 503 sin proveedor. |

### Persistencia y política

- `db/001_init.sql` — `yun.federation_health`, `yun.yun_events`,
  `yun.yun_semantic_audit` (pgcrypto, índices).
- `policy/constitution.rego` — fuente declarativa OPA/Gatekeeper.
- `docs/openapi-yun.yaml` — contrato HTTP del dominio.

## Consecuencias

- El sellado/verificación quedan **deshabilitados hasta que exista un
  proveedor auditado**; `YUN_CRYPTO_PROVIDER` documenta el motor (hoy
  `"unconfigured"`). El `create` sí opera (integridad canónica).
- `lib/isabella/trust.ts` y `lib/security/trust.ts` permanecen como trust
  canónica; el QSC es dominio de integridad semántica separado del Bastión de
  Emergencia (ADR-0004).
- Para producción: conectar un KMS/HSM real, persistir auditoría semántica en
  `yun.yun_semantic_audit` y alimentar `federation_health` desde observables
  del Data Fabric YUN.

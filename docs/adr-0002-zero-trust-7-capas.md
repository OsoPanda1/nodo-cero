# ADR-0002 — Zero Trust en 7 capas (una por federación YUN)

- **Estado:** Aceptado
- **Fecha:** 2026
- **Área:** Seguridad / Heptafederación YUN

## Contexto

El Nodo Cero necesita verificar cada petición sin confiar en la red. La Heptafederación
YUN define 7 núcleos; se adopta una cadena de 7 capas de verificación, una por
federación, evaluadas en secuencia con **fail-closed** (si una falla, se deniega).

## Decisión

`lib/security/zero-trust.ts` implementa `enforceZeroTrustHeaders` / `enforceZeroTrust`
/ `assertZeroTrust`. Orden de evaluación:

| # | Capa | Federación | Verifica |
|---|---|---|---|
| L1 | Policy Gate | Decisión | Política de la ruta + firma HMAC (`signBody`/`verifySignature`) |
| L2 | Trazabilidad | Trazabilidad | Origen de la petición (anti-CSRF) |
| L3 | Experiencia | Experiencia | Integridad del payload |
| L4 | Resiliencia | Resiliencia | Rate limit (token bucket) |
| L5 | Operación | Operación | Sanitización de PII (`sanitizeForLog`/`redact`) |
| L6 | Identidad | Identidad | Clave interna (`verifyInternalKey`, comparación en tiempo constante) |
| L7 | Interconexión | Interconexión | Egress / auditoría de salida |

El reporte expone `layers[]`, `ok` y `deniedBy`. Las claves internas viven en
`lib/security/keys.ts` (blindadas, con rotación `_V2/_V3`) y **no** se registran.

`enforceTrust` de `lib/isabella/http.ts` aplica la cadena completa y registra
métricas/eventos en el Monitor General.

## Consecuencias

- Cada API puede exigir firma y/o clave sin repetir lógica.
- Auditoría uniforme vía el Monitor.
- El rate limit es por instancia; para multi-instancia se debe mover a Redis/Edge KV.

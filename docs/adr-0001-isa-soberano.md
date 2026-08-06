# ADR-0001 — Núcleo Soberano ISA (fin de la dependencia de Gemini)

- **Estado:** Aceptado
- **Fecha:** 2026
- **Área:** Núcleo de Decisión (Isabella Villaseñor AI)

## Contexto

El razonamiento de Isabella dependía de un único proveedor externo (Gemini). Eso
acoplaba el Nodo Cero a un tercero: latencia, costo, disponibilidad y privacidad
del territorio dependían de una API remota.

## Decisión

Introducir `lib/isabella/isa-core.ts`, un motor de razonamiento determinístico que
opera **íntegramente offline** sobre la base de conocimiento local del territorio
(POIs, eventos, rutas, dichos, nodos YUN y líneas históricas).

- **Cero egress:** no hace `fetch`, no lee claves, no sale del runtime.
- **Determinístico:** misma pregunta → misma respuesta (auditable).
- **Estructurado:** patrón `Answer + Sources + Trace` (ISA v4.0).
- **Gobernado:** respeta la Constitución YUN (fail-closed).

La capa MEXA (`lib/isabella/mexa-api.ts`) firma los artefactos con MSR-P256
(`MexaSignaturePayload`) solo si el operador está configurado; sin él responde en
modo `open` (sin firma) pero siempre offline.

El `CROWN Gateway` conserva la flota federada como capa opcional: sin claves
configuradas el Nodo opera en modo simulación soberano con `isaReason`.

## Consecuencias

- El chat responde siempre (incluso en LOCKDOWN).
- Las respuestas son reproducibles y citan fuentes locales.
- Nuevo contrato `api.isabella.reason` (v4.0.0, estable).
- Queda prohibido reintroducir dependencias externas obligatorias en el núcleo.

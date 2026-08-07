# ADR-0001 — Núcleo Soberano ISA (cero dependencia de proveedores externos)

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

El `CROWN Gateway` conserva una **bóveda nativa de modelos open source** como capa
opcional (Llama, Qwen, DeepSeek, Mistral, Phi, Cerebras y Ollama local sobre
transportes soberanos). Sin claves configuradas el Nodo opera en modo simulación
soberano con `isaReason`, sin egress.

## Consecuencias

- El chat responde siempre (incluso en LOCKDOWN).
- Las respuestas son reproducibles y citan fuentes locales.
- Nuevo contrato `api.isabella.reason` (v4.0.0, estable).
- Queda prohibido reintroducir dependencias externas obligatorias en el núcleo.
- Queda prohibido reintroducir proveedores propietarios en la bóveda del CROWN.

# Guía de desarrollador

## Setup

```bash
npm install
cp .env.example .env.local   # completa claves opcionales
npm run dev
```

Scripts: `npm test` (vitest), `npx tsc --noEmit`, `npm run lint`, `npm run build`.

## Convenciones

- **Idioma:** código y comentarios en español; identificadores en inglés.
- **Rutas internas:** alias `@/` → raíz del proyecto (config en `vitest.config.mts`
  y `tsconfig.json`).
- **Sin comentarios** salvo cabeceras de módulo y bloques de sección del estilo
  existente (`/* ========================================================== */`).
- **Estilo visual:** tema Nocturno Minero en `app/globals.css` + `lib/design/tokens.ts`
  (paleta `--gold`, `--terracotta`, `--emerald`, `--neblina`, …). Usar variables,
  `.glass-panel`, `.miner-border`; fuentes `--font-playfair` (títulos) y
  `--font-dm-sans` (UI). No reintroducir el tema holográfico cian/púrpura.

## Cómo añadir un dominio

1. Crear el store en `lib/<dominio>/` (síncrono, importable sin efectos de lado).
2. Exponer rutas en `app/api/<dominio>/` protegidas con `assertServerOnly` y
   `assertZeroTrust`.
3. Registrar un health check en `app/api/monitor/health/route.ts` con
   `monitor.registerHealth(name, fn)` (usa `require()` para evitar ciclos).
4. Registrar el contrato en `lib/governance/contracts.ts` (semver + lifecycle).
5. Añadir tests en `tests/<dominio>.test.ts`.

## Cómo añadir una API de Isabella

1. Si es razonamiento → extender `lib/isabella/isa-core.ts` (dominio, keywords,
   fuentes, plantilla). Nunca una llamada externa obligatoria.
2. Si firma artefactos → `lib/isabella/mexa-api.ts` (MSR-P256, opcional).
3. Exponerla vía `lib/isabella/http.ts` (aplica `enforceTrust` con la cadena 7
   capas automáticamente).

## Cómo usar resiliencia

```ts
registerStrategy('dominio', { retry: { maxAttempts: 3 }, failureThreshold: 5 });
await withResilience('dominio', async () => { /* trabajo */ });
```

Estados del circuit breaker se emiten como eventos/métricas del Monitor.

## Cómo usar caché y planos

```ts
await domainCache.getOrSetAsync('mapa', async () => await loadMap());
scheduleThirdPlane({ id: 'poda', plane: 'third', intervalMs: 60_000, run: podar });
stopThirdPlane('poda');
```

## Zero Trust y claves

- `enforceZeroTrustHeaders(headers, options)` evalúa las 7 capas; con
  `requiresSignature: true` exige `x-rdm-signature` (HMAC con `hmacSecret`).
- Claves internas en `.env` con rotación `_V2/_V3`; nunca se registran.

## Documentos

- `RFC-0001.md` — manifiesto C.R.O.W.N. y gobernanza.
- `docs/adr-0001..0003` — decisiones (ISA soberano, Zero Trust, observabilidad).
- `docs/c4-contexto.md` — arquitectura. `docs/catalogo-apis.md` — contratos.
- `docs/mapa-dominios.md` — dominios ↔ código ↔ federación.

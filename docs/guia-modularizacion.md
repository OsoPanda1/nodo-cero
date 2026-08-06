# Guía de modularización del Nodo Cero

Objetivo: un código transversal único, dominios desacoplados, contratos
ejecutables y una superficie de entrada consistente. Evolución por fases,
cada una verificable con `npm run quality`.

## Arquitectura de capas

```
lib/core/           Núcleo transversal (sin dependencias de dominio)
  utils/            uuid, nowIso, daysAgoISO, fnv1aChecksum, clamp
  events/           Bus YUN unificado (envelope, DLQ, traza AsyncLocalStorage)
  env/              Contrato tipado del entorno (zod)
  contracts/        Esquemas zod + errores uniformes
lib/security/       Trust canónica (trust.ts), Zero Trust, keys, tokens
lib/<dominio>/      Stacks de dominio (city, assets, gamification, ...)
app/api/_shared/    route-guard.ts (única cadena de guardas)
app/api/<dominio>/  Rutas: exportan handlers envueltos por guardedRoute
```

Regla de dependencias: **lib/core/ y lib/security/ jamás importan dominios**.
Los dominios importan núcleo/seguridad, nunca al revés.

## Patrón canónico de una ruta

```ts
import { NextResponse } from 'next/server';
import { guardedRoute } from '@/app/api/_shared/route-guard';
import { miContrato, type MiInput } from '@/lib/core/contracts';

export const POST = guardedRoute<MiInput>(
  {
    route: 'api:dominio:accion',
    methods: ['POST'],
    rateLimit: 30,
    schema: miContrato,           // zod: valida y tipa el body
  },
  async ({ req, route, traceId, body }) => {
    // usar body ya validado; emitir eventos con publishEvent({ traceId, ... })
    return NextResponse.json({ ok: true });
  },
);
```

Rutas de lectura: `methods: ['GET'], json: false`. El contrato se define en
`lib/core/contracts/schemas.ts` (o junto al dominio si es privado) y se
exporta desde `lib/core/contracts/index.ts`.

## El route-guard aplica (en orden)

1. `assertServerOnly` — nunca en cliente.
2. `verifyOrigin` — anti-CSRF (desactivable con `originRequired: false`).
3. `rateLimit` — ventana deslizante por ruta + IP.
4. `assertZeroTrust` — cadena de 7 capas YUN.
5. `methodGuard` (405) → `jsonContentGuard` (415) → `parseJsonBody` (400).
6. `schema.safeParse` — 400 con `details` de issues.
7. Telemetría `api.route.hit / finished / error` en el bus unificado.

## Migración de rutas legacy

Las rutas que duplican `enforceTrust()` (ver `npm run check:contracts`) se
migran siguiendo los ejemplares ya convertidos:

- `app/api/marketplace/publish/route.ts` (POST con contrato)
- `app/api/assets/register/route.ts` (GET + POST, contrato de dominio)
- `app/api/gamification/events/route.ts` (contrato + verificación HMAC propia)
- `app/api/isabella/isa/reason/route.ts` (contrato, mantiene su delegación)

Pasos:
1. Copiar el bloque `guardedRoute({...})` y sustituir el `enforceTrust` local.
2. Definir el contrato zod (o reutilizar uno existente) y el tipo de entrada.
3. Eliminar `methodGuard/jsonContentGuard/parseJsonBody` manuales y las
   validaciones de campos que el contrato ya cubre.
4. Eliminar el import del barril `@/lib/isabella/trust`.
5. Correr `npx tsc --noEmit` y el test de la ruta/dominio.

## Eventos (bus unificado)

Emisión con propagación de traza:

```ts
import { publishEvent, runWithTrace, currentTrace } from '@/lib/core/events';

runWithTrace({ traceId }, () => {
  publishEvent({ type: 'dominio.accion', source: 'mi-componente', domain: 'mi-dominio', data: {...}, meta: { entityId } });
});
```

- El envelope incluye `correlationId` / `causationId` / `traceId`.
- Los consumidores que fallen van a la DLQ (`dlqSnapshot`), sin romper el bus.
- `eventHistory()` alimenta la telemetría del monitor.
- Los emisores de cliente no deben importar `lib/core/events` estáticamente
  (usa `node:async_hooks`); usa `import()` dinámico si es imprescindible.

## Entorno

Toda variable se documenta en `lib/core/env/index.ts` y en `.env.example`.
Lectura tipada: `const env = getEnv();`. Validación CI: `npm run check:env`.

## Buenas prácticas de calidad

- Nada de `as never` ni `require()` dinámico (`npm run audit` los bloquea).
- Barril `index.ts` en todo directorio de lib/ con 2+ módulos.
- Archivos en kebab-case; comentarios en español, identificadores en inglés.
- Tests por dominio en `tests/`. El bus, los contratos y el entorno ya tienen
  cobertura propia (`tests/events.test.ts`, `tests/contracts.test.ts`,
  `tests/env.test.ts`).

## Fases de evolución

- **F1 (hecha):** núcleo transversal (utils, eventos, entorno, contratos),
  trust canónica en lib/security, route-guard único, 4 rutas ejemplares,
  scripts de calidad + docs.
- **F2:** telemetría por dominio (emitir métricas de cada dominio al monitor)
  y migración del resto de rutas al guard.
- **F3:** modelo de gobernanza de contratos ↔ dominios (semver automático).
- **F4:** unificación de circuit breakers/rate limiters y limpieza de estilo
  restante.

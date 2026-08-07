# RDM Digital Hub — Nodo Cero

**Sistema de Inteligencia Territorial Soberano para Real del Monte, Hidalgo, México.**

Plataforma digital integral (**phygital**) del **RDM Digital Hub — Nodo Cero**: gemelo territorial / smart city, centro de operaciones urbano (IOC), gestión de activos y mantenimiento (EAM/APM), redes inteligentes de energía y agua, marketplace soberano, telemetría IoT, criptografía post-cuántica, gamificación con arena 3D (Unity WebGL) y la asistencia cognitiva de **Isabella Villaseñor AI** — todo sobre la **Arquitectura Heptafederada YUN** de 7 núcleos.

> Real del Monte, "Cuna de la Minería Mexicana", es Pueblo Mágico de Hidalgo y parte del **Geoparque Mundial UNESCO de la Comarca Minera** (2017).

---

## Índice

1. [¿Qué es?](#qué-es)
2. [Dominios de la Plataforma](#dominios-de-la-plataforma)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Rutas API](#rutas-api)
6. [Gamificación: Web 2D y Arena 3D Unity](#gamificación-web-2d-y-arena-3d-unity)
7. [Pruebas Automatizadas](#pruebas-automatizadas)
8. [Estado Actual](#estado-actual)
9. [Scripts](#scripts)
10. [Variables de Entorno](#variables-de-entorno)
11. [Despliegue en Vercel](#despliegue-en-vercel)
12. [Base de Datos](#base-de-datos)
13. [Documentación Técnica](#documentación-técnica)
14. [Licenciamiento](#licenciamiento)

---

## ¿Qué es?

**RDM Digital Hub — Nodo Cero** es el **Sistema Operativo Territorial (TOS)** de Real del Monte. Trata al pueblo como una *plataforma inteligente viva* que unifica su patrimonio histórico-minero, su vida cultural, su economía local y su geografía con tecnología de punta:

- **Gemelo digital territorial** con modelos DTDL, NGSI-LD, grafo de relaciones y simulación en tiempo real.
- **Centro de Operaciones Urbano (IOC)**: incidentes, triage, playbooks de respuesta, movilidad, emergencias e infraestructura crítica.
- **EAM/APM**: registro de activos, salud, modelo de falla, mantenimiento predictivo y órdenes de trabajo.
- **Smart Grid y Agua**: balance de energía y agua, topología de red, alertas y resiliencia.
- **Marketplace Soberano**: ofertas de datos, licencias y suscripción entre nodos federados.
- **Gamificación territorial**: motor de puntos *server-authoritative* con anti-cheat, y arena 3D (Unity WebGL) contra oleadas de zombies con puente C#-JS (`rdm-yun`).
- **7 núcleos soberanos** (35 nodos operativos) de arquitectura descentralizada.
- **Isabella Villaseñor AI**: asistente cognitivo del territorio basado en Google Gemini, con núcleo soberano ISA.
- **Criptografía post-cuántica** (NIST): CRYSTALS-Dilithium-5, CRYSTALS-Kyber-1024 y Falcon-1024.
- **Capa de confianza cero (Zero Trust)**: origen verificado, rate limiting, comparación en tiempo constante y políticas de gateway con *fail-closed*.

Es el **Nodo Cero** de una red metropolitana más amplia: la **Heptafederación YUN** que conecta los municipios de la Comarca Minera (Real del Monte, Pachuca, Mineral del Chico, Huasca, Omitlán).

### Identidad

| Campo | Valor |
|---|---|
| **Nombre** | RDM Digital Hub — Nodo Cero |
| **Alias** | Sistema de Inteligencia Territorial Soberano / Plataforma de Gemelo Territorial |
| **Ubicación** | Real del Monte, Hidalgo, México (20.1398° N, 98.6738° O, 2,710 m s. n. m.) |
| **Autor** | Edwin Oswaldo Castillo Trejo (Anubis Villaseñor) |
| **IA Asistente** | Isabella Villaseñor AI |
| **Arquitectura** | Heptafederación YUN (7 núcleos) |
| **Sector** | Turismo, gobernanza, patrimonio cultural, economía phygital, smart city |

---

## Dominios de la Plataforma

| Dominio | Descripción | Código |
|---|---|---|
| **Isabella** | Asistente cognitivo, razonamiento ISA, Mexa API, chat, gateway CROWN y criptografía | `lib/isabella/`, `app/api/isabella/*` |
| **City** | IOC urbano: eventos, incidentes, infraestructura, movilidad, respuesta, scorecard | `app/city/`, `app/api/city/*` |
| **Twins** | Gemelo territorial: modelos DTDL, instancias, grafo, consultas y simulación | `app/twins/`, `app/api/twins/*` |
| **Assets** | EAM/APM: registro, salud, fallas, mantenimiento, órdenes de trabajo | `app/assets/`, `app/api/assets/*` |
| **Grid** | Redes de energía y agua: balance, topología, alertas | `app/grid/`, `app/api/grid/*` |
| **Marketplace** | Ofertas, licencias, modelos, publicación y suscripción | `app/marketplace/`, `app/api/marketplace/*` |
| **Gamification** | Puntos, leaderboard, sesiones, anti-cheat y arena 3D | `lib/gamification/`, `app/api/gamification/*` |
| **Monitor** | Monitoreo general, health y estado | `app/monitor/`, `app/api/monitor/*` |
| **Payments** | Checkout, estado y payouts | `app/api/payments/*` |
| **Observability** | SLO/RED, grafo y estado del fabric | `app/api/observability/*` |

Todas las rutas API usan el **route-guard único** (`@/app/api/_shared/route-guard`) que aplica la cadena Zero Trust; no se duplica `enforceTrust`.

---

## Stack Tecnológico

**Frontend / App**
- Next.js 16 (App Router) + React 19 + TypeScript 5.9 (strict)
- Tailwind CSS 4, Tailwind Merge, CVA, Lucide React, Motion, Recharts, Leaflet, Three.js

**Backend / Núcleo**
- Route handlers de Next.js con validación de contratos **zod** en `lib/core/contracts`
- Bus de eventos con envelope `traceId`/`correlationId` (`lib/core/events`)

**Persistencia / Servicios**
- Postgres (Supabase) + Postgres réplica (Neon) vía `postgres`
- Redis (Upstash) para caché/estado
- Google Gemini (`@google/genai`) para la capa cognitiva de Isabella

**Gamificación 3D**
- Unity 2022.3 (LTS) compilado a WebGL, integrado como app de Next.js

**Calidad**
- Vitest (pruebas unitarias y de dominio), ESLint 9, TypeScript, auditor de consistencia del código

---

## Estructura del Proyecto

```
app/                  # Rutas y páginas de Next.js (App Router)
  api/_shared/          # Route-guard único (Zero Trust)
  api/<dominio>/*       # Rutas API por dominio
  <dominio>/page.tsx    # Páginas: assets, city, grid, marketplace, monitor, twins
components/           # Componentes React (incl. gamificación 2D/3D)
hooks/                # Hooks (use-unity-webgl, etc.)
lib/                  # Lógica de dominio y núcleo transversal
  core/                 # Núcleo: env, events, contracts, utils
  security/             # trust, zero-trust, keys, tokens
  <dominio>/            # stacks de dominio (isabella, city, twins, grid, gamification, ...)
unity/                # Proyecto Unity (Arena 3D) — no empaquetado en web
  Assets/               # Scripts, Plugins/WebGL, WebGLTemplates/RDM, Editor
  Packages/             # manifest.json
  ProjectSettings/      # ProjectVersion.txt (2022.3.62f1)
public/               # Assets estáticos, incl. build WebGL en public/unity/RDMArena/
scripts/              # Automatización (audit, check:env, check:contracts)
supabase/migrations/  # Migraciones Postgres con RLS
tests/                # Pruebas de Vitest por dominio
docs/                 # ADRs, guías, C4, catálogo de APIs, mapa de dominios
```

**Núcleo transversal**: `lib/core/` (env tipado con zod, eventos, contratos, utils). La trust canónica vive en `lib/security/trust.ts`; `lib/isabella/trust.ts` es un barril de compatibilidad (no añadir lógica nueva allí).

---

## Rutas API

### Isabella (`/api/isabella/*`)
| Ruta | Propósito |
|---|---|
| `POST /api/isabella` | Sesión cognitiva de Isabella |
| `POST /api/isabella/chat` | Conversación con Isabella |
| `POST /api/isabella/isa/reason` | Razonamiento del núcleo soberano ISA |
| `POST /api/isabella/crypto/sign` | Firma MSR con clave del operador |
| `POST /api/isabella/crypto/verify` | Verificación de firma |
| `POST /api/isabella/gateway` | Gateway CROWN |
| `POST /api/isabella/gateway/emergency` | Modo emergencia CROWN |

### City (`/api/city/*`)
| Ruta | Propósito |
|---|---|
| `POST /api/city/events` | Eventos de la ciudad |
| `POST /api/city/incidents` | Incidentes con triage |
| `GET /api/city/infrastructure` | Salud de infraestructura |
| `POST /api/city/ioc` | Panel IOC |
| `POST /api/city/mobility` | Movilidad e índice de congestión |
| `POST /api/city/response` | Playbooks de respuesta |
| `GET /api/city/scorecard` | Scorecard de ciudad |

### Twins (`/api/twins/*`)
| Ruta | Propósito |
|---|---|
| `GET /api/twins/models` | Modelos DTDL |
| `GET /api/twins/instances` | Instancias de gemelos |
| `POST /api/twins/graph` | Grafo de relaciones |
| `POST /api/twins/query` | Consultas al grafo |
| `POST /api/twins/simulate` | Simulador de telemetría |

### Assets (`/api/assets/*`)
| Ruta | Propósito |
|---|---|
| `POST /api/assets/register` | Registro de activos |
| `GET /api/assets/health` | Salud de activos |
| `POST /api/assets/failures` | Modelo de falla |
| `POST /api/assets/maintenance` | Mantenimiento predictivo |
| `POST /api/assets/score` | Puntuación APM |

### Grid (`/api/grid/*`)
| Ruta | Propósito |
|---|---|
| `GET /api/grid/balance` | Balance de energía/agua |
| `GET /api/grid/topology` | Topología de red |
| `POST /api/grid/alerts` | Alertas de red |
| `POST /api/grid/power` | Potencia eléctrica |
| `GET /api/grid/water` | Red de agua |

### Gamification (`/api/gamification/*`)
| Ruta | Propósito |
|---|---|
| `POST /api/gamification/session` | Sesiones de juego |
| `POST /api/gamification/events` | Eventos (kills, wave, combo, misión, premio) |
| `GET /api/gamification/leaderboard` | Tabla de posiciones |
| `GET /api/gamification/status` | Estado del motor (2D/3D) |

### Marketplace (`/api/marketplace/*`)
| Ruta | Propósito |
|---|---|
| `POST /api/marketplace/offers` | Ofertas de datos |
| `POST /api/marketplace/license` | Licencias |
| `GET /api/marketplace/models` | Modelos disponibles |
| `POST /api/marketplace/publish` | Publicación de ofertas |
| `POST /api/marketplace/subscribe` | Suscripción entre nodos |

### Monitor (`/api/monitor/*`)
| Ruta | Propósito |
|---|---|
| `GET /api/monitor/health` | Health check |
| `GET /api/monitor/state` | Estado del nodo |
| `GET /api/monitor/events` | Eventos de monitoreo |

### Payments (`/api/payments/*`)
| Ruta | Propósito |
|---|---|
| `POST /api/payments/checkout` | Checkout |
| `GET /api/payments/status` | Estado de pago |
| `POST /api/payments/merchant/payout` | Payouts |

### Otros
| Ruta | Propósito |
|---|---|
| `POST /api/auth/register` | Registro de usuario |
| `GET /api/observability/status` | Estado del fabric cognitivo YUN |

---

## Gamificación: Web 2D y Arena 3D Unity

La gamificación combina un **motor de puntos server-authoritative** (HMAC, anti-cheat) con dos motores de juego:

### Web 2D (fallback)
`ZombieInvasionFallback` es un motor 2D en canvas que reporta kills, oleadas, combos, misiones y canjes de premio a través de los mismos eventos. Se usa cuando la arena 3D no está disponible (estado `missing`/`error`).

### Arena 3D (Unity WebGL)
`UnityInvasion3D` carga el build WebGL de la arena (`/unity/RDMArena` — `RDMArena.loader.js`):

- **Flujo de integración** (`components/gamification/ZombiesInvasionSection.tsx`): pestaña `arena3d` carga la arena; `UnityInvasion3D` gestiona el ciclo de vida (crear/eliminar) y se degrada a 2D ante fallos.
- **Puente C#-JS (`rdm-yun`)**: `unity/Assets/Scripts/GameCore/WebGLBridge.cs` + `unity/Assets/Plugins/WebGL/RDMWebGL.jslib`.
- **Eventos del bridge**: `session-started` (con payload de sesión), `kill` (→ `sendMessage('ScoreUpdated')`), `wave` (→ `reportWave`), `combo` (→ `reportCombo`), `mission-completed`, `prize-redeemed`.
- **Hooks**: `hooks/use-unity-webgl.ts` orquesta carga, configuración y errores de la arena.

### Build del proyecto Unity
1. Abre `unity/` con **Unity 2022.3.62f1** (WebGL Build Support).
2. Menu **Tools → RDM → Create Arena Scene** para regenerar la escena de la arena.
3. Menu **Tools → RDM → Build WebGL Arena** para compilar a `unity/build/`.
4. Copia el resultado a `public/unity/RDMArena/` (README de instrucciones en `unity/README.md`).

---

## Pruebas Automatizadas

Suite **Vitest** en `tests/` (29 archivos, 245 tests). Cobertura por dominio:

| Archivo | Cubre |
|---|---|
| `anti-cheat`, `points-engine`, `gamification-visual` | Motor de gamificación y arena |
| `assets`, `city`, `grid`, `twins`, `marketplace`, `payments` | Dominios territoriales |
| `isabella` (`isa-core`, `bus-bridges`, `dead-man-switch`, `gateway-policy`, `engine`, `rules`) | Núcleo cognitivo y CROWN |
| `trust`, `zero-trust`, `auth-tokens`, `hardening` | Seguridad y Zero Trust |
| `events`, `contracts`, `env`, `system`, `features`, `governance`, `monitoring`, `observability`, `resilience` | Núcleo transversal y operación |

---

## Estado Actual

| Hito | Estado |
|---|---|
| Typecheck (`tsc --noEmit`) | ✅ Limpio |
| Lint (`eslint .`) | ✅ 0 problemas |
| Tests (`vitest`) | ✅ 245/245 (29 archivos) |
| Auditor de consistencia (`npm run audit`) | ✅ 0 errores |
| Build de producción (`next build`) | ✅ Exitoso |
| Contrato de entorno (`check:env`) | ✅ OK |
| Adopción del route-guard (`check:contracts`) | ✅ OK |
| Gemelo Digital (Twins) | ✅ DTDL · NGSI · grafo · simulación |
| IOC Urbano | ✅ Incidentes · playbooks · scorecard · RBAC |
| EAM/APM | ✅ Salud · falla · mantenimiento · APM Score |
| Smart Grid/Agua | ✅ Balance · topología · alertas |
| Marketplace | ✅ Ofertas · licencias · suscripción |
| Zero Trust en APIs | ✅ Origin · rate limit · fail-closed · route-guard único |
| Bus YUN unificado | ✅ Envelope + traceId/correlationId · anti-lazo |
| Gamificación | ✅ Puntos server-authoritative · anti-cheat · arena 3D Unity WebGL con fallback 2D |
| Fabric cognitivo YUN | ✅ Observabilidad (SLO/RED/grafo) · Guardian Kernel |
| Supabase/Postgres | ✅ Migraciones 001 y 002 con RLS |

---

## Scripts

```bash
npm install --legacy-peer-deps   # Instalar dependencias
npm run dev                      # Desarrollo (http://localhost:3000)
npm run build                    # Build de producción
npm run start                    # Servir el build
npm run lint                     # ESLint
npm test                         # Vitest (245 tests)
npm run audit                    # Consistencia del código (bloquea `as never` / `require()`)
npm run check:env                # Entorno contra el contrato
npm run check:contracts          # Adopción del route-guard
npm run quality                  # Todo en cadena (audit + env + contracts + lint + tsc + test)
npx tsc --noEmit                 # Typecheck
```

---

## Variables de Entorno

Copia `.env.example` a `.env.local`. El contrato tipado vive en `lib/core/env/index.ts`; no regenerar secretos y no commitear `.env.local`.

| Variable | Propósito |
|---|---|
| `GEMINI_API_KEY` | Clave de Google AI Studio para Isabella Villaseñor AI |
| `APP_URL` | URL canónica de la app |
| `NEXT_PUBLIC_SITE_URL` | URL pública para SEO / Open Graph |
| `ISA_API_KEY` | Clave del núcleo soberano ISA (rotables `_V2`/`_V3`) |
| `MEXA_API_KEY` / `MEXA_OPERATOR_KEY` | Claves de la Mexa API y del operador (firmas MSR) |
| `GAMIFICATION_API_KEY` / `GAMIFICATION_HMAC_SECRET` | Claves del motor de gamificación server-authoritative |
| `MONITOR_API_KEY`, `CROWN_API_KEY`, `CROWN_EMERGENCY_*` | Monitoreo y emergencia CROWN |
| `POSTGRES_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Postgres primario (Supabase) |
| `NEON_DATABASE_URL` | Postgres réplica (Neon) |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Redis (Upstash) |

> Sin `GEMINI_API_KEY`, Isabella opera en **modo simulación local seguro** (no falla, responde con datos del territorio).

---

## Despliegue en Vercel

1. Importa el repositorio en [Vercel](https://vercel.com/new).
2. `vercel.json` ya define `npm install --legacy-peer-deps`, build `next build` y región `iad1`.
3. En **Project Settings → Environment Variables** añade: `GEMINI_API_KEY`, `APP_URL`, `NEXT_PUBLIC_SITE_URL`, `MEXA_OPERATOR_KEY`, `GAMIFICATION_HMAC_SECRET` (y las demás del contrato).
4. Deploy. Verifica que `metadataBase` use la URL de producción.

---

## Base de Datos

Migraciones en `supabase/migrations/`:

- **001** — Capa cognitiva Isabella: `isabella_sessions`, `isabella_messages`, `isabella_memory_items`, `isabella_decisions`, `isabella_tools`, `isabella_tool_calls`, `isabella_policies`, `isabella_approvals`, `isabella_audit_logs` con RLS por tenant.
- **002** — Dominios territoriales: `dt_twin_models`, `dt_twins` (con índice PostGIS), `dt_twin_edges`, `dt_assets`, `dt_work_orders`, `dt_city_incidents`, `dt_grid_nodes` con seeds y RLS.

Para aplicar:

```bash
supabase db push
# o
psql "$DATABASE_URL" -f supabase/migrations/002_create_territorial_domains.sql
```

> Requiere las extensiones `postgis` y `pgcrypto` (incluidas en la migración).

---

## Documentación Técnica

| Documento | Contenido |
|---|---|
| `docs/adr-0001-isa-soberano.md` | Núcleo soberano ISA (fin de la dependencia de Gemini) |
| `docs/adr-0002-zero-trust-7-capas.md` | Cadena Zero Trust de 7 capas |
| `docs/adr-0003-observabilidad.md` | Monitor General del Nodo Cero |
| `docs/c4-contexto.md` | Diagrama C4 de contexto, contenedores y componentes |
| `docs/catalogo-apis.md` | Contratos de API (semver + ciclo de vida) |
| `docs/mapa-dominios.md` | Dominios ↔ código ↔ federación YUN |
| `docs/guia-desarrollador.md` | Convenciones, cómo añadir dominios/APIs, resiliencia y caché |
| `docs/guia-modularizacion.md` | Modularización: núcleo transversal, route-guard, contratos |
| `AGENTS.md` | Convenciones para agentes de IA |
| `unity/README.md` | Pipeline de build e integración de la Arena 3D |

---

## Licenciamiento

**© 2026 Edwin Oswaldo Castillo Trejo (Anubis Villaseñor) — RDM Digital Hub.**

Todos los derechos reservados sobre la identidad, la marca "RDM Digital Hub", la arquitectura **Heptafederada YUN**, el personaje **Isabella Villaseñor AI** y los datos turísticos/históricos curados del territorio de Real del Monte.

- El código fuente de este repositorio se distribuye para **uso privado y de demostración**.
- Se requiere **autorización expresa del autor** para uso comercial, despliegue público masivo o redistribución.
- La Comarca Minera es un **Geoparque Mundial UNESCO** (2017): el uso de la imagen territorial debe respetar el patrimonio cultural.

Para colaboraciones, licencias o despliegues oficiales, contactar al autor a través del repositorio.

---

*Construido con Next.js, Three.js, Unity WebGL, Leaflet, Recharts, Vitest y la Heptafederación YUN.*
*Real del Monte, Hidalgo — Cuna de la Minería Mexicana.*

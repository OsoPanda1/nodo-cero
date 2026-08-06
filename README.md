# RDM Digital Hub — Nodo Cero

**Sistema de Inteligencia Territorial Soberano para Real del Monte, Hidalgo, México.**

Plataforma digital integral (Phygital) del **RDM Digital Hub — Nodo Cero**: convergencia de **Plataforma de Gemelo Territorial / Smart City** con gemelo digital, centro de operaciones urbano (IOC), gestión de activos y mantenimiento (EAM/APM), redes inteligentes de energía y agua, marketplace soberano, telemetría IoT, criptografía post-cuántica y la asistencia cognitiva de **Isabella Villaseñor AI**, todo sobre la **Arquitectura Heptafederada YUN** de 7 núcleos.

> Real del Monte, conocido como **"Cuna de la Minería Mexicana"**, es Pueblo Mágico de Hidalgo y parte del **Geoparque Mundial UNESCO de la Comarca Minera** (2017).

---

## Índice

1. [¿Qué es?](#qué-es)
2. [¿Qué hace?](#qué-hace)
3. [Plataforma de Gemelo Territorial](#plataforma-de-gemelo-territorial)
4. [Dominios de la Plataforma](#dominios-de-la-plataforma)
5. [¿Cómo lo hace?](#cómo-lo-hace)
6. [Arquitectura Heptafederada YUN](#arquitectura-heptafederada-yun)
7. [Stack Tecnológico](#stack-tecnológico)
8. [Estructura del Proyecto](#estructura-del-proyecto)
9. [Implementaciones](#implementaciones)
10. [Mejoras Realizadas](#mejoras-realizadas)
11. [Pruebas Automatizadas](#pruebas-automatizadas)
12. [Base de Datos (Supabase/Postgres)](#base-de-datos-supabasepostgres)
13. [Avance Real hacia Producción](#avance-real-hacia-producción)
14. [Despliegue en Vercel](#despliegue-en-vercel)
15. [Variables de Entorno](#variables-de-entorno)
16. [Scripts](#scripts)
17. [Licenciamiento](#licenciamiento)

---

## ¿Qué es?

**RDM Digital Hub — Nodo Cero** es el **Sistema Operativo Territorial** (TOS) de Real del Monte. Trata al pueblo como una *plataforma inteligente viva*: unifica su patrimonio histórico-minero, su vida cultural, su economía local (pastes y platería) y su geografía con tecnología de punta:

- **Gemelo digital territorial** con modelos DTDL, NGSI-LD, grafo de relaciones y simulación en tiempo real.
- **Centro de Operaciones Urbano (IOC)**: incidentes, triage, playbooks de respuesta, movilidad, emergencias e infraestructura crítica.
- **EAM/APM**: registro de activos, salud, modelo de falla, mantenimiento predictivo y órdenes de trabajo.
- **Smart Grid y Agua**: balance de energía y agua, topología de red, alertas y resiliencia.
- **Marketplace Soberano**: ofertas de datos, licencias y suscripción entre nodos federados.
- **7 núcleos soberanos** (35 nodos operativos) de arquitectura descentralizada.
- **Isabella Villaseñor AI**: asistente cognitivo del territorio basado en Google Gemini.
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

## ¿Qué hace?

### 1. Portal "Trailer AAA" e identidad visual
Hero en **WebGL (Three.js)** con cristal holográfico central, 7 satélites orbitando (los 7 núcleos YUN), partículas flotantes y modal de trailer cinematográfico 4K simulado.

### 2. Turismo y Eventos
- **8 eventos/festivales** reales del calendario local (Feria del Paste en octubre, Semana de los Mineros de Cornualles en marzo, Fiestas de la Asunción en agosto, Festival de la Primera Huelga de América en julio, Día de Muertos en el Panteón Inglés, Trail de Peñas Cargadas, Calendas de Mayo, Navidad).
- **5 rutas turísticas** con paradas georreferenciadas (Ruta de la Plata, Ruta del Legado Inglés, Ruta del Paste, Ruta de los Miradores, Ruta de la Fe).
- **5 dichos populares** del pueblo con su significado y origen.
- **Línea de tiempo histórica** de 1554 a 2026.
- **10 comercios** destacados (pasteadoras, platerías, cafés, panaderías, hospedajes).

### 3. Gemelo Digital 2D/3D y Twins
Mapa interactivo **Leaflet** con estética *dark matter* (CARTO), 15 POIs geolocalizados, y el dominio **Twins**: modelos DTDL (Building, EnergyGrid, WaterNetwork, Vehicle, PublicSpace), conversión NGSI-LD, grafo de relaciones, simulador de telemetría y consultas — todo consumible desde `app/twins` y `/api/twins/*`.

### 4. Ciudad IOC (Centro de Operaciones)
Dominio `app/city`: **CityIOC** con KPIs en vivo, scorecard de ciudad ponderado (6 dimensiones, calificación A–F), incidentes con ranking/triage automático, playbooks de respuesta por dominio (Protección Civil, tráfico, bomberos, policía, energía, agua, salud), escalación de emergencias con lockdown, control de movilidad con índice de congestión, grid de salud de infraestructura, panel de mando de emergencias y **políticas RBAC** por rol (observer/operator/supervisor/admin) con SLAs y colas de triage.

### 5. EAM/APM (Activos y Mantenimiento)
Dominio `app/assets`: registro de activos (transformadores, bombas, válvulas, vehículos, compresores, estructuras patrimoniales), motor de salud (`computeAssetHealth`), modelo de falla con probabilidad y `meanTimeToFailure`, mantenimiento predictivo con prioridades y fechas, órdenes de trabajo generadas automáticamente y **APM Score** global con 4 pilares (availability, reliability, maintainability, compliance) y calificación A–F.

### 6. Smart Grid y Agua
Dominio `app/grid`: balance eléctrico (generación, carga, reserva, voltaje, frecuencia), balance hídrico (producción, demanda, nivel de almacenamiento, presión, calidad), topología de red multi-nodo (subestaciones, alimentadores, tanques, bombas, válvulas, medidores) con enlaces por dominio, alertas automáticas por umbral (sobrecarga, tensión baja, nivel/presión baja, calidad fuera de norma) y estado global de la red.

### 7. Marketplace
Dominio `app/marketplace`: catálogo de **modelos de datos y ofertas** entre nodos federados, motor de búsqueda, publicación, suscripción y **control de licencias** para intercambio de datos territoriales.

### 8. Criptografía Post-Cuántica
Explorador de bloques Ledger, rotación de llaves simulada, medidores de blindaje y tarjetas de los estándares NIST.

### 9. Isabella Villaseñor AI
Chat con **Google Gemini 2.5 Flash** (con fallback a modo simulación local seguro). Opera como **núcleo cognitivo gobernado** (`lib/isabella/`): los motores **ORION** (percepción), **SOPHIA** (razonamiento), **ARGUS** (riesgo), **LUMEN** (evaluador constitucional), **KERNEL** (identidad), **TOPOLOGY** (territorio) y **MNEMOS** (memoria jerárquica) ejecutan el ciclo *Perceive → Remember → Decide → Act → Audit* bajo la **Constitución YUN**, con policy gate, audit tracer y bus de eventos.

### 10. Explorador de Nodos YUN
Los **35 nodos** organizados por núcleo, con búsqueda, vista de detalle con métricas en vivo, medidores de señal, prueba de endpoint y consulta directa a Isabella.

### 11. Zombies RDM Invasion (juego geolocalizado)
Gamificación tipo *Pokémon GO* sobre el gemelo digital: spawns de zombies en los 15 POIs reales, combate por turnos, captura con Sello RDM, bestiario, inventario, misiones y tienda de premios. Incluye capa **server-authoritative** de puntos con HMAC (`lib/gamification/*`, `/api/gamification/*`) para evitar trampas. La capa visual es **calidad AAA con latencia casi cero**: motor de **calidad adaptativa** (`lib/gamification/visual/quality.ts`) que mide el FPS real y degrada/recupera efectos sin interrumpir el input; lienzo de partículas con **pool sin GC por fotograma** (`lib/gamification/visual/fx-engine.ts` + `ArenaFXCanvas`); arena cinematográfica con niebla, rejilla, aura, sacudida, destellos, popups de daño, rayo y sello de captura; sprite SVG procedimental con ojos, heridas y sello giratorio, y overlay atmosférico sobre el mapa Leaflet.

### 12. CROWN Gateway y Dead Man Switch
Pasarela federada de la flota de IA con políticas de acceso, registro de emergencias y **Dead Man Switch** (`lib/isabella/dead-man-switch.ts`): si el operador deja de reportarse, se activan protocolos de emergencia automáticos.

---

## Plataforma de Gemelo Territorial

Desde la SPA (`app/page.tsx`) y la navegación (`components/layout/YUNLayout.tsx`) se integran **cinco dominios operativos** como vistas nativas, cada uno con motor (`lib/<dominio>/*`), API con trust layer (`app/api/<dominio>/*`), componentes reutilizables (`components/<dominio>/*`) y página (`app/<dominio>/page.tsx`):

```
Vista             Dominio            Ruta SPA       APIs
twins             Gemelo Digital     activeView     /api/twins/{models,instances,graph,simulate,query}
city              IOC Urbano         activeView     /api/city/{ioc,events,incidents,mobility,response,infrastructure,scorecard}
eam               Activos/APM        activeView     /api/assets/{register,health,maintenance,failures,score}
grid              Energía y Agua     activeView     /api/grid/{power,water,topology,balance,alerts}
digital-marketplace  Marketplace     activeView     /api/marketplace/{models,offers,publish,subscribe,license}
```

Todos los datos provienen de **datos reales del territorio** (`lib/data/rdm-data.ts`): los **15 POIs** se convierten en gemelos, activos patrimoniales, nodos de red e incidentes de aforo, y los **35 nodos YUN** alimentan el grafo de gemelos de servicios (ver `lib/data/rdm-territorial.ts`).

---

## Dominios de la Plataforma

### Twins (Gemelo Digital) — `lib/twins/` · `app/api/twins/` · `components/twins/` · `app/twins/`

| Pieza | Descripción |
|---|---|
| `dtdl/*` | Modelos DTDL v3: Building, EnergyGrid, WaterNetwork, Vehicle, PublicSpace |
| `ngsi/*` | Esquemas y convertidores NGSI-LD |
| `twin-graph.ts` | Grafo de gemelos: nodos, aristas, adyacencia, vecinos, relacionados |
| `twin-simulator.ts` | Simulación de telemetría y estados |
| `twin-store.ts` | Registro en memoria con TTL, seed desde POIs y nodos YUN |
| `twin-queries.ts` | Filtros por dominio/estado/modelo/texto, conteos |
| UI | `TwinsDashboard`, `TwinGraphView`, `TwinModelEditor`, `TwinInspectorPanel`, `TwinTelemetryStrip`, `TwinRelationDrawer` |

### City IOC — `lib/city/` · `app/api/city/` · `components/city/` · `app/city/`

| Pieza | Descripción |
|---|---|
| `city-types.ts` | Dominios, severidades, estados, incidentes, acciones, KPIs, scorecard |
| `city-event-bus.ts` | Bus de eventos con seed de 5 incidentes base + incidentes derivados de POIs |
| `city-incident-engine.ts` | Ranking por severidad/fecha, triage automático, por dominio, escalación |
| `city-response-playbooks.ts` | Playbooks por dominio y nivel de automatización, ETA total |
| `city-ioc-state.ts` | Estado agregado del centro de operaciones |
| `city-mobility-engine.ts` | Segmentos viales, utilización, índice de congestión, alertas |
| `city-emergency-engine.ts` | Escalación 1–4, lockdown, detección de emergencias, resumen |
| `city-infrastructure-engine.ts` | Salud de infraestructura crítica |
| `city-scorecard.ts` | Scorecard ponderado (6 dimensiones, grade A–F) |
| `city-policy.ts` | RBAC por roles, SLAs, colas de triage, cierre/escalación |
| UI | `CityDashboard`, `CityIOCOverview`, `IncidentTimeline`, `UrbanBrainMap`, `EmergencyCommandPanel`, `MobilityControlPanel`, `InfrastructureHealthGrid`, `CityScorecardPanel` |

### EAM/APM — `lib/assets/` · `app/api/assets/` · `components/assets/` · `app/assets/`

| Pieza | Descripción |
|---|---|
| `asset-types.ts` | Categorías, criticidad, estado, condición, telemetría |
| `asset-registry.ts` | Registro en memoria con seed industrial + activos derivados de POIs |
| `asset-health-engine.ts` | `computeAssetHealth` (0–100), resumen de flota |
| `asset-failure-model.ts` | `failureProbability` (banda, MTTF, factor dominante), riesgo de flota |
| `asset-predictive-maintenance.ts` | Recomendaciones con estrategia, prioridad y próxima fecha |
| `asset-work-orders.ts` | Generación y estadísticas de órdenes de trabajo |
| `asset-apm-score.ts` | APM Score global con 4 pilares y calificación |
| UI | `AssetDashboard` (auto-fetch): salud, riesgo, mantenimiento y órdenes |

### Smart Grid y Agua — `lib/grid/` · `app/api/grid/` · `components/grid/` · `app/grid/`

| Pieza | Descripción |
|---|---|
| `grid-types.ts` | Nodos de energía/agua, enlaces, alertas |
| `grid-network.ts` | Seed de red multi-nodo + nodos derivados de POIs/nodos YUN |
| `grid-balance.ts` | Balance eléctrico e hídrico |
| `grid-alerts.ts` | Alertas por umbrales y estado de nodo |
| `grid-state.ts` | Estado global de la red |
| UI | `GridDashboard` (auto-fetch): vista de red, balances, alertas |

### Marketplace — `lib/marketplace/` · `app/api/marketplace/` · `components/marketplace/` · `app/marketplace/`

| Pieza | Descripción |
|---|---|
| `marketplace-types.ts` | Ofertas, modelos, licencias, suscripciones |
| `marketplace-store.ts` | Almacén de ofertas y modelos |
| `marketplace-search.ts` | Búsqueda y filtrado |
| `marketplace-license.ts` | Control de licencias y acceso |
| UI | `MarketplaceDashboard` (auto-fetch): ofertas y resumen |

---

## ¿Cómo lo hace?

### Flujo de datos

```
Cliente (React SPA)
   │
   ├── /api/isabella ─────────────► GoogleGenAI (Gemini 2.5 Flash)
   │        └─ fallback local ─────► Modo simulación seguro (sin API key)
   │
   ├── /api/twins/* ──────────────► lib/twins/* (DTDL, NGSI, grafo, simulación)
   ├── /api/city/* ───────────────► lib/city/* (IOC, incidentes, scorecard)
   ├── /api/assets/* ─────────────► lib/assets/* (salud, falla, mantenimiento, APM)
   ├── /api/grid/* ───────────────► lib/grid/* (balance energía/agua, alertas)
   ├── /api/marketplace/* ────────► lib/marketplace/* (ofertas, licencias)
   │
   ├── lib/data/rdm-data.ts ─────── 15 POIs · 7 núcleos · 35 nodos YUN
   ├── lib/data/rdm-territorial.ts  Adaptador POIs/nodos → twins, assets, grid, incidents
   ├── lib/data/rdm-tourism.ts ──── 8 eventos · 5 rutas · 5 dichos · 9 hitos · 10 comercios
   └── public/images/*.jpg ──────── 37 fotografías reales del territorio
```

### Capa de confianza (Zero Trust)

Toda la superficie de entrada pasa por el **route-guard único**
(`app/api/_shared/route-guard.ts`), que aplica en orden:

1. `assertServerOnly()` — rechaza ejecución fuera del servidor.
2. `verifyOrigin(req)` — valida `Origin`/`Referer` contra `APP_URL`.
3. `rateLimit(req, ROUTE_ID, RATE_LIMIT)` — límite por ruta con `Retry-After`.
4. `assertZeroTrust()` — cadena de 7 capas YUN (fail-closed).
5. Guardas de método/JSON y validación de cuerpo con **contratos zod**
   (`lib/core/contracts`), emitiendo telemetría al bus unificado (`lib/core/events`).

La trust canónica vive en `lib/security/trust.ts` (`lib/isabella/trust.ts` es
barril de compatibilidad). Además: **comparación en tiempo constante**
(`constantTimeCompare`) para claves de operador, gateway con *fail-closed*
(`lib/isabella/gateway-policy.ts`), PII redactada y auditabilidad vía
`isabella_audit_logs`.

---

## Arquitectura Heptafederada YUN

| Núcleo | Nombre | Rol | Nodos |
|---|---|---|---|
| **1** | Decisión | Isabella AI, orquestación estratégica | 4 |
| **2** | Trazabilidad | Criptografía post-cuántica y ledger | 5 |
| **3** | Experiencia Visual | Gemelo digital 2D/3D y mapas phygital | 5 |
| **4** | Resiliencia | Red soberana, edge y sensores IoT | 5 |
| **5** | Operación | Turismo, comercio local y pastes | 5 |
| **6** | Identidad | Ciudadanía digital y pasaporte phygital | 5 |
| **7** | Interconexión | Federación YUN, Supabase y Vercel API | 6 |

**35 nodos operativos** (YUN-01-A … YUN-07-E), cada uno con estado, latencia, métricas y especificaciones técnicas consultables en la UI.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Framework** | Next.js 16 (App Router, React 19, TypeScript 5.9) |
| **Estilos** | Tailwind CSS 4 + CSS custom (glass panels, glows, shimmer) |
| **3D / WebGL** | Three.js + @react-three/fiber (transpilado) |
| **Mapas** | Leaflet + tiles CARTO dark |
| **Gráficas** | Recharts |
| **Animación** | Motion |
| **Iconos** | Lucide React |
| **IA** | @google/genai (Gemini 2.5 Flash) |
| **Pruebas** | Vitest 4 (`npm test`) |
| **Base de datos** | Supabase/Postgres (migraciones SQL, RLS, PostGIS) |
| **Lenguaje** | Español (es-MX) |

---

## Estructura del Proyecto

```
vvvvvvv-main/
├── app/
│   ├── api/
│   │   ├── isabella/                # Isabella AI (Gemini + fallback), ISA, Mexa, gateway
│   │   ├── gamification/            # Puntos HMAC server-authoritative (events, session)
│   │   ├── twins/                   # models, instances, graph, simulate, query
│   │   ├── city/                    # ioc, events, incidents, mobility, response, infrastructure, scorecard
│   │   ├── assets/                  # register, health, maintenance, failures, score
│   │   ├── grid/                    # power, water, topology, balance, alerts
│   │   ├── marketplace/             # models, offers, publish, subscribe, license
│   │   ├── payments/                # checkout, status, merchant/payout (idempotente + secret)
│   │   ├── auth/register/           # Identity: registro de ciudadanos y comercios
│   │   └── monitor/health/          # Health con zero-trust L6 (API key interna)
│   ├── twins/page.tsx               # Gemelo Digital
│   ├── city/page.tsx                # IOC Urbano
│   ├── assets/page.tsx              # EAM/APM
│   ├── grid/page.tsx                # Smart Grid/Agua
│   ├── marketplace/page.tsx         # Marketplace
│   ├── page.tsx                     # SPA integrada (activeView para los 5 dominios)
│   └── layout.tsx
├── components/
│   ├── twins/                       # TwinsDashboard, TwinGraphView, TwinModelEditor, ...
│   ├── city/                        # CityDashboard, CityIOCOverview, EmergencyCommandPanel, ...
│   ├── assets/                      # AssetDashboard (salud, riesgo, mantenimiento, órdenes)
│   ├── grid/                        # GridDashboard (red, balances, alertas)
│   ├── marketplace/                 # MarketplaceDashboard (ofertas, resumen)
│   ├── layout/YUNLayout.tsx         # Nav integrada (twins, city, eam, grid, digital-marketplace)
│   ├── gamification/                # Zombies RDM Invasion
│   └── ...                          # 3D, isabella, map, nodes, phygital, security, telemetry, tourism
├── lib/
│   ├── core/                       # Núcleo transversal: utils, events (bus YUN), env, contracts
│   ├── security/                   # trust (canónica), zero-trust, keys, auth tokens
│   ├── observability/              # Fabric cognitivo YUN: SLO, métricas RED, grafo causal, bridge
│   ├── guardian/                   # Guardian Kernel: deny-by-default, autonomía, escalación humana
│   ├── resilience/                 # Reintentos, circuit breaker, bulkhead (unificados)
│   ├── monitoring/                 # MetricsRegistry, tracer, correlator, alertas, bridge al bus
│   ├── gamification/               # Anticheat y puntos firmados (+ visual/ calidad adaptativa)
│   ├── twins/ dtdl/ ngsi/          # Motores del gemelo digital
│   ├── city/                       # Motores del IOC urbano
│   ├── assets/                     # Motores EAM/APM
│   ├── grid/                       # Motores smart grid/agua
│   ├── marketplace/                # Motores del marketplace
│   ├── identity/                   # Registro de ciudadanos/comercios (store + contratos zod)
│   ├── payments/                   # Motor de pagos idempotente con secretos de comercio
│   ├── isabella/                   # Núcleo cognitivo C.R.O.W.N. + gateway + DMS
│   └── data/                       # rdm-data, rdm-tourism, rdm-territorial, zombies-data
├── app/api/_shared/route-guard.ts  # Guard transversal único de las rutas API
├── scripts/                        # audit-project, check-env, check-contracts
├── supabase/migrations/
│   ├── 001_create_isabella_tables.sql   # Capa cognitiva (sessions, memory, decisions, audit)
│   └── 002_create_territorial_domains.sql  # Twins, assets, work_orders, incidents, grid + RLS
├── tests/                          # 27 archivos · 238 tests (vitest)
├── RFC-0001.md                     # Manifiesto C.R.O.W.N.
├── AGENTS.md                       # Convenciones para agentes de IA
├── vitest.config.mts
├── .env.example
├── next.config.ts
└── vercel.json
```

---

## Implementaciones

1. **Datos reales del territorio** — 15 POIs con coordenadas geográficas reales, historia, insignias phygital y sensores. Imágenes locales auténticas (37 fotografías de Real del Monte).
2. **35 nodos YUN completos** — Antes la lista declaraba 35 pero solo definía 28; hoy los 35 nodos existen, distribuidos en los 7 núcleos.
3. **Sección Turismo** — Nueva vista con pestañas (Eventos / Rutas / Dichos / Historia) con datos documentados del calendario local y la tradición cornish.
4. **Isabella con conocimiento territorial** — System prompt ampliado con rutas, eventos, historia y recomendaciones.
5. **Visualizaciones sofisticadas** — Franja de cifras, medidores de blindaje cuántico, retícula cuántica SVG, auroras de gradiente, grid de salud IoT.
6. **SEO y metadatos** — `lang="es"`, Open Graph (es_MX), Twitter Card, canonical, `metadataBase`.
7. **Núcleo cognitivo gobernado de Isabella** — `lib/isabella/` con los 7 motores cognitivos y la **Constitución YUN** como policy gate.
8. **Zombies RDM Invasion** — Juego geolocalizado completo integrado al Hub y al bus YUN.
9. **Capa constitucional C.R.O.W.N. y ISA API v4.0 Enterprise** — Prompt Guard de 9 categorías, Intention Parser de 8 dominios, Structured Reasoning (Answer + Sources + Trace), PRA Score Engine, Mexa API con firmas MSR.
10. **Dominio Twins (Gemelo Digital)** — Modelos DTDL v3, NGSI-LD, grafo de gemelos, simulador, store y queries; integrado a la SPA y con API de 5 rutas.
11. **Dominio City IOC** — Centro de operaciones urbano con incidentes, triage, playbooks, scorecard ponderado, RBAC y SLAs; 7 rutas de API y 8 componentes de UI.
12. **Dominio EAM/APM** — Registro de activos, salud, modelo de falla, mantenimiento predictivo, órdenes de trabajo y APM Score; 5 rutas de API.
13. **Dominio Smart Grid/Agua** — Balance de energía y agua, topología, alertas; 5 rutas de API.
14. **Dominio Marketplace** — Ofertas, licencias, suscripción y búsqueda de modelos de datos; 5 rutas de API.
15. **Zero Trust en todas las APIs** — `enforceTrust` (server-only + origin + rate limit), `constantTimeCompare`, gateway *fail-closed*, Dead Man Switch.
16. **Datos reales conectados** — `lib/data/rdm-territorial.ts` convierte los 15 POIs y 35 nodos YUN en gemelos, activos, nodos de red e incidentes (deja de ser mock).
17. **Base de datos Supabase/Postgres** — Migración `002` con tablas de twins, activos, órdenes, incidentes y nodos de red, seeds y Row Level Security.
18. **Núcleo transversal (Fase 1)** — `lib/core/` (utils, bus YUN unificado con trace/correlation, contrato de entorno zod, contratos de rutas), trust canónica en `lib/security/trust.ts`, **route-guard único** (`app/api/_shared/route-guard.ts`) que reemplaza ~30 copias de `enforceTrust`, y scripts de calidad (`audit-project`, `check-env`, `check-contracts`).
19. **Migración total al route-guard (Fase 2a)** — Las **46 rutas** de API usan `guardedRoute`; las de Isabella conservan su cadena soberana (clasificación automática de `check-contracts`). Los buses de city y monitor se unificaron al bus YUN con guardia anti-lazo (Fase 2b/2c).
20. **Visual AAA con latencia casi cero (Fase 3)** — Motor de calidad adaptativa por FPS, partículas con pool, arena cinematográfica y sprite enriquecido de los zombies (ver sección 11).
21. **Fabric cognitivo YUN (Fase 4)** — Observabilidad (`lib/observability`: SLO con presupuestos de error, métricas RED, grafo causal de eventos) y guardianía (`lib/guardian`: Guardian Kernel con deny-by-default, mínimo privilegio, idempotencia, reversibilidad y escalación humana), conectados al bus YUN y expuestos en `GET /api/observability/status`.
22. **F5 — Endurecimiento P0/P1** — Dominio **Identity** (`lib/identity/`, `POST /api/auth/register` con contratos zod y store) integrado a la SPA (`RegisterSection`); **pagos endurecidos** (`lib/payments/`): `idempotencyKey`, claves de comercio `mk_` con verificación en tiempo constante y anti-IDOR en retiros; **observabilidad** con métricas RED exactas (un solo registro por petición) y SLO `api.telemetry.health`; **route-guard** ampliado con capas L3/L5/L6 (zero-trust de API keys con HMAC opcional) y **8 rutas migradas a contratos zod** (`lib/{gamification,city,marketplace,twins}/api-contracts.ts`).

---

## Mejoras Realizadas

### Correcciones de bugs
- `RDM_NODES_35` pasó de 28 a **35 nodos** reales.
- **Estado muerto** eliminado (`isPlayingVideo` no utilizado).
- **Tecla ESC** ahora cierra el modal del trailer.
- **Imports sin usar** removidos.
- Coordenadas del **Panteón Inglés** corregidas.
- **Warning de ESLint** en `IsabellaChat` resuelto con ref.
- **Tests de tipado** corregidos para `TwinInstanceRecord` y `autoTriageIncident` (`createdAt`/`updatedAt`).

### Optimizaciones
- Imágenes migradas de picsum.photos a archivos locales.
- `vercel.json` con headers de seguridad y `npm install --legacy-peer-deps`.
- `next.config.ts` saneado.
- Build y lint **100% limpios**.
- 238 tests automatizados en Vitest (27 archivos).

### Modernización del Núcleo (Fases 1–4)
- **F1 — Núcleo transversal**: `lib/core/` (bus YUN unificado, entorno tipado, contratos zod), trust canónica y route-guard único; scripts de calidad bloqueantes (`audit`, `check:env`, `check:contracts`).
- **F2 — Migración de rutas y buses**: 46 rutas migradas al `guardedRoute`; buses de city y monitor unificados al bus YUN con **guardia anti-lazo** (`lib/monitoring/bridge.ts`).
- **F3 — Visual AAA de gamificación**: calidad adaptativa por FPS (`AdaptiveQuality`), partículas con pool sin GC (`FxEngine`), arena cinematográfica GPU-only, sprite enriquecido y overlay atmosférico; **238/238 tests**.
- **F4 — Fabric cognitivo YUN**: `lib/observability` (SLO con presupuestos de error, métricas RED con percentiles, grafo causal de eventos) y `lib/guardian` (Kernel deny-by-default con idempotencia, reversibilidad y escalación humana), puente `wireObservabilityToBus` anti-lazo y nueva ruta `GET /api/observability/status`.
- **F5 — Endurecimiento y organización P0/P1**: dominio **Identity** (`lib/identity/` + `POST /api/auth/register` con contrato zod y store en memoria, emisor al bus YUN) y `RegisterSection` en la SPA; **pagos endurecidos** (`lib/payments/engine.ts`): intención idempotente por `idempotencyKey`, `MerchantAccount` con secreto `mk_*` verificado en tiempo constante y anti-IDOR en `requestPayout`; observabilidad RED exacta y SLO de telemetría; **route-guard** con opciones de zero-trust L3/L5/L6 (API keys, firma HMAC opcional, body) y lectura única del cuerpo; migración a contratos zod de las rutas `gamification/session`, `city/{incidents,events}`, `marketplace/{subscribe,license}` y `twins/{models,instances,simulate}`; gamificación conectada al motor (ruta `GET /api/gamification/status` y retos reclamables con puntos server-authoritative). **238 tests en 27 archivos**.

---

## Pruebas Automatizadas

```bash
npm test          # Vitest run — 27 archivos · 238 tests
npx tsc --noEmit  # Typecheck completo
npm run lint      # ESLint
npm run build     # Build de producción
npm run audit     # Consistencia del código (bloquea as never / require())
npm run check:env # Entorno contra el contrato tipado
npm run check:contracts  # Adopción del route-guard único (46 migradas)
npm run quality   # Todo en cadena (audit + env + contracts + lint + types + test)
```

Cobertura por dominio:

| Archivo | Cubre |
|---|---|
| `tests/twins.test.ts` | Store, grafo, queries del gemelo digital |
| `tests/city.test.ts` | Scorecard, ranking/triage, emergencias, políticas RBAC |
| `tests/assets.test.ts` | Salud, falla, mantenimiento, órdenes, APM Score |
| `tests/grid.test.ts` | Balance eléctrico/hídrico, alertas |
| `tests/marketplace.test.ts` | Ofertas, licencias, búsqueda |
| `tests/trust.test.ts` | Capa de confianza |
| `tests/anti-cheat.test.ts` | Gamificación server-authoritative |
| `tests/points-engine.test.ts` | Motor de puntos |
| `tests/auth-tokens.test.ts` | Tokens de autenticación |
| `tests/dead-man-switch.test.ts` | Interruptor de emergencia |
| `tests/gateway-policy.test.ts` | Políticas del gateway |
| `tests/rules.test.ts` | Reglas del dominio |
| `tests/monitoring.test.ts` | Métricas, trazas, eventos, alertas, monitor |
| `tests/resilience.test.ts` | Reintentos, circuit breaker, bulkhead |
| `tests/zero-trust.test.ts` | Cadena de 7 capas + key vault |
| `tests/isa-core.test.ts` | Núcleo soberano ISA (sin dependencias externas) |
| `tests/features.test.ts` | Notificaciones, mensajería, geolocalización |
| `tests/governance.test.ts` | Contratos de API y políticas de despliegue |
| `tests/system.test.ts` | Caché TTL y planos lazy |
| `tests/events.test.ts` | Bus YUN unificado (envelope, DLQ, traza) |
| `tests/contracts.test.ts` | Contratos zod de las rutas |
| `tests/env.test.ts` | Contrato tipado del entorno |
| `tests/bus-bridges.test.ts` | Puentes city/monitor ↔ bus YUN (anti-lazo) |
| `tests/gamification-visual.test.ts` | Calidad adaptativa (FPS) y motor de partículas con pool |
| `tests/observability.test.ts` | SLO/presupuestos, métricas RED exactas, grafo causal, puente al bus |
| `tests/payments.test.ts` | Idempotencia de pagos, secretos de comercio, anti-IDOR en retiros |
| `tests/guardian.test.ts` | Guardian Kernel: deny-by-default, idempotencia, escalación |

## Documentación Técnica

| Documento | Contenido |
|---|---|
| `docs/adr-0001-isa-soberano.md` | Núcleo soberano ISA (fin de la dependencia de Gemini) |
| `docs/adr-0002-zero-trust-7-capas.md` | Cadena Zero Trust de 7 capas |
| `docs/adr-0003-observabilidad.md` | Monitor General del Nodo Cero |
| `docs/c4-contexto.md` | Diagrama C4 de contexto, contenedores y componentes |
| `docs/catalogo-apis.md` | 10 contratos de API (semver + ciclo de vida) |
| `docs/mapa-dominios.md` | Dominios ↔ código ↔ federación YUN |
| `docs/guia-desarrollador.md` | Convenciones, cómo añadir dominios/APIs, resiliencia y caché |
| `docs/guia-modularizacion.md` | Modularización por fases: núcleo transversal, route-guard, contratos |

---

## Base de Datos (Supabase/Postgres)

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

## Avance Real hacia Producción

| Hito | Estado |
|---|---|
| Build de producción (`next build`) | ✅ Exitoso (0 errores TS) |
| Typecheck (`tsc --noEmit`) | ✅ Limpio |
| Lint (`eslint .`) | ✅ 0 problemas |
| Tests (`vitest`) | ✅ 238/238 (27 archivos) |
| Datos del territorio (POIs, nodos, turismo) | ✅ 15 POIs · 35 nodos · 8 eventos · 5 rutas |
| Gemelo Digital (Twins) | ✅ DTDL · NGSI · grafo · simulación |
| IOC Urbano | ✅ Incidentes · playbooks · scorecard · RBAC |
| EAM/APM | ✅ Salud · falla · mantenimiento · APM Score |
| Smart Grid/Agua | ✅ Balance · topología · alertas |
| Marketplace | ✅ Ofertas · licencias · suscripción |
| Zero Trust en APIs | ✅ Origin · rate limit · fail-closed · route-guard único (46) |
| Bus YUN unificado | ✅ Envelope + traceId/correlationId · anti-lazo |
| Visual de gamificación | ✅ Calidad adaptativa · FX con pool · arena cinematográfica |
| Fabric cognitivo YUN | ✅ Observabilidad (SLO/RED/grafo) · Guardian Kernel · `/api/observability/status` |
| Supabase/Postgres | ✅ Migraciones 001 y 002 con RLS |
| **Pendiente** | Setear `GEMINI_API_KEY`, `APP_URL`, `MEXA_OPERATOR_KEY` y `GAMIFICATION_HMAC_SECRET` en Vercel Secrets · Desplegar en Vercel · Conectar servicios Supabase a las APIs |

---

## Despliegue en Vercel

1. Importa el repositorio en [Vercel](https://vercel.com/new).
2. El `vercel.json` ya define: `npm install --legacy-peer-deps`, build `next build` y región `iad1`.
3. En **Project Settings → Environment Variables** añade:
   - `GEMINI_API_KEY` (clave de Google AI Studio)
   - `APP_URL` (URL del deployment)
   - `NEXT_PUBLIC_SITE_URL` (URL pública para SEO)
   - `MEXA_OPERATOR_KEY` (secreto del operador para `/api/isabella/crypto/sign`)
   - `GAMIFICATION_HMAC_SECRET` (secreto para firmar puntos de zombies)
4. Deploy. Verifica que `metadataBase` use la URL de producción.

---

## Variables de Entorno

Copia `.env.example` a `.env.local`:

```bash
# Google AI Studio — clave de Gemini (Isabella Villaseñor AI)
GEMINI_API_KEY=AIza...

# URL canónica de la app
APP_URL=https://rdm-digital-hub.vercel.app

# URL pública para SEO / Open Graph
NEXT_PUBLIC_SITE_URL=https://rdm-digital-hub.vercel.app

# Secreto del operador para la Mexa API (firmas MSR) — /api/isabella/crypto/sign
MEXA_OPERATOR_KEY=clave-soberana-del-nodo-cero

# Secreto HMAC para el motor de gamificación server-authoritative
GAMIFICATION_HMAC_SECRET=secreto-del-juego
```

> Sin `GEMINI_API_KEY`, Isabella opera en **modo simulación local seguro** (no falla, responde con datos del territorio).

---

## Scripts

```bash
npm install --legacy-peer-deps   # Instalar dependencias
npm run dev                      # Desarrollo (http://localhost:3000)
npm run build                    # Build de producción
npm run start                    # Servir el build
npm run lint                     # ESLint
npm test                         # Vitest (238 tests)
npm run audit                    # Consistencia del código
npm run check:env                # Entorno contra el contrato
npm run check:contracts          # Adopción del route-guard
npm run quality                  # Todo en cadena
npx tsc --noEmit                 # Typecheck
```

---

## Licenciamiento

**© 2026 Edwin Oswaldo Castillo Trejo (Anubis Villaseñor) — RDM Digital Hub.**

Todos los derechos reservados sobre la identidad, la marca "RDM Digital Hub", la arquitectura **Heptafederada YUN**, el personaje **Isabella Villaseñor AI** y los datos turísticos/históricos curados del territorio de Real del Monte.

- El código fuente de este repositorio se distribuye para **uso privado y de demostración**.
- Se requiere **autorización expresa del autor** para uso comercial, despliegue público masivo o redistribución.
- Las fotografías en `public/images/` provienen de los repositorios públicos de la plataforma RDM Digital y se usan con fines de integración de la plataforma.
- La Comarca Minera es un **Geoparque Mundial UNESCO** (2017): el uso de la imagen territorial debe respetar el patrimonio cultural.

Para colaboraciones, licencias o despliegues oficiales, contactar al autor a través del repositorio.

---

*Construido con Next.js, Three.js, Leaflet, Recharts, Vitest y la Heptafederación YUN.*
*Real del Monte, Hidalgo — Cuna de la Minería Mexicana.*

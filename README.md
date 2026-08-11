# RDM Digital Hub — Nodo Cero

**Sistema de Inteligencia Territorial Soberano para Real del Monte, Hidalgo, México.**

Plataforma digital integral (**phygital**) del **RDM Digital Hub — Nodo Cero**: gemelo territorial / smart city, centro de operaciones urbano (IOC), gestión de activos y mantenimiento (EAM/APM), redes inteligentes de energía y agua, marketplace soberano, telemetría IoT, criptografía post-cuántica, gamificación con arena 3D (Unity WebGL) y la asistencia cognitiva de **Isabella Villaseñor AI** — todo sobre la **Arquitectura Heptafederada YUN** de 7 núcleos.

> Real del Monte, "Cuna de la Minería Mexicana", es Pueblo Mágico de Hidalgo y parte del **Geoparque Mundial UNESCO de la Comarca Minera** (2017).

---

## Índice

1. [¿Qué es?](#qué-es)
2. [Experiencia de Usuario](#experiencia-de-usuario)
3. [Dominios de la Plataforma](#dominios-de-la-plataforma)
4. [Stack Tecnológico](#stack-tecnológico)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Rutas API](#rutas-api)
7. [Gamificación: Web 2D y Arena 3D Unity](#gamificación-web-2d-y-arena-3d-unity)
8. [Pruebas Automatizadas](#pruebas-automatizadas)
9. [Estado Actual](#estado-actual)
10. [Scripts](#scripts)
11. [Variables de Entorno](#variables-de-entorno)
12. [Despliegue en Vercel](#despliegue-en-vercel)
13. [Base de Datos](#base-de-datos)
14. [Documentación Técnica](#documentación-técnica)
15. [Licenciamiento](#licenciamiento)

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
- **Isabella Villaseñor AI**: asistente cognitivo del territorio con núcleo soberano ISA y bóveda nativa de IAs open source (cero dependencia de proveedores propietarios).
- **Identidad soberana (IDENTITY YUN)**: el Nodo Cero emite y gestiona sus propias API keys nativas (scrypt + scopes), sin proveedor de identidad externo.
- **Malla federada autopoiética (CITEMESH)**: registro de nodos P2P, topologías de celda F1-F3 y ruteo de paquetes firmados con degradación por failover.
- **Grafo de conocimiento federado (GEMET)**: registros ontológicos distribuidos con checksum sha256 canónico, réplicas remotas y caché firmada.
- **Continuidad del negocio**: journal inmutable con hash-chain, reconciliación primario/réplica y matriz RTO/RPO.
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

## Experiencia de Usuario

La renovación visual y de navegación organiza todo el ecosistema en **cuatro planos institucionales** — nada se elimina, cada destino histórico vive dentro de un plano:

| Plano | Nombre | Contenido |
|---|---|---|
| **I** | Descubre | Turismo, cultura y patrimonio |
| **II** | Comercia | Negocios, pagos y suscripciones |
| **III** | Personaliza | Comunidad, cuenta y gamificación |
| **IV** | Gobierna | Gemelo digital y Smart City |

### Navegación superior — "Explorar"

En la navbar superior derecha, el botón **Explorar** abre un panel cristal con el **mapa del ecosistema**: las 4 columnas de los planos en acordeón (se expande automáticamente el plano activo), con navegación directa a cada sección, buscador de los **35 nodos YUN** y el acordeón de los **7 núcleos heptafederados**. Se cierra al hacer clic fuera, con `Escape` o al navegar.

### Navbar izquierda contextual retráctil

A la izquierda flota una barra de contexto **inteligente por sección**: colapsada muestra el número del plano activo y accesos rápidos; expandida revela la descripción de la sección, atajos "Ir a…", el mini-acordeón del plano activo y la acción **Preguntar a Isabella AI**. El contenido principal ajusta su ancho según el estado de la barra.

### Secciones con identidad visual

- **Historia y Cultura · Dossier** (`heritage`): expediente integral del Pueblo Mágico en 12 capítulos ilustrados — identidad y Magotsi, minería novohispana y Veta Vizcaína, huelga de 1766, migración cornish 1824, Panteón Inglés, el paste, el fútbol, platería, festividades, leyendas, ecoturismo e itinerario de 3 días — con línea histórica, datos rápidos (altitud, clima, ecosistema) y sello final, cada recuadro con imagen.
- **Música y Podcast**: el podcast oficial **Ecos de Real del Monte** (Spotify, `033VQlzxActi39WO45lHwM`) está integrado en la sección de música, visible tanto en la pestaña *Música Local* como en *Podcast RDM*, junto a bandas de viento, corridos y jazz de la niebla.
- **Mitos y leyendas**: carrusel de relatos con imágenes y los dichos mineros ahora ilustrados con fotografía representativa.
- Todas las secciones (turismo, gastronomía, arte, galería, archivo, patrimonio) presentan tarjetas con imágenes — sin recuadros de texto plano.

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
| **Identity (YUN)** | Registro soberano de API keys nativas: creación, rotación, revocación e introspección | `lib/security/identity/`, `app/api/identity/*` |
| **CITEMESH** | Malla federada autopoiética: registro de nodos P2P, heartbeat y ruteo con failover | `lib/citemesh/`, `app/api/citemesh/*` |
| **GEMET** | Grafo de conocimiento federado: registros ontológicos con checksum y réplicas | `lib/gemet/`, `app/api/gemet/*` |
| **Continuity** | Continuidad del negocio: journal, reconciliación, aislamiento y activación | `lib/continuity/`, `app/api/continuity/*` |
| **Archive** | Archivo histórico: ítems, colecciones, búsqueda, curación y administración | `lib/archive/`, `app/api/archive/*` |
| **Turismo** | Lugares, eventos, rutas y cultura de Real del Monte | `app/api/turismo/*` |
| **YUN QSC** | Sobre semántico híbrido: sellado, firma, federaciones y ready | `lib/yun/`, `app/api/yun/*` |

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
- **Bóveda nativa de IAs open source** (CROWN): Llama 3, Qwen, DeepSeek, Mistral, Phi y Cerebras sobre transportes soberanos (OpenRouter, Groq, Cloudflare Workers AI, Ollama local) — cero dependencia de proveedores propietarios. La bóveda registra además agentes de ingeniería del Nodo (kind `agent`, sin egress), como el copiloto `opencode`, que no participan en cadenas de inferencia

**Identidad y malla federada**
- **IDENTITY YUN**: registro soberano de API keys nativas (`lib/security/identity/`); claves con prefijo `rdm_live_`, almacenadas como hash scrypt, con scopes explícitos (turismo, archivo, gemelos, ciudad, gamificación, mercado, pagos, citemesh, gemet, monitor, admin) y ciclo de vida completo (crear/rotar/revocar/introspeccionar)
- **CITEMESH**: malla federada autopoiética (`lib/citemesh/`) — registro de nodos P2P con credencial derivada de la `p2pPublicKey`, topologías de celda F1-F3, poder de gobernanza (LOGICAL/EXECUTIVE/OBSERVER/HUMAN), nivel HRO (Q0-Q3) y ruteo de paquetes firmados con failover
- **GEMET**: grafo de conocimiento federado (`lib/gemet/`) — registros ontológicos con checksum sha256 canónico, réplicas remotas y caché firmada (detecta manipulaciones)

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
  page.tsx              # Home: vistas de experiencia (plano I-IV) por activeView
components/           # Componentes React (incl. gamificación 2D/3D)
  layout/YUNLayout.tsx  # Navegación: navbar "Explorar" (4 planos) + navbar contextual
  heritage/             # Dossier de Historia y Cultura (12 capítulos con imagen)
  media/                # Música y podcast (Ecos de Real del Monte)
  legends/              # Mitos, leyendas y dichos mineros ilustrados
hooks/                # Hooks (use-unity-webgl, etc.)
lib/                  # Lógica de dominio y núcleo transversal
  core/                 # Núcleo: env, events, contracts, utils, persistence
  security/             # trust, zero-trust, keys, tokens, identity (API keys)
  citemesh/             # Malla federada autopoiética (nodos P2P + failover)
  gemet/                # Grafo de conocimiento federado (checksum + réplicas)
  continuity/           # Hash-chain, journal, lease-manager y reconciliación
  archive/              # Archivo histórico con checksums canónicos
  yun/                  # Sobre semántico híbrido (sellado, firma, federaciones)
  <dominio>/            # stacks de dominio (isabella, city, twins, grid, gamification, ...)
unity/                # Proyecto Unity (Arena 3D) — no empaquetado en web
  Assets/               # Scripts, Plugins/WebGL, WebGLTemplates/RDM, Editor
  Packages/             # manifest.json
  ProjectSettings/      # ProjectVersion.txt (2022.3.62f1)
public/               # Assets estáticos, incl. build WebGL en public/unity/RDMArena/
scripts/              # Automatización (audit, check:env, check:contracts)
supabase/migrations/  # Migraciones Postgres con RLS
tests/                # Pruebas de Vitest por dominio (42 archivos)
docs/                 # ADRs, guías, C4, catálogo de APIs, mapa de dominios
```

**Núcleo transversal**: `lib/core/` (env tipado con zod, eventos, contratos, utils). La trust canónica vive en `lib/security/trust.ts`; `lib/isabella/trust.ts` es un barril de compatibilidad (no añadir lógica nueva allí). La identidad soberana vive en `lib/security/identity/`.

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

### Identity (`/api/identity/*`)
| Ruta | Propósito |
|---|---|
| `POST /api/identity/keys` | Emisión de una API key nativa (scope `admin:keys`) |
| `GET /api/identity/keys` | Listado de claves (solo metadatos) |
| `PATCH /api/identity/keys/[id]` | Rotación de una clave |
| `DELETE /api/identity/keys/[id]` | Revocación inmediata |
| `POST /api/identity/introspect` | Autenticación e introspección de una clave |

### CITEMESH (`/api/citemesh/*`)
| Ruta | Propósito |
|---|---|
| `POST /api/citemesh/nodes` | Registro de un nodo P2P (scope `citemesh:write`) |
| `GET /api/citemesh/nodes` | Nodos registrados en la malla |
| `POST /api/citemesh/route` | Enrutado de un paquete firmado con failover |
| `GET /api/citemesh/health` | Salud de la malla federada |

### GEMET (`/api/gemet/*`)
| Ruta | Propósito |
|---|---|
| `POST /api/gemet/nodes` | Registro de un nodo de conocimiento (checksum verificado) |
| `GET /api/gemet/nodes` | Registros indexados en el grafo |
| `POST /api/gemet/query` | Consulta federada (local → réplica → caché firmada) |
| `PUT /api/gemet/query` | Alta de una réplica remota del grafo |
| `GET /api/gemet/health` | Salud del grafo de conocimiento |

### Continuity (`/api/continuity/*`)
| Ruta | Propósito |
|---|---|
| `POST /api/continuity/journal` | Registro inmutable en el journal |
| `GET /api/continuity/status` | Estado del plan de continuidad |
| `POST /api/continuity/reconcile` | Reconciliación primario/réplica |
| `POST /api/continuity/isolate-primary` | Aislamiento del primario |
| `POST /api/continuity/activate` | Activación del plan de continuidad |

### Archive (`/api/archive/*`)
| Ruta | Propósito |
|---|---|
| `GET /api/archive/items` | Ítems del archivo histórico |
| `GET /api/archive/items/[id]` | Detalle de un ítem |
| `GET /api/archive/items/[id]/download` | Descarga de un objeto |
| `GET /api/archive/collections` | Colecciones |
| `GET /api/archive/search` | Búsqueda con verificación de checksum |
| `POST /api/archive/demo-upload` / `demo-file` | Uploads de demostración |
| `GET/POST /api/archive/admin/*` | Curación: aprobar, publicar, retirar, auditar, subir archivos |

### Turismo (`/api/turismo/*`)
| Ruta | Propósito |
|---|---|
| `GET /api/turismo/places` | Lugares de interés |
| `GET /api/turismo/places/[id]` | Detalle de un lugar |
| `GET /api/turismo/events` | Agenda de eventos |
| `GET /api/turismo/routes` | Rutas turísticas |
| `GET /api/turismo/cultura` | Patrimonio cultural |

### YUN QSC (`/api/yun/*`)
| Ruta | Propósito |
|---|---|
| `POST /api/yun/envelope/create` | Creación de sobre semántico |
| `POST /api/yun/envelope/seal` | Sellado con cifrado y firma híbrida |
| `POST /api/yun/envelope/verify` | Verificación de integridad y firma |
| `GET /api/yun/federations/health` | Salud de la heptafederación Fed1..Fed7 |
| `GET /api/yun/ready` | Prontitud operativa del QSC |
| `GET /api/yun/status` | Estado del núcleo |

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
| `POST /api/intentions` | Registro de intenciones |

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

Suite **Vitest** en `tests/` (42 archivos). Cobertura por dominio:

| Archivo | Cubre |
|---|---|
| `anti-cheat`, `points-engine`, `gamification-visual`, `gamification-territory`, `zombie-visual-render` | Motor de gamificación y arena |
| `assets`, `city`, `grid`, `twins`, `marketplace`, `payments`, `tourism` | Dominios territoriales |
| `isabella` (`isa-core`, `isa-ai`, `bus-bridges`, `dead-man-switch`, `gateway-policy`, `engine`, `rules`) | Núcleo cognitivo y CROWN |
| `trust`, `zero-trust`, `auth-tokens`, `hardening`, `identity`, `origin-policy` | Seguridad, Zero Trust e IDENTITY YUN |
| `citemesh` | Malla federada: registro, credenciales, ruteo con failover |
| `gemet` | Grafo de conocimiento: checksum, réplicas, caché firmada |
| `events`, `contracts`, `env`, `system`, `features`, `governance`, `monitoring`, `observability`, `resilience`, `continuity`, `neon-budget`, `guardian` | Núcleo transversal y operación |

---

## Estado Actual

| Hito | Estado |
|---|---|
| Typecheck (`tsc --noEmit`) | ✅ Limpio |
| Lint (`eslint .`) | ✅ 0 problemas |
| Tests (`vitest`) | ✅ 42 archivos |
| Auditor de consistencia (`npm run audit`) | ✅ 0 errores |
| Build de producción (`next build`) | ✅ Exitoso |
| Contrato de entorno (`check:env`) | ✅ OK |
| Adopción del route-guard (`check:contracts`) | ✅ OK (83 rutas migradas, 0 pendientes) |
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
| IDENTITY YUN | ✅ API keys nativas (scrypt, scopes, rotación/revocación/introspección) |
| CITEMESH | ✅ Contratos · orquestador P2P · ruteo con failover · 4 rutas API |
| GEMET | ✅ Contratos · checksum canónico · réplicas · caché firmada · 5 rutas API |
| Continuity | ✅ Journal · reconciliación · aislamiento · activación |
| Archive | ✅ Ítems · checksums canónicos · curación · admin |
| YUN QSC | ✅ Sobre semántico híbrido · firma post-cuántica (ML-DSA simulado en tests) |
| **Experiencia de usuario** | ✅ Navegación por 4 planos · navbar contextual · dossier Heritage · podcast en música · imágenes en recuadros |

---

## Scripts

```bash
npm install --legacy-peer-deps   # Instalar dependencias
npm run dev                      # Desarrollo (http://localhost:3000)
npm run build                    # Build de producción
npm run start                    # Servir el build
npm run lint                     # ESLint
npm test                         # Vitest
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
| `GROQ_API_KEY` | Bóveda OSS: Llama 3.3 70B (Groq LPU) |
| `OPENROUTER_API_KEY` | Bóveda OSS: Qwen 2.5 72B / DeepSeek V3 |
| `CEREBRAS_API_KEY` | Bóveda OSS: Llama 3.3 70B (Cerebras) |
| `MISTRAL_API_KEY` | Bóveda OSS: Mistral Nemo |
| `CLOUDFLARE_AI_KEY` / `CLOUDFLARE_AI_ACCOUNT_ID` | Bóveda OSS: Phi-3.5 Mini (Workers AI) |
| `OPENCODE_ZEN_API_KEY` | Bóveda OSS: OpenCode Zen (Big Pickle / DeepSeek V4) |
| `OLLAMA_BASE_URL` | Bóveda OSS local (zona roja, cero egress) |
| `APP_URL` | URL canónica de la app |
| `NEXT_PUBLIC_SITE_URL` | URL pública para SEO / Open Graph |
| `ISA_API_KEY` | Clave del núcleo soberano ISA (rotables `_V2`/`_V3`) |
| `MEXA_API_KEY` / `MEXA_OPERATOR_KEY` | Claves de la Mexa API y del operador (firmas MSR) |
| `GAMIFICATION_API_KEY` / `GAMIFICATION_HMAC_SECRET` | Claves del motor de gamificación server-authoritative |
| `MONITOR_API_KEY`, `CROWN_API_KEY`, `CROWN_EMERGENCY_*` | Monitoreo y emergencia CROWN |
| `POSTGRES_URL` / `POSTGRES_PRISMA_URL` | Postgres primario (Supabase o Neon pooled) |
| `NEON_DATABASE_URL` / `DATABASE_URL_UNPOOLED` | Postgres réplica (Neon) / URL directa |
| `PGHOST` / `PGHOST_UNPOOLED` / `PGUSER` / `POSTGRES_PASSWORD` | Componentes de conexión Neon (integración Vercel) |
| `NEON_CU_HOURS_LIMIT` / `NEON_PING_COOLDOWN_MS` | Presupuesto del plan Free de Neon (cómputo mensual + cooldown de pings) |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Redis (Upstash) |

> Sin claves de la bóveda, Isabella opera en **modo simulación local soberano** (SOPHIA, sin egress: no falla, responde con datos del territorio).

### API keys nativas (IDENTITY YUN)

Las credenciales de acceso al Nodo Cero se emiten de forma soberana vía `POST /api/identity/keys` (scope `admin:keys`). Cada clave:

- Se genera con prefijo `rdm_live_` y se almacena SIEMPRE como hash **scrypt** — jamás en claro.
- Porta scopes explícitos (`turismo:read/write`, `archivo:read/write`, `gemelos:read/write`, `ciudad:read/write`, `gamificacion:read/write`, `mercado:read/write`, `pagos:read/write`, `citemesh:read/write`, `gemet:read/write`, `yun:read/write`, `hepta:read/write`, `isa:read/write`, `mexa:sign/verify`, `isabella:chat/gateway`, `monitor:read`, `admin:keys`, `admin:all`).
- Se presenta vía cabecera `x-rdm-api-key` y el route-guard la autentica y comprueba scopes antes de ejecutar el handler.

**Bootstrap de la primera clave admin:** define `RDM_ADMIN_API_KEY` en el entorno; si el registro de identidad está vacío, se da de alta como clave `admin:keys` + `admin:all` en el arranque (idempotente). A partir de ahí emite el resto de claves por dominio con `POST /api/identity/keys`.

---

## Despliegue en Vercel

1. Importa el repositorio en [Vercel](https://vercel.com/new).
2. `vercel.json` ya define `npm install --legacy-peer-deps`, build `next build` y región `iad1`.
3. En **Project Settings → Environment Variables** añade: `APP_URL=https://visitarealdelmonte.online`, `NEXT_PUBLIC_SITE_URL=https://visitarealdelmonte.online`, `MEXA_OPERATOR_KEY`, `GAMIFICATION_HMAC_SECRET` (y las de la bóveda OSS que quieras activar).
4. Conecta el dominio `visitarealdelmonte.online` (apex) y `www.visitarealdelmonte.online`.
5. Deploy. El apex es el dominio canónico: `www` responde **308 (permanent redirect)** al apex vía `next.config.ts`, y `metadataBase` usa `https://visitarealdelmonte.online`.

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

### Neon (plan Free)

La integración de Neon en Vercel inyecta las variables `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `POSTGRES_PRISMA_URL`, `PGHOST`, `PGHOST_UNPOOLED`, `PGUSER`, `POSTGRES_PASSWORD`, `VITE_NEON_AUTH_URL` y `NEON_AUTH_BASE_URL`. El resolver de `lib/core/persistence/postgres.ts` prefiere URL completa pooled, luego unpooled, y reconstruye desde componentes si hace falta.

El plan Free de Neon otorga **100 CU-hours/mes** de cómputo, **0.5 GB** de almacenamiento y **5 GB** de egress, con scale-to-zero a los 5 min de inactividad. Para no agotarlo:

- `NEON_CU_HOURS_LIMIT` (default `100`): presupuesto mensual; `isNeonBudgetExhausted()` degrada la capa durable a modo demo antes de cortar el servicio.
- `NEON_PING_COOLDOWN_MS` (default `300000`): espacia los pings de salud a ≥5 min para no mantener la computa despierta.
- El pool se mantiene pequeño (`max: 2` en Neon) porque la computa free acepta ~104 conexiones.

---

## Documentación Técnica

| Documento | Contenido |
|---|---|
| `docs/adr-0001-isa-soberano.md` | Núcleo soberano ISA (cero dependencia de proveedores externos) |
| `docs/adr-0002-zero-trust-7-capas.md` | Cadena Zero Trust de 7 capas |
| `docs/adr-0003-observabilidad.md` | Monitor General del Nodo Cero |
| `docs/adr-0004-yun-be-continuidad.md` | Continuidad del negocio (journal, RTO/RPO, reconciliación) |
| `docs/adr-0005-yun-quantum-semantic-core.md` | Sobre semántico híbrido YUN (cifrado + firma post-cuántica) |
| `docs/c4-contexto.md` | Diagrama C4 de contexto, contenedores y componentes |
| `docs/catalogo-apis.md` | Contratos de API (semver + ciclo de vida) |
| `docs/mapa-dominios.md` | Dominios ↔ código ↔ federación YUN |
| `docs/guia-desarrollador.md` | Convenciones, cómo añadir dominios/APIs, resiliencia y caché |
| `docs/guia-modularizacion.md` | Modularización: núcleo transversal, route-guard, contratos |
| `docs/continuity-plan.md` | Plan de continuidad del negocio |
| `docs/reconciliation-protocol.md` | Protocolo de reconciliación primario/réplica |
| `docs/rto-rpo-matrix.md` | Matriz RTO/RPO por dominio |
| `docs/emergency-runbook.md` | Runbook de emergencias |
| `docs/openapi-yun.yaml` | Contrato OpenAPI del fabric YUN |
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

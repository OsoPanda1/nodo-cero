# RDM Digital Hub — Nodo Cero

**Sistema de Inteligencia Territorial Soberano para Real del Monte, Hidalgo, México.**

Plataforma digital integral (Phygital) del **RDM Digital Hub — Nodo Cero**: una convergencia de gemelo digital 2D/3D, cartografía interactiva, economía de la plata y el paste, telemetría IoT, criptografía post-cuántica y la asistencia cognitiva de **Isabella Villaseñor AI**, todo sobre la **Arquitectura Heptafederada YUN** de 7 núcleos.

> Real del Monte, conocido como **"Cuna de la Minería Mexicana"**, es Pueblo Mágico de Hidalgo y parte del **Geoparque Mundial UNESCO de la Comarca Minera** (2017).

---

## Índice

1. [¿Qué es?](#qué-es)
2. [¿Qué hace?](#qué-hace)
3. [¿Cómo lo hace?](#cómo-lo-hace)
4. [Arquitectura Heptafederada YUN](#arquitectura-heptafederada-yun)
5. [Stack Tecnológico](#stack-tecnológico)
6. [Estructura del Proyecto](#estructura-del-proyecto)
7. [Implementaciones](#implementaciones)
8. [Mejoras Realizadas](#mejoras-realizadas)
9. [Avance Real hacia Producción](#avance-real-hacia-producción)
10. [Despliegue en Vercel](#despliegue-en-vercel)
11. [Variables de Entorno](#variables-de-entorno)
12. [Scripts](#scripts)
13. [Licenciamiento](#licenciamiento)

---

## ¿Qué es?

**RDM Digital Hub — Nodo Cero** es el **Sistema Operativo Territorial** (TOS, por sus siglas en inglés) de Real del Monte. Trata al pueblo como una *plataforma inteligente viva*: unifica su patrimonio histórico-minero, su vida cultural, su economía local (pastes y platería) y su geografía con tecnología de punta:

- **Gemelo digital** del territorio y sus 15 puntos de interés principales.
- **7 núcleos soberanos** (35 nodos operativos) de arquitectura descentralizada.
- **Isabella Villaseñor AI**: asistente cognitivo del territorio basado en Google Gemini.
- **Criptografía post-cuántica** (NIST): CRYSTALS-Dilithium-5, CRYSTALS-Kyber-1024 y Falcon-1024.

Es el **Nodo Cero** de una red metropolitana más amplia: la **Heptafederación YUN** que conecta los municipios de la Comarca Minera (Real del Monte, Pachuca, Mineral del Chico, Huasca, Omitlán).

### Identidad

| Campo | Valor |
|---|---|
| **Nombre** | RDM Digital Hub — Nodo Cero |
| **Alias** | Sistema de Inteligencia Territorial Soberano |
| **Ubicación** | Real del Monte, Hidalgo, México (20.1398° N, 98.6738° O, 2,710 m s. n. m.) |
| **Autor** | Edwin Oswaldo Castillo Trejo (Anubis Villaseñor) |
| **IA Asistente** | Isabella Villaseñor AI |
| **Arquitectura** | Heptafederación YUN (7 núcleos) |
| **Sector** | Turismo, gobernanza, patrimonio cultural, economía phygital |

---

## ¿Qué hace?

### 1. Portal "Trailer AAA" e identidad visual
Hero en **WebGL (Three.js)** con cristal holográfico central, 7 satélites orbitando (los 7 núcleos YUN), partículas flotantes y modal de trailer cinematográfico 4K simulado.

### 2. Turismo y Eventos (nueva sección)
- **8 eventos/festivales** reales del calendario local (Feria del Paste en octubre, Semana de los Mineros de Cornualles en marzo, Fiestas de la Asunción en agosto, Festival de la Primera Huelga de América en julio, Día de Muertos en el Panteón Inglés, Trail de Peñas Cargadas, Calendas de Mayo, Navidad).
- **5 rutas turísticas** con paradas georreferenciadas (Ruta de la Plata, Ruta del Legado Inglés, Ruta del Paste, Ruta de los Miradores, Ruta de la Fe).
- **5 dichos populares** del pueblo con su significado y origen.
- **Línea de tiempo histórica** de 1554 a 2026 (fundación, Conde de Regla, huelga de 1766, llegada cornish 1824, Panteón Inglés 1851, Geoparque UNESCO 2017).
- **10 comercios** destacados (pasteadoras, platerías, cafés, panaderías, hospedajes).

### 3. Gemelo Digital 2D/3D
Mapa interactivo **Leaflet** con estética *dark matter* (CARTO), 15 POIs geolocalizados con iconografía por categoría, filtros, trazado de ruta minera phygital y panel de telemetría flotante.

### 4. Marketplace Phygital
Comercio soberano simulado de pastes y platería ley .925, con carrito, precios en MXN, **sello QR de autenticidad** e insignias criptográficas.

### 5. Telemetría y Sensores
Panel con gráficas **Recharts** (aforo turístico, tráfico vehicular, humedad de la niebla) y **grid de salud de 12 sensores IoT** distribuidos en el territorio.

### 6. Criptografía Post-Cuántica
Explorador de bloques Ledger, rotación de llaves simulada, medidores de blindaje y tarjetas de los estándares NIST.

### 7. Isabella Villaseñor AI
Chat con **Google Gemini 2.5 Flash** (con fallback a modo simulación local seguro), presets de consulta rápida y conocimiento profundo del territorio: historia, gastronomía, rutas y eventos.

### 8. Explorador de Nodos YUN
Los **35 nodos** organizados por núcleo, con búsqueda, vista de detalle con métricas en vivo, medidores de señal, prueba de endpoint y consulta directa a Isabella.

---

## ¿Cómo lo hace?

### Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Framework** | Next.js 15 (App Router, React 19, TypeScript 5.9) |
| **Estilos** | Tailwind CSS 4 + CSS custom (glass panels, glows, shimmer) |
| **3D / WebGL** | Three.js + @react-three/fiber (transpilado) |
| **Mapas** | Leaflet + tiles CARTO dark |
| **Gráficas** | Recharts |
| **Animación** | Motion |
| **Iconos** | Lucide React |
| **IA** | @google/genai (Gemini 2.5 Flash) |
| **Lenguaje** | Español (es-MX) |

### Flujo de datos

```
Cliente (React SPA)
   │
   ├── /api/isabella ─────────────► GoogleGenAI (Gemini 2.5 Flash)
   │        └─ fallback local ─────► Modo simulación seguro (sin API key)
   │
   ├── lib/data/rdm-data.ts ─────── 15 POIs · 7 núcleos · 35 nodos YUN
   ├── lib/data/rdm-tourism.ts ──── 8 eventos · 5 rutas · 5 dichos · 9 hitos · 10 comercios
   └── public/images/*.jpg ──────── 37 fotografías reales del territorio
```

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

## Estructura del Proyecto

```
vvvvvvv-main/
├── app/
│   ├── api/isabella/route.ts       # API de Isabella AI (Gemini + fallback)
│   ├── globals.css                 # Tailwind + utilidades glass/glow/animaciones
│   ├── layout.tsx                  # Metadata SEO completa, lang="es"
│   └── page.tsx                    # SPA: todas las vistas del Hub
├── components/
│   ├── 3d/CrystalHero3D.tsx        # Hero WebGL con cristal y trailer modal
│   ├── isabella/IsabellaChat.tsx   # Chat con presets y contexto territorial
│   ├── layout/YUNLayout.tsx        # Shell: navbar + sidebar de 7 núcleos
│   ├── map/DigitalTwinMap.tsx      # Mapa Leaflet dark, 15 POIs, rutas
│   ├── nodes/NodeDetailView.tsx    # Detalle de nodo con medidores y ping
│   ├── phygital/PhygitalMarketplace.tsx  # Marketplace pastes & plata
│   ├── security/PostQuantumSecurity.tsx  # Ledger PQC + blindaje
│   ├── telemetry/TelemetryDashboard.tsx  # Recharts + grid de sensores
│   └── tourism/TourismSection.tsx  # Eventos, rutas, dichos, timeline
├── lib/data/
│   ├── rdm-data.ts                 # POIs, YUN_CORES, RDM_NODES_35
│   └── rdm-tourism.ts              # Eventos, rutas, dichos, historia, comercios
├── public/images/                  # 37 fotografías reales de Real del Monte
├── .env.example
├── next.config.ts
└── vercel.json
```

---

## Implementaciones

1. **Datos reales del territorio** — 15 POIs con coordenadas geográficas reales, historia, insignias phygital y sensores. Imágenes locales auténticas (37 fotografías de Real del Monte) en lugar de placeholders.
2. **35 nodos YUN completos** — Antes la lista declaraba 35 pero solo definía 28; hoy los 35 nodos existen, distribuidos en los 7 núcleos.
3. **Sección Turismo** — Nueva vista con pestañas (Eventos / Rutas / Dichos / Historia) con datos documentados del calendario local y la tradición cornish.
4. **Isabella con conocimiento territorial** — System prompt ampliado con rutas, eventos, historia y recomendaciones; presets de consulta turística; contexto del territorio (15 POIs, 35 nodos, geosite UNESCO).
5. **Visualizaciones sofisticadas** — Franja de cifras en el hero, medidores de blindaje cuántico con *shimmer*, retícula cuántica SVG animada, auroras de gradiente en nodos, grid de salud de sensores IoT.
6. **SEO y metadatos** — `lang="es"`, título/template, descripción con keywords, Open Graph (es_MX), Twitter Card, canonical, `themeColor`, robots y `metadataBase`.

---

## Mejoras Realizadas

### Correcciones de bugs
- `RDM_NODES_35` pasó de 28 a **35 nodos** reales.
- **Estado muerto** eliminado (`isPlayingVideo` no utilizado en `CrystalHero3D`).
- **Tecla ESC** ahora cierra el modal del trailer (antes solo se etiquetaba «[ESC]» sin funcionar).
- **Imports sin usar** removidos (`NodeDetailView`: 6 íconos, etc.).
- Contador del hero actualizado de "28/28" a "35/35".
- Coordenadas del **Panteón Inglés** corregidas en el trazado de ruta del mapa.
- **Warning de ESLint** de dependencia en `IsabellaChat` resuelto con ref.

### Optimizaciones
- Imágenes del marketplace migradas de **picsum.photos** a **archivos locales** (`/images/*.jpg`); se limpió el `remotePatterns` obsoleto.
- **`vercel.json`** con `installCommand: npm install --legacy-peer-deps`, headers de seguridad (nosniff, DENY frame, referrer-policy, permissions-policy).
- **`next.config.ts`** saneado (comentario corrupto por encoding corregido, `transpilePackages` para Three).
- **`.env.example`** documentado para Vercel Secrets.
- Build y lint **100% limpios** (0 errores, 0 warnings).

---

## Avance Real hacia Producción

| Hito | Estado |
|---|---|
| Build de producción (`next build`) | ✅ Exitoso (0 errores TS) |
| Lint (`eslint .`) | ✅ 0 problemas |
| Datos del territorio (POIs, nodos, turismo) | ✅ 15 POIs · 35 nodos · 8 eventos · 5 rutas |
| Imágenes reales en el bundle | ✅ 37 fotografías locales |
| SEO / Open Graph / metadatos | ✅ Completos |
| Config de despliegue (`vercel.json`) | ✅ Lista |
| API de Isabella (Gemini) | ✅ Con fallback simulado seguro |
| **Pendiente** | Setear `GEMINI_API_KEY` y `APP_URL` en Vercel Secrets · Desplegar en Vercel · DNS/custom domain · (Opcional) Supabase para persistencia real |

El proyecto está **listo para producción**: la SPA compila como estática, la única ruta dinámica es `/api/isabella` (Edge/serverless, con degradación elegante si no hay API key).

---

## Despliegue en Vercel

1. Importa el repositorio en [Vercel](https://vercel.com/new).
2. El `vercel.json` ya define: `npm install --legacy-peer-deps`, build `next build` y región `iad1`.
3. En **Project Settings → Environment Variables** añade:
   - `GEMINI_API_KEY` (clave de Google AI Studio)
   - `APP_URL` (URL del deployment)
   - `NEXT_PUBLIC_SITE_URL` (URL pública para SEO)
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

*Construido con Next.js, Three.js, Leaflet, Recharts y la Heptafederación YUN.*
*Real del Monte, Hidalgo — Cuna de la Minería Mexicana.*

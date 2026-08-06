# C4 — Diagrama de contexto del RDM Digital Hub (Nodo Cero)

## Nivel 1 · Contexto del sistema

```
            ┌───────────────────────────────────────────────┐
            │           RDM DIGITAL HUB — NODO CERO          │
            │     Gemelo territorial de Real del Monte       │
            └───────────────────────────────────────────────┘
                          ▲            │
        (UI/App)          │            │   (APIs /api/*)
   Turista · Ciudadano    │            ▼
   Operador · Consejo  ───┤   ┌───────────────────────┐
                          │   │   Heptafederación YUN │
                          │   │   7 núcleos · 35 nodos│
                          │   └───────────────────────┘
```

**Actores externos:** turista, ciudadano digital, operador del Nodo, Consejo de la
Comarca, proveedores de IA federados (opcionales), Supabase/Postgres.

## Nivel 2 · Contenedores (dentro del Nodo Cero)

```
┌────────────────────────────────────────────────────────────────────────┐
│ Next.js (App Router)                                                   │
│  ├─ Páginas: /, /twins, /city, /grid, /marketplace, /monitor, /assets  │
│  ├─ Componentes: NotificationCenter, LiveSystems, SystemMonitor, Lazy…  │
│  └─ API routes: /api/{isabella,twins,city,grid,assets,marketplace,      │
│                  gamification,monitor}/*                                │
├─ ISA Core (núcleo soberano offline) + MEXA (firmas MSR)                 │
├─ CROWN Gateway (flota federada opcional, cero egress en zona roja)      │
├─ Dominios: twin-store, city-event-bus, asset-registry, grid-network,    │
│            marketplace-store, gamification/store                        │
├─ Infra transversal: Zero Trust (7 capas), Key Vault, Monitor,           │
│   Resiliencia (retry/CB/bulkhead), Caché TTL, Planos lazy, Gobernanza   │
└────────────────────────────────────────────────────────────────────────┘
```

## Nivel 3 · Componentes transversales

- `lib/security` — zero-trust.ts (7 capas) + keys.ts (vault interno).
- `lib/monitoring` — metrics, tracer, events, alerts, monitor (singleton).
- `lib/resilience` — retry, circuit-breaker, bulkhead, index.
- `lib/isabella` — isa-core (soberano), mexa-api, crown-gateway, http, trust.
- `lib/notifications` + `lib/messaging` + `lib/geo` + `lib/features` — UX realtime.
- `lib/system` — cache TTL + planos lazy.
- `lib/governance` — contratos de API (semver + lifecycle).

## Nivel 4 · Código

Ver `docs/catalogo-apis.md` (contratos) y `docs/mapa-dominios.md` (dominios).

# 🏛️ RDM Digital Hub — Nodo Cero

> Sistema Operativo Territorial para turismo, patrimonio, participación comunitaria y servicios digitales locales en Real del Monte, Hidalgo, México.

[![Estado](https://img.shields.io/badge/estado-en%20desarrollo-F59E0B?style=flat-square)](#estado-del-proyecto)
[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Licencia](https://img.shields.io/badge/licencia-CROWN%20Sovereign-8B1E3F?style=flat-square)](#licencia)
[![Sitio](https://img.shields.io/badge/sitio-visitarealdelmonte.online-0F766E?style=flat-square)](https://www.visitarealdelmonte.online)

**Nodo Cero** es el nodo inicial de una plataforma territorial orientada a fortalecer la identidad cultural, la economía local y la gestión digital de Real del Monte. Su arquitectura prioriza modularidad, trazabilidad, seguridad y evolución gradual hacia una red federada de territorios.

- 🌐 Sitio: [visitarealdelmonte.online](https://www.visitarealdelmonte.online)
- 📚 Documentación: [`/docs`](./docs)
- 🐙 Repositorio: [OsoPanda1/nodo-cero](https://github.com/OsoPanda1/nodo-cero)

---

## Tabla de contenidos

- [Propósito](#propósito)
- [Ámbitos funcionales](#ámbitos-funcionales)
- [Arquitectura](#arquitectura)
- [Stack tecnológico](#stack-tecnológico)
- [Estado del proyecto](#estado-del-proyecto)
- [Inicio rápido](#inicio-rápido)
- [Calidad y validación](#calidad-y-validación)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Seguridad](#seguridad)
- [Documentación](#documentación)
- [Contribución](#contribución)
- [Reporte de vulnerabilidades](#reporte-de-vulnerabilidades)
- [Licencia](#licencia)
- [Contacto](#contacto)

---

## Propósito

Nodo Cero busca consolidar capacidades digitales territoriales en una plataforma integrada:

- **Turismo cultural:** contenidos, rutas, patrimonio, gastronomía y experiencias locales.
- **Economía local:** visibilidad para negocios y servicios verificados del territorio.
- **Participación comunitaria:** mecanismos de reconocimiento y gamificación.
- **Gestión territorial:** bases para incidentes, activos, infraestructura y análisis operativo.
- **Soberanía tecnológica:** contratos explícitos, trazabilidad, seguridad por diseño y control gradual de los datos territoriales.

La plataforma se desarrolla bajo una visión modular: cada dominio puede avanzar de forma independiente sin acoplar innecesariamente la interfaz, las APIs y las reglas de negocio.

---

## Ámbitos funcionales

| Dominio | Objetivo | Estado |
|---|---|---|
| **Turismo y patrimonio** | Difusión de lugares, historia, gastronomía, leyendas y rutas | En desarrollo |
| **Isabella** | Asistente cognitivo con respuestas trazables y controles de seguridad | Especificado / integración gradual |
| **Marketplace** | Directorio y experiencias de negocios locales | Modelo y APIs en desarrollo |
| **Gamificación** | Puntos, logros, retos y clasificación territorial | En desarrollo |
| **Gemelo territorial** | Modelo digital para infraestructura, puntos de interés y señales operativas | Modelo de datos en desarrollo |
| **Centro de operaciones** | Incidentes, visualización geográfica y flujos de atención | Especificado |
| **Identidad YUN** | Credenciales, scopes, rotación y revocación de acceso | Especificado |
| **CITEMESH** | Comunicación federada entre nodos territoriales | Investigación / diseño |
| **GEMET** | Integridad y trazabilidad de conocimiento territorial | Investigación / diseño |
| **Continuidad** | Journal, reconciliación y recuperación operativa | Diseño inicial |

> Los módulos marcados como “especificados”, “en investigación” o “en desarrollo” no deben interpretarse como funciones disponibles en producción.

---

## Arquitectura

La arquitectura separa la experiencia de usuario, las APIs, los dominios de negocio y los componentes transversales.

```text
┌─────────────────────────────────────────────────────────┐
│ Experiencia                                              │
│ Next.js · React · Tailwind · Planos territoriales        │
├─────────────────────────────────────────────────────────┤
│ API                                                      │
│ Route handlers · Validación · Autorización · Observabilidad │
├─────────────────────────────────────────────────────────┤
│ Dominios                                                 │
│ Turismo · Ciudad · Marketplace · Gamificación · IA       │
├─────────────────────────────────────────────────────────┤
│ Núcleo transversal                                       │
│ Eventos · Contratos · Configuración · Utilidades         │
├─────────────────────────────────────────────────────────┤
│ Datos e integraciones                                    │
│ PostgreSQL · Redis · Servicios externos configurables    │
└─────────────────────────────────────────────────────────┘
```

### Principios de diseño

- **Modularidad por dominio:** responsabilidades aisladas y contratos explícitos.
- **Validación en límites:** esquemas para datos de entrada, eventos y respuestas.
- **Seguridad por defecto:** autenticación, autorización, límites de tasa y validaciones centralizadas.
- **Trazabilidad:** identificadores de correlación y eventos para diagnóstico.
- **Evolución progresiva:** los componentes avanzados se incorporan cuando cuenten con implementación, pruebas y operación verificable.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Aplicación web | Next.js con App Router |
| Interfaz | React y TypeScript |
| Estilos | Tailwind CSS y componentes reutilizables |
| Validación | Zod |
| Persistencia | PostgreSQL |
| Caché / colas | Redis, cuando aplique |
| Pruebas | Vitest |
| Calidad | TypeScript, ESLint y scripts internos |
| Despliegue | Configurable según el entorno |

> Las versiones efectivas y dependencias autorizadas son las declaradas en [`package.json`](./package.json).

---

## Estado del proyecto

**Estado general: desarrollo activo.**

### Disponible o base implementada

- Estructura modular del proyecto.
- Configuración de TypeScript y herramientas de calidad.
- Base de componentes y layouts de la experiencia web.
- Contratos y utilidades transversales.
- Documentación técnica inicial y decisiones arquitectónicas.
- Scripts de verificación del repositorio.

### En desarrollo

- Experiencias turísticas y contenidos territoriales.
- Mapa y visualización de puntos de interés.
- Directorio o marketplace de negocios locales.
- Mecánicas de gamificación.
- APIs de dominio y persistencia.
- Pruebas automatizadas por módulo.

### Planeado

- Integración operativa de Isabella.
- Centro de operaciones territorial.
- Gemelo digital e integraciones IoT.
- Malla federada CITEMESH.
- Grafo de conocimiento GEMET.
- Estrategias avanzadas de continuidad y recuperación.

Consulta el avance vigente en los issues, pull requests y documentos del repositorio.

---

## Inicio rápido

### Requisitos

- Node.js 20 o superior
- npm 10 o superior
- Git

### Instalación

```bash
git clone https://github.com/OsoPanda1/nodo-cero.git
cd nodo-cero

npm install
```

Si el repositorio documenta una estrategia distinta de resolución de dependencias, sigue la instrucción indicada en `package.json`, `AGENTS.md` o la guía de desarrollo.

### Configuración

```bash
cp .env.example .env.local
```

Completa únicamente las variables requeridas para el entorno local. **Nunca subas secretos, tokens, claves privadas ni archivos `.env.local` al repositorio.**

### Desarrollo local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Calidad y validación

Antes de abrir un pull request, ejecuta los comandos disponibles en el proyecto:

```bash
npx tsc --noEmit
npm run lint
npm test
```

Si están definidos en `package.json`, también puedes usar:

```bash
npm run quality
npm run audit
npm run check:env
npm run check:contracts
```

> Ejecuta solo scripts presentes en el `package.json` vigente. No declares métricas de cobertura, auditorías o resultados como hechos si no son reproducibles en CI.

---

## Estructura del repositorio

```text
app/
├── api/                       # Route handlers y recursos HTTP
├── (planos)/                  # Experiencias principales de la plataforma
├── globals.css                # Estilos globales
└── layout.tsx                 # Layout raíz

components/
├── design-system/             # Componentes reutilizables
├── layout/                    # Navegación y estructura visual
├── tourism/                   # Turismo y patrimonio
├── marketplace/               # Comercio local
├── gamification/              # Retos, puntos y logros
├── isabella/                  # Interfaz del asistente
├── map/                       # Mapas y geografía
└── city/                      # Experiencias de ciudad

lib/
├── core/                      # Configuración, eventos, contratos y utilidades
├── security/                  # Controles de seguridad e identidad
├── isabella/                  # Lógica del asistente
├── tourism/                   # Dominio turístico
├── marketplace/               # Dominio comercial
├── gamification/              # Dominio de participación
├── city/                      # Dominio urbano
├── twins/                     # Modelo territorial
├── citemesh/                  # Federación de nodos
├── gemet/                     # Conocimiento e integridad
└── continuity/                # Continuidad operativa

docs/                          # Arquitectura, ADRs, guías y contratos
scripts/                       # Automatización y validaciones
tests/                         # Pruebas automatizadas
public/                        # Activos estáticos
```

La estructura puede evolucionar conforme se consoliden los dominios y sus contratos.

---

## Seguridad

Nodo Cero adopta un enfoque de seguridad por capas. Las rutas y módulos sensibles deben centralizar controles de:

- Validación de entrada y salida mediante contratos.
- Autenticación y autorización por scopes o roles.
- Verificación de origen cuando aplique.
- Limitación de tasa para recursos expuestos.
- Manejo seguro de secretos mediante variables de entorno.
- Registro y trazabilidad de operaciones relevantes.
- Pruebas de seguridad antes de habilitar funciones sensibles.

Los mecanismos criptográficos, la federación, los sellos de compilación y las garantías post-cuánticas solo deben anunciarse como operativos cuando existan implementación revisable, pruebas reproducibles y documentación técnica verificable.

---

## Documentación

- [Arquitectura](./docs/ARCHITECTURE.md)
- [Guía de desarrollo](./docs/guia-desarrollador.md)
- [Guía de modularización](./docs/guia-modularizacion.md)
- [Decisiones arquitectónicas](./docs/)
- [Especificación OpenAPI](./docs/openapi-yun.yaml)
- [RFC-0001 / C.R.O.W.N.](./RFC-0001.md)

Si algún enlace no existe aún, crea el documento correspondiente o elimina el enlace hasta que esté disponible.

---

## Contribución

Las contribuciones son bienvenidas, especialmente en accesibilidad, documentación, patrimonio local, pruebas, diseño de interfaz y módulos territoriales.

1. Haz un fork del repositorio.
2. Crea una rama descriptiva:

   ```bash
   git checkout -b feature/nombre-descriptivo
   ```

3. Implementa cambios acotados y documentados.
4. Añade o actualiza pruebas cuando corresponda.
5. Ejecuta las validaciones disponibles.
6. Abre un pull request con contexto, alcance y evidencia de pruebas.

Revisa [`AGENTS.md`](./AGENTS.md) y la documentación del repositorio antes de contribuir.

---

## Reporte de vulnerabilidades

**No publiques vulnerabilidades ni secretos en issues públicos.**

Envía un reporte responsable a:

- `security@visitarealdelmonte.online`

Incluye, cuando sea posible:

- Descripción clara del hallazgo.
- Pasos para reproducirlo.
- Impacto potencial.
- Evidencia mínima necesaria.
- Recomendación de mitigación, si la tienes.

---

## Licencia

Este proyecto se distribuye bajo la **CROWN Sovereign License**. Consulta el archivo [`LICENSE`](./LICENSE) y el marco de gobernanza en [`RFC-0001.md`](./RFC-0001.md) para conocer los permisos, restricciones y condiciones aplicables.

Si esos archivos aún no están presentes, no declares una licencia definitiva: añade primero un texto legal revisado y versionado.

---

## Contacto

- Sitio web: [visitarealdelmonte.online](https://www.visitarealdelmonte.online)
- Repositorio: [github.com/OsoPanda1/nodo-cero](https://github.com/OsoPanda1/nodo-cero)
- Contacto general: `contacto@visitarealdelmonte.online`
- Seguridad: `security@visitarealdelmonte.online`

---

<p align="center">
  <strong>Nodo Cero</strong><br />
  Real del Monte, Hidalgo, México<br />
  Tecnología territorial, cultura viva y participación local.
</p>

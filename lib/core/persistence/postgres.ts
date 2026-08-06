/* ================================================================== */
/* PERSISTENCIA — Cliente Postgres unificado (Supabase + Neon)         */
/* ================================================================== */
/* Adaptador de persistencia que resuelve la petición explícita de los */
/* stores: "conectar Supabase/Postgres en un adaptador sin tocar el    */
/* resto de la capa".                                                  */
/*                                                                     */
/* - PRIMARIO (escrituras + lecturas): Supabase Postgres.              */
/* - RÉPLICA (lecturas opcionales): Neon Postgres.                     */
/* Ambos hablan el mismo protocolo, así que un solo driver (postgres.js)*/
/* sirve para los dos. Si no hay ninguna URL configurada, el sistema   */
/* sigue operando en modo demo (fail-open) usando solo memoria.        */
/* ================================================================== */

import 'server-only';
import postgres, { type Sql } from 'postgres';

export type PostgresProvider = 'supabase' | 'neon' | 'generic';

interface ResolvedConnection {
  url: string;
  provider: PostgresProvider;
}

/** Resuelve la URL primaria (Supabase) con prioridad y degradación limpia. */
function resolvePrimary(): ResolvedConnection | null {
  const supabase =
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING;
  if (supabase) return { url: supabase, provider: 'supabase' };

  const neon =
    process.env.NEON_DATABASE_URL ||
    process.env.NEON_POSTGRES_URL ||
    process.env.NEON_POSTGRES_PRISMA_URL;
  if (neon) return { url: neon, provider: 'neon' };

  const generic = process.env.DATABASE_URL;
  if (generic) return { url: generic, provider: 'generic' };

  return null;
}

/** Resuelve la URL de la réplica de lectura (Neon). Solo si difiere del
 *  primario, para no abrir dos pools idénticos. */
function resolveReplica(primary: ResolvedConnection | null): ResolvedConnection | null {
  const neon =
    process.env.NEON_DATABASE_URL ||
    process.env.NEON_POSTGRES_URL ||
    process.env.NEON_POSTGRES_URL_NON_POOLING;
  if (!neon) return null;
  if (primary && primary.url === neon) return null;
  return { url: neon, provider: 'neon' };
}

interface PgSingleton {
  primary?: Sql | null;
  replica?: Sql | null;
  primaryMeta?: ResolvedConnection | null;
  replicaMeta?: ResolvedConnection | null;
}

/* Sobrevive a HMR en dev: un único pool por proceso. */
const g = globalThis as unknown as { __rdmPgPool?: PgSingleton };

function pool(): PgSingleton {
  if (!g.__rdmPgPool) g.__rdmPgPool = {};
  return g.__rdmPgPool;
}

function createClient(conn: ResolvedConnection): Sql {
  /* prepare:false → compatible con pgbouncer en modo transacción (Supabase
   *  pooler / Neon pooler). max bajo por el modelo serverless. */
  return postgres(conn.url, {
    prepare: false,
    max: 3,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: 'require',
    onnotice: () => {},
  });
}

/** Cliente Postgres primario (Supabase). `null` si no hay DB configurada. */
export function getPrimary(): Sql | null {
  const p = pool();
  if (p.primary !== undefined) return p.primary;
  const meta = resolvePrimary();
  p.primaryMeta = meta;
  p.primary = meta ? createClient(meta) : null;
  return p.primary;
}

/** Cliente de réplica de lectura (Neon). Cae al primario si no existe. */
export function getReplica(): Sql | null {
  const p = pool();
  if (p.replica !== undefined) return p.replica;
  const meta = resolveReplica(resolvePrimary());
  p.replicaMeta = meta;
  p.replica = meta ? createClient(meta) : null;
  return p.replica ?? getPrimary();
}

/** `sql` primario para escrituras y lecturas por defecto. */
export function sql(): Sql {
  const client = getPrimary();
  if (!client) {
    throw new Error('POSTGRES_NOT_CONFIGURED: no hay URL de Postgres (Supabase/Neon) en el entorno.');
  }
  return client;
}

export function isPostgresConfigured(): boolean {
  return resolvePrimary() !== null;
}

export function primaryProvider(): PostgresProvider | null {
  return resolvePrimary()?.provider ?? null;
}

export function replicaProvider(): PostgresProvider | null {
  return resolveReplica(resolvePrimary())?.provider ?? null;
}

/** Ping ligero para el health-check. No lanza. */
export async function pingPostgres(): Promise<{ ok: boolean; latencyMs: number | null; error?: string }> {
  const client = getPrimary();
  if (!client) return { ok: false, latencyMs: null, error: 'not_configured' };
  const started = Date.now();
  try {
    await client`select 1 as ok`;
    return { ok: true, latencyMs: Date.now() - started };
  } catch (error) {
    return { ok: false, latencyMs: null, error: error instanceof Error ? error.message : 'unknown' };
  }
}

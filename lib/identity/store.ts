/* ================================================================== */
/* IDENTIDAD YUN — Almacén en memoria del runtime (server-only)        */
/* ================================================================== */
/* Registro soberano de vecinos y comercios. Mismo patrón que el store */
/* de gamification: globalThis para sobrevivir a HMR; persistencia     */
/* real conectando Supabase/Postgres en un adaptador.                  */
/* ================================================================== */

import type { RegisterBusinessInput, RegisterUserInput } from './contracts';
import { publishEvent } from '@/lib/core/events';

export interface RegisteredUserRecord {
  id: string;
  kind: 'user' | 'business';
  name: string;
  email: string;
  role?: string;
  businessName?: string;
  category?: string;
  createdAt: number;
}

interface IdentityStoreShape {
  users: Map<string, RegisteredUserRecord>;
  byEmail: Map<string, string>;
}

const STORE_KEY = '__rdmIdentityStore';

const g = globalThis as unknown as { [STORE_KEY]?: IdentityStoreShape };

function getStore(): IdentityStoreShape {
  if (!g[STORE_KEY]) {
    g[STORE_KEY] = { users: new Map(), byEmail: new Map() };
  }
  return g[STORE_KEY] as IdentityStoreShape;
}

function nextId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}${rand}`;
}

export function findRegistered(email: string): RegisteredUserRecord | null {
  const store = getStore();
  const id = store.byEmail.get(email.toLowerCase());
  if (!id) return null;
  return store.users.get(id) ?? null;
}

/** Registra un vecino; rechaza emails duplicados (idempotente por email). */
export function registerUser(input: RegisterUserInput): { ok: true; user: RegisteredUserRecord } | { ok: false; reason: string } {
  const store = getStore();
  const email = input.email.toLowerCase();
  if (store.byEmail.has(email)) return { ok: false, reason: 'EMAIL_ALREADY_REGISTERED' };

  const user: RegisteredUserRecord = {
    id: nextId('usr'),
    kind: 'user',
    name: input.name,
    email,
    role: input.role,
    createdAt: Date.now(),
  };
  store.users.set(user.id, user);
  store.byEmail.set(email, user.id);

  publishEvent({
    type: 'identity.user.registered',
    source: 'yun-identity',
    domain: 'identity',
    severity: 'info',
    data: { id: user.id, role: user.role, createdAt: user.createdAt },
    meta: { entityId: user.id },
  });
  return { ok: true, user };
}

/** Registra un negocio; rechaza emails duplicados. */
export function registerBusiness(input: RegisterBusinessInput): { ok: true; user: RegisteredUserRecord } | { ok: false; reason: string } {
  const store = getStore();
  const email = input.email.toLowerCase();
  if (store.byEmail.has(email)) return { ok: false, reason: 'EMAIL_ALREADY_REGISTERED' };

  const business: RegisteredUserRecord = {
    id: nextId('biz'),
    kind: 'business',
    name: input.businessName,
    email,
    businessName: input.businessName,
    category: input.category,
    createdAt: Date.now(),
  };
  store.users.set(business.id, business);
  store.byEmail.set(email, business.id);

  publishEvent({
    type: 'identity.business.registered',
    source: 'yun-identity',
    domain: 'identity',
    severity: 'info',
    data: { id: business.id, category: business.category, createdAt: business.createdAt },
    meta: { entityId: business.id },
  });
  return { ok: true, user: business };
}

/** Resumen para el monitor (sin emails). */
export function identitySummary() {
  const store = getStore();
  let users = 0;
  let businesses = 0;
  for (const record of store.users.values()) {
    if (record.kind === 'user') users += 1;
    else businesses += 1;
  }
  return { total: store.users.size, users, businesses };
}

/** Limpia el registro (uso en pruebas). */
export function resetIdentityForTests(): void {
  const store = getStore();
  store.users.clear();
  store.byEmail.clear();
}

/* ================================================================== */
/* MARKETPLACE — Repositorio durable (Postgres)                        */
/* ================================================================== */

import 'server-only';
import { isPostgresConfigured, sql } from '@/lib/core/persistence';
import type { MarketplaceListing, Subscription } from './marketplace-types';

export async function upsertListing(l: MarketplaceListing): Promise<void> {
  if (!isPostgresConfigured()) return;
  const db = sql();
  await db`
    insert into public.marketplace_listings
      (id, slug, type, title, description, provider, publisher, status, price,
       rating, rating_count, downloads, tags, compatible_domains, created_at, updated_at)
    values (
      ${l.id}, ${l.slug}, ${l.type}, ${l.title}, ${l.description ?? null},
      ${l.provider ?? null}, ${l.publisher ?? null}, ${l.status},
      ${db.json(l.price as unknown as Record<string, unknown>)},
      ${l.rating}, ${l.ratingCount}, ${l.downloads},
      ${l.tags ?? []}, ${l.compatibleDomains ?? []}, ${l.createdAt}, ${l.updatedAt}
    )
    on conflict (id) do update set
      title = excluded.title,
      description = excluded.description,
      status = excluded.status,
      price = excluded.price,
      rating = excluded.rating,
      rating_count = excluded.rating_count,
      downloads = excluded.downloads,
      tags = excluded.tags,
      compatible_domains = excluded.compatible_domains,
      updated_at = excluded.updated_at
  `;
}

export async function upsertSubscription(s: Subscription): Promise<void> {
  if (!isPostgresConfigured()) return;
  const db = sql();
  await db`
    insert into public.marketplace_subscriptions
      (id, listing_id, licensee, licensed_at, expires_at, status, usage_count)
    values (
      ${s.id}, ${s.listingId}, ${s.licensee}, ${s.licensedAt},
      ${s.expiresAt ?? null}, ${s.status}, ${s.usageCount}
    )
    on conflict (id) do update set
      status = excluded.status,
      usage_count = excluded.usage_count
  `;
}

export async function loadListings(): Promise<MarketplaceListing[]> {
  if (!isPostgresConfigured()) return [];
  const db = sql();
  const rows = await db<
    Array<{
      id: string; slug: string; type: string; title: string; description: string | null;
      provider: string | null; publisher: string | null; status: string;
      price: Record<string, unknown>; rating: number; rating_count: number; downloads: number;
      tags: string[]; compatible_domains: string[]; created_at: string; updated_at: string;
    }>
  >`select * from public.marketplace_listings`;
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    type: r.type,
    title: r.title,
    description: r.description ?? '',
    provider: r.provider ?? '',
    publisher: r.publisher ?? '',
    status: r.status,
    price: r.price,
    rating: Number(r.rating),
    ratingCount: r.rating_count,
    downloads: r.downloads,
    tags: r.tags,
    compatibleDomains: r.compatible_domains,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  })) as MarketplaceListing[];
}

export async function loadSubscriptions(): Promise<Subscription[]> {
  if (!isPostgresConfigured()) return [];
  const db = sql();
  const rows = await db<
    Array<{
      id: string; listing_id: string; licensee: string; licensed_at: string;
      expires_at: string | null; status: string; usage_count: number;
    }>
  >`select * from public.marketplace_subscriptions`;
  return rows.map((r) => ({
    id: r.id,
    listingId: r.listing_id,
    licensee: r.licensee,
    licensedAt: r.licensed_at,
    expiresAt: r.expires_at ?? undefined,
    status: r.status,
    usageCount: r.usage_count,
  })) as Subscription[];
}

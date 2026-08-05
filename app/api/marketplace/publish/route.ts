import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { publishListing } from '@/lib/marketplace/marketplace-store';
import { methodGuard, jsonContentGuard, parseJsonBody } from '@/lib/security/request-validator';
import type { ListingType } from '@/lib/marketplace/marketplace-types';

const ROUTE_ID = 'api:marketplace:publish';
const RATE_LIMIT = 20;
const TYPES: ListingType[] = ['twin', 'model', 'dataset', 'service', 'playbook', 'license'];

function enforceTrust(req: NextRequest): NextResponse | null {
  const server = assertServerOnly('MARKETPLACE');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });
  const origin = verifyOrigin(req);
  if (!origin.ok) return NextResponse.json({ ok: false, error: origin.reason }, { status: 403 });
  const rl = rateLimit(req, ROUTE_ID, RATE_LIMIT);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'Límite de publicaciones alcanzado. Reintenta en un momento.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }
  return null;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const denied = enforceTrust(req);
  if (denied) return denied;
  const methodDenied = methodGuard(req, ['POST']);
  if (methodDenied) return methodDenied;
  const contentDenied = jsonContentGuard(req);
  if (contentDenied) return contentDenied;

  let body: Record<string, unknown>;
  try {
    body = await parseJsonBody(req);
  } catch {
    return NextResponse.json({ ok: false, error: 'BODY_INVALID' }, { status: 400 });
  }
  if (typeof body.title !== 'string' || !body.title || typeof body.provider !== 'string' || !body.provider) {
    return NextResponse.json({ ok: false, error: 'Campos requeridos: title, provider' }, { status: 400 });
  }

  const listing = publishListing({
    type: TYPES.includes(body.type as ListingType) ? (body.type as ListingType) : 'dataset',
    title: String(body.title).slice(0, 160),
    description: typeof body.description === 'string' ? body.description.slice(0, 500) : '',
    provider: String(body.provider).slice(0, 120),
    publisher: typeof body.publisher === 'string' ? body.publisher.slice(0, 120) : String(body.provider).slice(0, 120),
    status: body.status === 'published' ? 'published' : 'pending',
    price: body.price as never,
    tags: Array.isArray(body.tags) ? (body.tags as string[]).slice(0, 12) : [],
    compatibleDomains: Array.isArray(body.compatibleDomains) ? (body.compatibleDomains as string[]).slice(0, 12) : [],
  });

  return NextResponse.json({ ok: true, listing }, { status: 201 });
}

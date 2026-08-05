import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { getTwinInstances } from '@/lib/twins/twin-store';
import { queryTwinInstances } from '@/lib/twins/twin-queries';
import type { TwinQueryFilters } from '@/lib/twins/twin-queries';

const ROUTE_ID = 'api:twins:query';
const RATE_LIMIT = 40;

function enforceTrust(req: NextRequest): NextResponse | null {
  const server = assertServerOnly('TWINS');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });
  const origin = verifyOrigin(req);
  if (!origin.ok) return NextResponse.json({ ok: false, error: origin.reason }, { status: 403 });
  const rl = rateLimit(req, ROUTE_ID, RATE_LIMIT);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'Límite de consultas del Nodo alcanzado. Reintenta en un momento.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }
  return null;
}

function filtersFromSearchParams(params: URLSearchParams): TwinQueryFilters {
  const filters: TwinQueryFilters = {};
  const domain = params.get('domain');
  const status = params.get('status');
  const modelId = params.get('modelId');
  const text = params.get('q');
  if (domain) filters.domain = domain as TwinQueryFilters['domain'];
  if (status) filters.status = status as TwinQueryFilters['status'];
  if (modelId) filters.modelId = modelId;
  if (text) filters.text = text;
  return filters;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const denied = enforceTrust(req);
  if (denied) return denied;

  const filters = filtersFromSearchParams(req.nextUrl.searchParams);
  const instances = queryTwinInstances(getTwinInstances(), filters);
  return NextResponse.json({ ok: true, filters, count: instances.length, instances });
}

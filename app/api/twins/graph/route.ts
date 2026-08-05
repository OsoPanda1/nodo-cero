import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { getTwinEdges, getTwinInstances } from '@/lib/twins/twin-store';
import { buildTwinGraph, nearestNode } from '@/lib/twins/twin-graph';
import type { TwinGraphNode } from '@/lib/twins/twin-types';

const ROUTE_ID = 'api:twins:graph';
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

export async function GET(req: NextRequest): Promise<NextResponse> {
  const denied = enforceTrust(req);
  if (denied) return denied;

  const instances = getTwinInstances();
  const nodes: TwinGraphNode[] = instances.map((instance) => ({
    id: instance.id,
    type: instance.modelId,
    name: instance.name,
    lat: instance.lat,
    lng: instance.lng,
    meta: { status: instance.status },
  }));
  const edges = getTwinEdges();
  const graph = buildTwinGraph(nodes, edges);

  const near = req.nextUrl.searchParams.get('near');
  if (near) {
    const [lat, lng] = near.split(',').map(Number);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      const closest = nearestNode(graph, lat, lng);
      return NextResponse.json({ ok: true, graph, nearest: closest });
    }
  }
  return NextResponse.json({ ok: true, graph });
}

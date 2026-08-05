import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { listAssets, getAsset, registerAsset } from '@/lib/assets/asset-registry';
import { computeAssetHealth } from '@/lib/assets/asset-health-engine';
import { methodGuard, jsonContentGuard, parseJsonBody } from '@/lib/security/request-validator';
import type { AssetCategory, AssetCondition, AssetCriticality, AssetStatus, MaintenanceStrategy } from '@/lib/assets/asset-types';

const ROUTE_ID = 'api:assets:register';
const RATE_LIMIT = 30;

const CATEGORIES: AssetCategory[] = ['transformer', 'switchgear', 'pump', 'valve', 'pipe', 'vehicle', 'conveyor', 'compressor', 'structure', 'hvac'];
const CRITICALITIES: AssetCriticality[] = ['low', 'medium', 'high', 'critical'];
const STATUSES: AssetStatus[] = ['operational', 'degraded', 'maintenance', 'failure', 'retired'];
const CONDITIONS: AssetCondition[] = ['excellent', 'good', 'fair', 'poor', 'critical'];
const STRATEGIES: MaintenanceStrategy[] = ['reactive', 'preventive', 'predictive', 'condition-based'];

function enforceTrust(req: NextRequest): NextResponse | null {
  const server = assertServerOnly('EAM/APM');
  if (!server.ok) return NextResponse.json({ ok: false, error: server.error }, { status: 403 });
  const origin = verifyOrigin(req);
  if (!origin.ok) return NextResponse.json({ ok: false, error: origin.reason }, { status: 403 });
  const rl = rateLimit(req, ROUTE_ID, RATE_LIMIT);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: 'Límite de operaciones EAM alcanzado. Reintenta en un momento.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }
  return null;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const denied = enforceTrust(req);
  if (denied) return denied;
  const id = req.nextUrl.searchParams.get('id');
  if (id) {
    const asset = getAsset(id);
    if (!asset) return NextResponse.json({ ok: false, error: 'Activo no encontrado.' }, { status: 404 });
    return NextResponse.json({ ok: true, asset, health: computeAssetHealth(asset) });
  }
  const assets = listAssets().map((a) => ({ asset: a, health: computeAssetHealth(a) }));
  return NextResponse.json({ ok: true, assets });
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
  if (typeof body.name !== 'string' || !body.name || typeof body.category !== 'string' || !body.category) {
    return NextResponse.json({ ok: false, error: 'Campos requeridos: name, category' }, { status: 400 });
  }

  const asset = registerAsset({
    code: typeof body.code === 'string' && body.code ? String(body.code) : `AST-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    name: String(body.name).slice(0, 160),
    category: CATEGORIES.includes(body.category as AssetCategory) ? (body.category as AssetCategory) : 'structure',
    criticality: CRITICALITIES.includes(body.criticality as AssetCriticality) ? (body.criticality as AssetCriticality) : 'medium',
    status: STATUSES.includes(body.status as AssetStatus) ? (body.status as AssetStatus) : 'operational',
    condition: CONDITIONS.includes(body.condition as AssetCondition) ? (body.condition as AssetCondition) : 'good',
    strategy: STRATEGIES.includes(body.strategy as MaintenanceStrategy) ? (body.strategy as MaintenanceStrategy) : 'preventive',
    location: body.location as never,
    manufacturer: typeof body.manufacturer === 'string' ? body.manufacturer : undefined,
    model: typeof body.model === 'string' ? body.model : undefined,
    serialNumber: typeof body.serialNumber === 'string' ? body.serialNumber : undefined,
    designLifeYears: typeof body.designLifeYears === 'number' ? body.designLifeYears : 15,
    telemetry: body.telemetry as never,
    tags: Array.isArray(body.tags) ? (body.tags as string[]).slice(0, 12) : [],
  });

  return NextResponse.json({ ok: true, asset }, { status: 201 });
}

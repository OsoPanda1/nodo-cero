import { NextRequest, NextResponse } from 'next/server';
import { assertServerOnly, rateLimit, verifyOrigin } from '@/lib/isabella/trust';
import { getIncident, listIncidents } from '@/lib/city/city-event-bus';
import { buildEscalation, emergencySummary, isEmergencyIncident } from '@/lib/city/city-emergency-engine';
import { getResponsePlaybook, playbookTotalEta, playbookAutomationLevel } from '@/lib/city/city-response-playbooks';

const ROUTE_ID = 'api:city:response';
const RATE_LIMIT = 50;

function enforceTrust(req: NextRequest): NextResponse | null {
  const server = assertServerOnly('CITY IOC');
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

  const incidentId = req.nextUrl.searchParams.get('incidentId');
  if (incidentId) {
    const incident = getIncident(incidentId);
    if (!incident) return NextResponse.json({ ok: false, error: 'Incidente no encontrado.' }, { status: 404 });
    const playbook = getResponsePlaybook(incident);
    return NextResponse.json({
      ok: true,
      incident,
      playbook,
      totalEtaMinutes: playbookTotalEta(playbook),
      automation: playbookAutomationLevel(playbook),
      escalation: buildEscalation(incident),
    });
  }

  const incidents = listIncidents();
  return NextResponse.json({
    ok: true,
    summary: emergencySummary(incidents),
    emergencyIncidents: incidents.filter(isEmergencyIncident).map((i) => ({
      id: i.id,
      domain: i.domain,
      title: i.title,
      severity: i.severity,
      escalation: buildEscalation(i),
    })),
  });
}

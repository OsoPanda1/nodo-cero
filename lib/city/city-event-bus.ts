import type { CityDomain, CityEvent, CityIncident, CityIncidentStatus, CitySeverity } from './city-types';

const MAX_EVENTS = 200;

interface CityEventBusShape {
  events: CityEvent[];
  incidents: CityIncident[];
  handlers: Array<(event: CityEvent) => void>;
}

const g = globalThis as unknown as { __rdmCityBus?: CityEventBusShape };

function getBus(): CityEventBusShape {
  if (!g.__rdmCityBus) {
    g.__rdmCityBus = { events: [], incidents: seedIncidents(), handlers: [] };
  }
  return g.__rdmCityBus;
}

function now(): string {
  return new Date().toISOString();
}

export function seedIncidents(): CityIncident[] {
  const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();
  return [
    {
      id: 'inc-001',
      domain: 'traffic',
      title: 'Congestión en acceso norte',
      description: 'Aumento sostenido de flujo vehicular en la entrada principal del pueblo mágico.',
      severity: 'high',
      status: 'open',
      location: { lat: 20.1412, lng: -98.6745, label: 'Acceso norte' },
      source: 'sensor',
      createdAt: minutesAgo(25),
      updatedAt: minutesAgo(25),
      tags: ['traffic', 'rush-hour'],
      relatedEntityIds: ['sub-rdm'],
    },
    {
      id: 'inc-002',
      domain: 'civilProtection',
      title: 'Riesgo por caída de ramas',
      description: 'Viento fuerte en zona arbolada del jardín del Mirador.',
      severity: 'critical',
      status: 'assigned',
      location: { lat: 20.1386, lng: -98.6751, label: 'Mirador' },
      source: 'citizen',
      createdAt: minutesAgo(7),
      updatedAt: minutesAgo(3),
      tags: ['weather', 'risk'],
      relatedEntityIds: ['plaza-nacional'],
    },
    {
      id: 'inc-003',
      domain: 'water',
      title: 'Baja presión en El Crestón',
      description: 'Sectores altos reportan presión por debajo del umbral operativo.',
      severity: 'medium',
      status: 'triaged',
      location: { lat: 20.1412, lng: -98.6719, label: 'Tanque El Crestón' },
      source: 'integration',
      createdAt: minutesAgo(48),
      updatedAt: minutesAgo(40),
      tags: ['water', 'pressure'],
      relatedEntityIds: ['tanque-1'],
    },
    {
      id: 'inc-004',
      domain: 'energy',
      title: 'Carga alta en subestación',
      description: 'La subestación opera al 78% de capacidad durante el pico vespertino.',
      severity: 'low',
      status: 'open',
      location: { lat: 20.1398, lng: -98.6738, label: 'Subestación central' },
      source: 'sensor',
      createdAt: minutesAgo(90),
      updatedAt: minutesAgo(90),
      tags: ['energy', 'load'],
      relatedEntityIds: ['sub-rdm'],
    },
    {
      id: 'inc-005',
      domain: 'mobility',
      title: 'Turibús con desviación',
      description: 'La unidad de la ruta norte se desvió del itinerario por bloqueo parcial.',
      severity: 'medium',
      status: 'assigned',
      location: { lat: 20.1389, lng: -98.6741, label: 'Ruta norte' },
      source: 'integration',
      createdAt: minutesAgo(15),
      updatedAt: minutesAgo(12),
      tags: ['mobility', 'vehicle'],
      relatedEntityIds: ['bus-turistico-01'],
    },
  ];
}

export function publishCityEvent(event: Omit<CityEvent, 'id' | 'timestamp'>): CityEvent {
  const bus = getBus();
  const full: CityEvent = { ...event, id: `evt-${Math.random().toString(36).slice(2, 10)}`, timestamp: now() };
  bus.events.push(full);
  if (bus.events.length > MAX_EVENTS) bus.events = bus.events.slice(-MAX_EVENTS);
  for (const handler of bus.handlers) {
    try {
      handler(full);
    } catch {
      /* handler defectuoso: nunca rompe el bus */
    }
  }
  return full;
}

export function subscribeCityEvents(handler: (event: CityEvent) => void): () => void {
  const bus = getBus();
  bus.handlers.push(handler);
  return () => {
    bus.handlers = bus.handlers.filter((h) => h !== handler);
  };
}

export function recentCityEvents(limit = 25): CityEvent[] {
  const bus = getBus();
  return [...bus.events].reverse().slice(0, limit);
}

export function listIncidents(): CityIncident[] {
  return getBus().incidents;
}

export function getIncident(id: string): CityIncident | undefined {
  return getBus().incidents.find((i) => i.id === id);
}

export function addIncident(incident: Omit<CityIncident, 'createdAt' | 'updatedAt'>): CityIncident {
  const bus = getBus();
  const full: CityIncident = { ...incident, createdAt: now(), updatedAt: now() };
  bus.incidents.push(full);
  return full;
}

export function updateIncident(
  id: string,
  patch: Partial<Pick<CityIncident, 'status' | 'severity' | 'description' | 'tags'>>,
): CityIncident | undefined {
  const bus = getBus();
  const index = bus.incidents.findIndex((i) => i.id === id);
  if (index === -1) return undefined;
  const next = { ...bus.incidents[index], ...patch, updatedAt: now() };
  bus.incidents[index] = next;
  return next;
}

export function incidentCountByStatus(incidents: CityIncident[]): Record<CityIncidentStatus, number> {
  const counts: Record<CityIncidentStatus, number> = { open: 0, triaged: 0, assigned: 0, mitigated: 0, closed: 0 };
  for (const incident of incidents) counts[incident.status] += 1;
  return counts;
}

export function incidentCountByDomain(incidents: CityIncident[]): Record<CityDomain, number> {
  const counts = {} as Record<CityDomain, number>;
  for (const incident of incidents) counts[incident.domain] = (counts[incident.domain] ?? 0) + 1;
  return counts;
}

export function severityRank(severity: CitySeverity): number {
  return { low: 1, medium: 2, high: 3, critical: 4 }[severity];
}

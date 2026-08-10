'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  Car,
  CheckCircle2,
  CloudFog,
  Database,
  Gauge,
  MapPin,
  Radio,
  RefreshCw,
  Shield,
  ShoppingBag,
  Thermometer,
  Ticket,
  TrendingUp,
  Users,
  WifiOff,
  Wind,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import {
  federationHealthResponseSchema,
  metricsAggregatesResponseSchema,
  type FederationHealthResponse,
  type FederationStatus,
  type FederationStatusItem,
  type TelemetryKpi,
} from '@/lib/core/contracts/telemetry';
import { uiTelemetry } from '@/lib/telemetry/ui-telemetry';

const REFRESH_INTERVAL_MS = 60_000;

type MetricKey = 'visitors' | 'traffic' | 'humidity';

type TelemetryPoint = {
  time: string;
  visitors: number;
  traffic: number;
  humidity: number;
};

type DashboardState = {
  health: FederationHealthResponse | null;
  kpis: TelemetryKpi | null;
  alerts: number;
  refreshedAt: Date | null;
};

type PlannedSensor = {
  id: string;
  name: string;
  domain: string;
  description: string;
  phase: 'Etapa 2';
  icon: typeof Thermometer;
};

const EMPTY_STATE: DashboardState = {
  health: null,
  kpis: null,
  alerts: 0,
  refreshedAt: null,
};

/*
 * Serie de demostración visual.
 * No se trata como telemetría live ni alimenta KPIs, alertas o decisiones.
 * Sustituir por una fuente versionada: telemetry-timeseries / snapshots.
 */
const REFERENCE_SERIES: TelemetryPoint[] = [
  { time: '08:00', visitors: 1200, traffic: 320, humidity: 92 },
  { time: '10:00', visitors: 3400, traffic: 680, humidity: 88 },
  { time: '12:00', visitors: 7800, traffic: 1240, humidity: 82 },
  { time: '14:00', visitors: 9200, traffic: 1450, humidity: 79 },
  { time: '16:00', visitors: 6500, traffic: 1100, humidity: 85 },
  { time: '18:00', visitors: 4100, traffic: 890, humidity: 90 },
  { time: '20:00', visitors: 2100, traffic: 450, humidity: 94 },
];

const METRIC_CONFIG: Record<
  MetricKey,
  {
    label: string;
    unit: string;
    stroke: string;
    gradientId: string;
    activeClass: string;
  }
> = {
  visitors: {
    label: 'Aforo turístico',
    unit: 'personas',
    stroke: '#22d3ee',
    gradientId: 'telemetryVisitorsGradient',
    activeClass: 'bg-cyan-400 text-slate-950',
  },
  traffic: {
    label: 'Tráfico',
    unit: 'vehículos/h',
    stroke: '#c084fc',
    gradientId: 'telemetryTrafficGradient',
    activeClass: 'bg-purple-400 text-slate-950',
  },
  humidity: {
    label: 'Humedad',
    unit: '%',
    stroke: '#fbbf24',
    gradientId: 'telemetryHumidityGradient',
    activeClass: 'bg-amber-400 text-slate-950',
  },
};

const STATUS_CONFIG: Record<
  FederationStatus,
  {
    label: string;
    dotClass: string;
    badgeClass: string;
    icon: typeof CheckCircle2;
  }
> = {
  online: {
    label: 'Operativa',
    dotClass: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.72)]',
    badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    icon: CheckCircle2,
  },
  degraded: {
    label: 'Degradada',
    dotClass: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.65)]',
    badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    icon: AlertTriangle,
  },
  offline: {
    label: 'Sin conexión',
    dotClass: 'bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.65)]',
    badgeClass: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    icon: WifiOff,
  },
  unknown: {
    label: 'Sin verificar',
    dotClass: 'bg-slate-400',
    badgeClass: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
    icon: Activity,
  },
};

const PLANNED_SENSORS: PlannedSensor[] = [
  {
    id: 'ambient-temperature',
    name: 'Temperatura ambiental',
    domain: 'Microclima territorial',
    description:
      'Estaciones meteorológicas locales e integración con dispositivos IoT.',
    phase: 'Etapa 2',
    icon: Thermometer,
  },
  {
    id: 'air-quality',
    name: 'Calidad del aire',
    domain: 'Sostenibilidad',
    description:
      'Lectura de partículas y variables ambientales para análisis territorial.',
    phase: 'Etapa 2',
    icon: Wind,
  },
  {
    id: 'relative-humidity',
    name: 'Humedad relativa',
    domain: 'Microclima territorial',
    description:
      'Correlación climática con actividad turística y condiciones locales.',
    phase: 'Etapa 2',
    icon: CloudFog,
  },
  {
    id: 'vehicular-flow',
    name: 'Flujo vehicular',
    domain: 'Movilidad',
    description:
      'Conteo y patrones de movilidad desde sensores o fuentes autorizadas.',
    phase: 'Etapa 2',
    icon: Car,
  },
  {
    id: 'pedestrian-flow',
    name: 'Aforo peatonal',
    domain: 'Turismo y espacio público',
    description:
      'Estimación agregada y no identificable de afluencia por zona.',
    phase: 'Etapa 2',
    icon: Users,
  },
  {
    id: 'energy-consumption',
    name: 'Consumo energético',
    domain: 'Infraestructura',
    description:
      'Monitoreo piloto de consumo en espacios y servicios participantes.',
    phase: 'Etapa 2',
    icon: Zap,
  },
  {
    id: 'node-battery',
    name: 'Energía de nodos',
    domain: 'Edge / IoT',
    description:
      'Estado de energía, autonomía y continuidad de nodos físicos.',
    phase: 'Etapa 2',
    icon: BatteryCharging,
  },
  {
    id: 'network-quality',
    name: 'Calidad de red',
    domain: 'Conectividad',
    description:
      'Latencia, disponibilidad y estabilidad de enlaces territoriales.',
    phase: 'Etapa 2',
    icon: Gauge,
  },
];

function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-MX').format(value);
}

function formatLatency(value: number): string {
  return `${Math.round(value)} ms`;
}

function formatRefreshTime(value: Date | null): string {
  if (!value) return 'Sin actualizar';

  return new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(value);
}

function normalizeStatus(value: unknown): FederationStatus {
  return value === 'online' ||
    value === 'degraded' ||
    value === 'offline' ||
    value === 'unknown'
    ? value
    : 'unknown';
}

function integrityLabel(integrity: number): string {
  if (integrity >= 0.95) return 'Íntegra';
  if (integrity >= 0.75) return 'En vigilancia';
  return 'Requiere atención';
}

function OverviewCard({
  title,
  value,
  detail,
  icon: Icon,
  accentClass,
}: {
  title: string;
  value: string;
  detail: string;
  icon: typeof Activity;
  accentClass: string;
}) {
  return (
    <Card className="glass-panel overflow-hidden border-border/50 shadow-lg">
      <CardContent className="relative flex items-center justify-between p-5">
        <div className="min-w-0">
          <p
            className={`text-[11px] font-mono uppercase tracking-[0.14em] ${accentClass}`}
          >
            {title}
          </p>
          <p className="mt-1 truncate text-2xl font-black tracking-tight text-foreground">
            {value}
          </p>
          <p className="mt-1 truncate text-[11px] text-muted-foreground">
            {detail}
          </p>
        </div>

        <div
          className={`ml-4 rounded-2xl border border-current/20 bg-background/50 p-3 ${accentClass}`}
          aria-hidden="true"
        >
          <Icon className="h-6 w-6" />
        </div>

        <div
          className={`absolute bottom-0 left-0 h-0.5 w-full bg-current opacity-50 ${accentClass}`}
          aria-hidden="true"
        />
      </CardContent>
    </Card>
  );
}

function FederationRow({ federation }: { federation: FederationStatusItem }) {
  const status = normalizeStatus(federation.status);
  const config = STATUS_CONFIG[status];
  const StatusIcon = config.icon;

  return (
    <article className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-background/35 p-3 transition-colors hover:border-border/80 hover:bg-background/55">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${config.dotClass}`}
          aria-hidden="true"
        />

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {federation.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {federation.metric}
          </p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <Badge variant="outline" className={`gap-1 ${config.badgeClass}`}>
          <StatusIcon className="h-3 w-3" />
          {formatLatency(federation.latency_ms)}
        </Badge>
        <p className="mt-1 max-w-40 truncate text-[10px] text-muted-foreground">
          {federation.detail}
        </p>
      </div>
    </article>
  );
}

function PlannedSensorCard({ sensor }: { sensor: PlannedSensor }) {
  const Icon = sensor.icon;

  return (
    <article className="group relative overflow-hidden rounded-xl border border-border/45 bg-background/35 p-4 opacity-80 transition-all hover:border-[hsl(var(--gold))]/40 hover:bg-background/55 hover:opacity-100">
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-xl border border-border/50 bg-background/60 p-2.5 text-muted-foreground transition-colors group-hover:text-[hsl(var(--gold))]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>

        <Badge
          variant="outline"
          className="border-slate-500/35 bg-slate-500/10 text-[10px] text-slate-300"
        >
          Sin señal
        </Badge>
      </div>

      <h3 className="mt-4 text-sm font-medium text-foreground">
        {sensor.name}
      </h3>

      <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.1em] text-[hsl(var(--gold))]/85">
        {sensor.domain}
      </p>

      <p className="mt-3 min-h-10 text-xs leading-relaxed text-muted-foreground">
        {sensor.description}
      </p>

      <div className="mt-4 flex items-center gap-2 border-t border-border/35 pt-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
        {sensor.phase} · No implementado
      </div>
    </article>
  );
}

export default function TelemetryDashboard() {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('visitors');
  const [state, setState] = useState<DashboardState>(EMPTY_STATE);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const refresh = useCallback(
    async (mode: 'initial' | 'manual' | 'poll' = 'manual') => {
      if (mode === 'initial') {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError(null);

      try {
        const [healthResult, metricsResult, alertsResult] =
          await Promise.allSettled([
            supabase.functions.invoke('federation-health'),
            supabase.functions.invoke('metrics-aggregates'),
            supabase
              .from('system_alerts')
              .select('id', { count: 'exact', head: true })
              .eq('acknowledged', false),
          ]);

        let health: FederationHealthResponse | null = null;
        let kpis: TelemetryKpi | null = null;
        let alerts = 0;
        const failures: string[] = [];

        if (healthResult.status === 'fulfilled' && !healthResult.value.error) {
          const parsed = federationHealthResponseSchema.safeParse(
            healthResult.value.data,
          );

          if (parsed.success) {
            health = parsed.data;
          } else {
            failures.push('formato de salud federada');
          }
        } else {
          failures.push('salud federada');
        }

        if (metricsResult.status === 'fulfilled' && !metricsResult.value.error) {
          const parsed = metricsAggregatesResponseSchema.safeParse(
            metricsResult.value.data,
          );

          if (parsed.success) {
            kpis = parsed.data.kpis;
          } else {
            failures.push('formato de métricas agregadas');
          }
        } else {
          failures.push('métricas agregadas');
        }

        if (alertsResult.status === 'fulfilled' && !alertsResult.value.error) {
          alerts = alertsResult.value.count ?? 0;
        } else {
          failures.push('alertas');
        }

        if (!mountedRef.current) return;

        setState({
          health,
          kpis,
          alerts,
          refreshedAt: new Date(),
        });

        if (failures.length > 0) {
          const message = `Información parcialmente disponible: ${failures.join(', ')}.`;

          setError(message);

          uiTelemetry.warn(
            'telemetry.dashboard',
            'telemetry.partial_refresh',
            {
              mode,
              failures,
            },
          );
        } else {
          uiTelemetry.info(
            'telemetry.dashboard',
            'telemetry.refreshed',
            {
              mode,
              federations: health?.federations.length ?? 0,
              alerts,
            },
          );
        }
      } catch (cause) {
        if (!mountedRef.current) return;

        const message =
          cause instanceof Error
            ? cause.message
            : 'No fue posible actualizar la telemetría.';

        setError(message);

        uiTelemetry.error(
          'telemetry.dashboard',
          'telemetry.refresh_failed',
          {
            mode,
            cause,
          },
        );
      } finally {
        if (!mountedRef.current) return;

        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    mountedRef.current = true;
    void refresh('initial');

    const interval = window.setInterval(() => {
      void refresh('poll');
    }, REFRESH_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      window.clearInterval(interval);
    };
  }, [refresh]);

  const summary = state.health?.summary ?? null;
  const federations = state.health?.federations ?? [];
  const activeMetricConfig = METRIC_CONFIG[activeMetric];

  const overviewCards = useMemo(() => {
    if (!summary || !state.kpis) {
      return [];
    }

    return [
      {
        title: 'Federaciones online',
        value: `${summary.online}/${summary.total}`,
        detail: `${summary.degraded} degradada(s) · ${summary.offline} sin conexión`,
        icon: Radio,
        accentClass: 'text-emerald-400',
      },
      {
        title: 'Lugares activos',
        value: formatNumber(state.kpis.places_active),
        detail: `${formatNumber(state.kpis.events_upcoming)} eventos próximos`,
        icon: MapPin,
        accentClass: 'text-cyan-400',
      },
      {
        title: 'Comercios verificados',
        value: formatNumber(state.kpis.businesses_verified),
        detail: `${formatNumber(state.kpis.commerce_active)} con actividad`,
        icon: ShoppingBag,
        accentClass: 'text-purple-400',
      },
      {
        title: 'Integridad I_TAMV',
        value: `${Math.round(summary.integrity * 100)}%`,
        detail: integrityLabel(summary.integrity),
        icon: Shield,
        accentClass: 'text-amber-400',
      },
    ];
  }, [state.kpis, summary]);

  return (
    <main
      className="space-y-6"
      aria-label="Panel de telemetría territorial de Nodo Cero"
    >
      <header className="flex flex-col gap-4 border-b border-border/50 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[hsl(var(--electric))]">
            <Radio className="h-3.5 w-3.5" />
            Nodo Cero · Observabilidad territorial
          </div>

          <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[hsl(var(--gold))]/30 bg-[hsl(var(--gold))]/10">
              <Activity className="h-5 w-5 text-[hsl(var(--gold))]" />
            </span>
            Telemetría territorial
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Estado verificable de las federaciones TAMV, actividad territorial e
            infraestructura prevista. Última actualización:{' '}
            <span className="font-mono text-foreground/75">
              {formatRefreshTime(state.refreshedAt)}
            </span>
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => void refresh('manual')}
          disabled={loading || refreshing}
          className="gap-2 self-start border-border/70 bg-background/50 lg:self-auto"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading || refreshing ? 'animate-spin' : ''}`}
          />
          {refreshing ? 'Actualizando' : 'Actualizar'}
        </Button>
      </header>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="text-sm font-medium text-amber-200">
              Telemetría parcialmente disponible
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-amber-200/75">
              {error}
            </p>
          </div>
        </div>
      )}

      {loading && overviewCards.length === 0 ? (
        <section
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Cargando indicadores"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="glass-panel h-32 animate-pulse border-border/40"
            />
          ))}
        </section>
      ) : overviewCards.length > 0 ? (
        <section
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Indicadores principales"
        >
          {overviewCards.map((card) => (
            <OverviewCard key={card.title} {...card} />
          ))}
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-border/60 bg-background/20 px-5 py-6 text-center">
          <Database className="mx-auto h-5 w-5 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">
            Indicadores operativos pendientes
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            A la espera de información válida de salud federada y métricas
            agregadas.
          </p>
        </section>
      )}

      <section aria-labelledby="reference-series-title">
        <Card className="glass-panel border-border/50">
          <CardHeader className="gap-4 border-b border-border/40 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle
                id="reference-series-title"
                className="flex items-center gap-2 text-base"
              >
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                Señales territoriales proyectadas
              </CardTitle>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                Visualización de referencia para el modelo de instrumentación.
                No representa una lectura activa ni participa en indicadores,
                alertas o decisiones automáticas.
              </p>
            </div>

            <div
              className="flex w-full items-center gap-1 rounded-xl border border-border/60 bg-background/60 p-1 lg:w-auto"
              role="tablist"
              aria-label="Seleccionar señal territorial"
            >
              {(Object.keys(METRIC_CONFIG) as MetricKey[]).map((key) => {
                const item = METRIC_CONFIG[key];
                const selected = activeMetric === key;

                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveMetric(key)}
                    className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors lg:flex-none ${
                      selected
                        ? `${item.activeClass} font-bold shadow-sm`
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </CardHeader>

          <CardContent className="pt-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                Datos de referencia · implementación de sensores prevista para
                Etapa 2
              </p>
              <Badge
                variant="outline"
                className="border-slate-500/35 bg-slate-500/10 text-slate-300"
              >
                No operativo
              </Badge>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={REFERENCE_SERIES}
                  margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="telemetryVisitorsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#22d3ee"
                        stopOpacity={0.52}
                      />
                      <stop
                        offset="95%"
                        stopColor="#22d3ee"
                        stopOpacity={0}
                      />
                    </linearGradient>

                    <linearGradient
                      id="telemetryTrafficGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#c084fc"
                        stopOpacity={0.52}
                      />
                      <stop
                        offset="95%"
                        stopColor="#c084fc"
                        stopOpacity={0}
                      />
                    </linearGradient>

                    <linearGradient
                      id="telemetryHumidityGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#fbbf24"
                        stopOpacity={0.52}
                      />
                      <stop
                        offset="95%"
                        stopColor="#fbbf24"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.4}
                  />

                  <XAxis
                    dataKey="time"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={42}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.75rem',
                      color: 'hsl(var(--foreground))',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [
                      formatNumber(Number(value)),
                      `${activeMetricConfig.label} (${activeMetricConfig.unit})`,
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey={activeMetric}
                    stroke={activeMetricConfig.stroke}
                    strokeWidth={3}
                    fill={`url(#${activeMetricConfig.gradientId})`}
                    fillOpacity={1}
                    activeDot={{
                      r: 4,
                      strokeWidth: 2,
                      stroke: 'hsl(var(--background))',
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      <section
        aria-labelledby="planned-sensors-title"
        className="rounded-2xl border border-dashed border-[hsl(var(--gold))]/35 bg-[hsl(var(--gold))]/[0.035] p-5"
      >
        <div className="flex flex-col gap-3 border-b border-[hsl(var(--gold))]/15 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-[hsl(var(--gold))]">
              <Radio className="h-3.5 w-3.5" />
              Hoja de ruta de instrumentación
            </div>

            <h2
              id="planned-sensors-title"
              className="text-base font-semibold text-foreground"
            >
              Sensores e infraestructura proyectada
            </h2>

            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-muted-foreground">
              Capacidades contempladas para la Etapa 2 de Nodo Cero. No tienen
              fuente de datos operativa, por lo que no afectan los indicadores,
              alertas, decisiones de Isabella ni procesos de gobernanza.
            </p>
          </div>

          <Badge
            variant="outline"
            className="w-fit shrink-0 border-[hsl(var(--gold))]/35 bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))]"
          >
            Etapa 2 · Planeado
          </Badge>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {PLANNED_SENSORS.map((sensor) => (
            <PlannedSensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="glass-panel border-border/50">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Radio className="h-4 w-4 text-emerald-400" />
                Salud federada
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Estado operacional y latencia por instancia TAMV.
              </p>
            </div>

            {summary && (
              <Badge
                variant="outline"
                className="border-border/60 bg-background/30 text-muted-foreground"
              >
                {summary.online}/{summary.total} online
              </Badge>
            )}
          </CardHeader>

          <CardContent className="space-y-3">
            {federations.length > 0 ? (
              federations.map((federation) => (
                <FederationRow key={federation.key} federation={federation} />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 px-4 py-10 text-center">
                <Radio className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  Sin señal federada disponible
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Esperando una respuesta válida de federation-health.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-4 w-4 text-purple-400" />
              Indicadores operativos
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Métricas agregadas del ecosistema territorial.
            </p>
          </CardHeader>

          <CardContent>
            {state.kpis ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: Users,
                    label: 'Premium activas',
                    value: state.kpis.premium_active,
                    color: 'text-cyan-400',
                  },
                  {
                    icon: Database,
                    label: 'Tracking 24h',
                    value: state.kpis.tracking_events_24h,
                    color: 'text-purple-400',
                  },
                  {
                    icon: Ticket,
                    label: 'Canjes 24h',
                    value: state.kpis.redemptions_24h,
                    color: 'text-amber-400',
                  },
                  {
                    icon: ShoppingBag,
                    label: 'Comercio activo',
                    value: state.kpis.commerce_active,
                    color: 'text-emerald-400',
                  },
                  {
                    icon: Activity,
                    label: 'Eventos próximos',
                    value: state.kpis.events_upcoming,
                    color: 'text-sky-400',
                  },
                  {
                    icon: Shield,
                    label: 'Integridad I_TAMV',
                    value: summary
                      ? `${Math.round(summary.integrity * 100)}%`
                      : '—',
                    color: 'text-[hsl(var(--gold))]',
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-xl border border-border/40 bg-background/35 p-3"
                    >
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                        <span className="text-[11px] leading-tight">
                          {item.label}
                        </span>
                      </div>

                      <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                        {typeof item.value === 'number'
                          ? formatNumber(item.value)
                          : item.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 px-4 py-10 text-center">
                <Database className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  Métricas no disponibles
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Esperando una respuesta válida de metrics-aggregates.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {state.alerts > 0 && (
        <section
          role="alert"
          aria-label="Alertas activas sin reconocer"
          className="flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="text-sm font-medium text-amber-200">
                {state.alerts} alerta{state.alerts === 1 ? '' : 's'} activa
                {state.alerts === 1 ? '' : 's'} sin reconocer
              </p>
              <p className="mt-0.5 text-xs text-amber-200/75">
                Revisa el centro de gobernanza antes de cerrar el ciclo.
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className="w-fit border-amber-500/30 bg-amber-500/10 text-amber-300"
          >
            Atención requerida
          </Badge>
        </section>
      )}
    </main>
  );
}

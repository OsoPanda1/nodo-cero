'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type {
  FederationHealthResponse,
  FederationStatus,
} from '@/lib/core/contracts/telemetry';
import { federationHealthResponseSchema } from '@/lib/core/contracts/telemetry';

const POLL_INTERVAL_MS = 30_000;

const STATUS_UI: Record<
  FederationStatus,
  {
    label: string;
    dot: string;
    ping: string;
    text: string;
  }
> = {
  online: {
    label: 'En línea',
    dot: 'bg-emerald-400',
    ping: 'bg-emerald-400/50',
    text: 'text-emerald-300',
  },
  degraded: {
    label: 'Degradado',
    dot: 'bg-amber-400',
    ping: 'bg-amber-400/50',
    text: 'text-amber-300',
  },
  offline: {
    label: 'Sin conexión',
    dot: 'bg-rose-400',
    ping: 'bg-rose-400/50',
    text: 'text-rose-300',
  },
  unknown: {
    label: 'Verificando',
    dot: 'bg-slate-400',
    ping: 'bg-slate-400/50',
    text: 'text-slate-300',
  },
};

function formatClock(date: Date): string {
  return new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

function statusFromHealth(
  health: FederationHealthResponse | null,
): FederationStatus {
  if (!health?.summary) return 'unknown';
  if (health.summary.offline > 0) return 'offline';
  if (health.summary.degraded > 0) return 'degraded';
  return health.summary.online > 0 ? 'online' : 'unknown';
}

export default function LiveTelemetryBadge() {
  const [time, setTime] = useState(() => new Date());
  const [health, setHealth] = useState<FederationHealthResponse | null>(null);
  const [status, setStatus] = useState<FederationStatus>('unknown');

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function refreshHealth(): Promise<void> {
      try {
        const response = await supabase.functions.invoke('federation-health');

        if (response.error) {
          throw response.error;
        }

        const parsed = federationHealthResponseSchema.safeParse(response.data);

        if (!parsed.success) {
          throw new Error('Respuesta de salud federada inválida');
        }

        if (!mounted) return;

        setHealth(parsed.data);
        setStatus(statusFromHealth(parsed.data));
      } catch {
        if (mounted) {
          setStatus('offline');
        }
      }
    }

    void refreshHealth();

    const interval = window.setInterval(() => {
      void refreshHealth();
    }, POLL_INTERVAL_MS);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const ui = STATUS_UI[status];

  const tooltip = useMemo(() => {
    const summary = health?.summary;

    if (!summary) {
      return `RDM·OS · ${ui.label}`;
    }

    return [
      `RDM·OS · ${ui.label}`,
      `${summary.online}/${summary.total} federaciones online`,
      `${Math.round(summary.avg_latency_ms)} ms`,
    ].join(' · ');
  }, [health?.summary, ui.label]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={tooltip}
      title={tooltip}
      className="fixed bottom-4 left-4 z-40 hidden items-center gap-2 rounded-full border border-border/50 bg-background/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground shadow-soft backdrop-blur-xl transition-colors hover:text-foreground md:flex"
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        {status === 'online' && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${ui.ping} animate-ping`}
          />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${ui.dot}`} />
      </span>

      <span className="text-foreground/80">RDM·OS</span>
      <span className="opacity-40">·</span>
      <span className={ui.text}>{ui.label}</span>
      <span className="opacity-40">·</span>

      <time
        className="text-[hsl(var(--electric))]"
        dateTime={time.toISOString()}
      >
        {formatClock(time)}
      </time>

      {health?.summary && (
        <>
          <span className="opacity-40">·</span>
          <span className="text-foreground/70">
            {Math.round(health.summary.avg_latency_ms)}ms
          </span>
        </>
      )}
    </div>
  );
}

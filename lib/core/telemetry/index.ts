import { logger } from '@/lib/logger';
import {
  TELEMETRY_CONTRACT_VERSION,
  telemetryEventSchema,
  type TelemetryEvent,
  type TelemetryLevel,
  type TelemetryScope,
} from '@/lib/core/contracts/telemetry';
import { sanitizeTelemetryDetails } from './sanitize';

export type TelemetryTransport = (
  event: TelemetryEvent,
) => void | Promise<void>;

export interface RecordTelemetryInput {
  level: TelemetryLevel;
  scope?: TelemetryScope;
  source: string;
  event: string;
  message: string;
  route?: string;
  traceId?: string;
  requestId?: string;
  sessionId?: string;
  userId?: string;
  details?: Record<string, unknown>;
}

const MAX_PENDING_EVENTS = 100;

let activeTransport: TelemetryTransport | null = null;
const pendingEvents: TelemetryEvent[] = [];

function createTelemetryId(): string {
  if (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.randomUUID === 'function'
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `00000000-0000-4000-8000-${Date.now()
    .toString(16)
    .padStart(12, '0')
    .slice(-12)}`;
}

function writeToLogger(event: TelemetryEvent): void {
  const message =
    `[telemetry:${event.level}] ` +
    `[${event.scope}] ` +
    `[${event.source}] ` +
    `${event.event}: ${event.message}`;

  switch (event.level) {
    case 'fatal':
    case 'error':
      logger.error(message, event.details);
      return;
    case 'warn':
      logger.warn(message, event.details);
      return;
    case 'info':
      logger.info(message, event.details);
      return;
    default:
      logger.debug(message, event.details);
  }
}

function dispatch(event: TelemetryEvent): void {
  if (!activeTransport) {
    if (pendingEvents.length >= MAX_PENDING_EVENTS) {
      pendingEvents.shift();
    }

    pendingEvents.push(event);
    return;
  }

  try {
    const dispatched = activeTransport(event);

    if (dispatched && typeof dispatched.then === 'function') {
      void dispatched.catch(() => {
        // La observabilidad nunca debe interrumpir el flujo principal.
      });
    }
  } catch {
    // La observabilidad nunca debe interrumpir el flujo principal.
  }
}

export function setTelemetryTransport(
  transport: TelemetryTransport | null,
): void {
  activeTransport = transport;

  if (!activeTransport || pendingEvents.length === 0) {
    return;
  }

  const queued = pendingEvents.splice(0, pendingEvents.length);

  for (const event of queued) {
    dispatch(event);
  }
}

export function recordTelemetry(
  input: RecordTelemetryInput,
): TelemetryEvent {
  const telemetryEvent = telemetryEventSchema.parse({
    version: TELEMETRY_CONTRACT_VERSION,
    id: createTelemetryId(),
    occurredAt: new Date().toISOString(),
    level: input.level,
    scope: input.scope ?? 'ui',
    source: input.source,
    event: input.event,
    message: input.message,
    ...(input.route ? { route: input.route } : {}),
    ...(input.traceId ? { traceId: input.traceId } : {}),
    ...(input.requestId ? { requestId: input.requestId } : {}),
    ...(input.sessionId ? { sessionId: input.sessionId } : {}),
    ...(input.userId ? { userId: input.userId } : {}),
    details: sanitizeTelemetryDetails(input.details),
  });

  const shouldLogLocally =
    process.env.NODE_ENV !== 'production' ||
    telemetryEvent.level === 'warn' ||
    telemetryEvent.level === 'error' ||
    telemetryEvent.level === 'fatal';

  if (shouldLogLocally) {
    writeToLogger(telemetryEvent);
  }

  dispatch(telemetryEvent);

  return telemetryEvent;
}

function createLevelHelper(level: TelemetryLevel) {
  return (
    source: string,
    event: string,
    message: string,
    details?: Record<string, unknown>,
  ): TelemetryEvent =>
    recordTelemetry({
      level,
      source,
      event,
      message,
      details,
    });
}

export const telemetry = {
  debug: createLevelHelper('debug'),
  info: createLevelHelper('info'),
  warn: createLevelHelper('warn'),
  error: createLevelHelper('error'),
  fatal: createLevelHelper('fatal'),
};

export default telemetry;

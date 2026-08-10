export type IsabellaVoiceTelemetryEvent =
  | 'isabella.voice.requested'
  | 'isabella.voice.cache_hit'
  | 'isabella.voice.generated'
  | 'isabella.voice.fallback'
  | 'isabella.voice.rate_limited'
  | 'isabella.voice.failed'
  | 'isabella.voice.cancelled';

export interface IsabellaVoiceTelemetryPayload {
  requestId: string;
  profile: string;
  mode?: 'cloud' | 'local' | 'text';
  cacheHit?: boolean;
  latencyMs?: number;
  reason?: string;
  federationId?: string;
}

export function createIsabellaVoiceTelemetry(
  event: IsabellaVoiceTelemetryEvent,
  payload: IsabellaVoiceTelemetryPayload,
) {
  return {
    event,
    payload,
    occurredAt: new Date().toISOString(),
  };
}

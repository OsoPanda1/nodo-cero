import { randomUUID } from 'node:crypto';
import { prisma } from '@/lib/db/prisma';
import { createVoiceSignedUrl, uploadVoiceAudio } from './storage';
import { buildVoiceCacheKey } from './cache-key';
import { ISABELLA_VOICE_VERSION } from './constants';
import { normalizeForSpeech } from './normalize';
import { buildIsabellaSsml } from './ssml';
import type {
  IsabellaVoiceProfile,
  IsabellaVoiceRequest,
  IsabellaVoiceResponse,
} from './contracts';
import { GoogleTtsProvider } from './providers/google';
import { MockTtsProvider } from './providers/mock';
import type { TtsProvider } from './providers/types';

function getProvider(): TtsProvider {
  if (process.env.TTS_PROVIDER === 'google') {
    return new GoogleTtsProvider();
  }

  return new MockTtsProvider();
}

export async function synthesizeIsabellaVoice(
  input: IsabellaVoiceRequest,
): Promise<IsabellaVoiceResponse> {
  const requestId = input.requestId ?? randomUUID();
  const startedAt = Date.now();
  const profile: IsabellaVoiceProfile = input.profile ?? 'isabella.default';
  const normalizedText = normalizeForSpeech(input.text);

  if (!input.userInitiated) {
    return {
      requestId,
      status: 'blocked',
      mode: 'text',
      normalizedText,
      profile,
      cacheHit: false,
      voiceVersion: ISABELLA_VOICE_VERSION,
      reason: 'audio_requires_user_gesture',
    };
  }

  if (!input.allowCloud) {
    return {
      requestId,
      status: 'fallback',
      mode: 'local',
      normalizedText,
      profile,
      cacheHit: false,
      voiceVersion: ISABELLA_VOICE_VERSION,
      reason: 'cloud_audio_not_authorized',
    };
  }

  if (!normalizedText) {
    return {
      requestId,
      status: 'blocked',
      mode: 'text',
      normalizedText,
      profile,
      cacheHit: false,
      voiceVersion: ISABELLA_VOICE_VERSION,
      reason: 'empty_text',
    };
  }

  const provider = getProvider();
  const cacheKey = buildVoiceCacheKey({
    normalizedText,
    profile,
    provider: provider.name,
    voiceId: provider.voiceId,
    locale: 'es-MX',
    format: 'mp3',
  });

  const existing = await prisma.isabellaVoiceAsset.findUnique({
    where: { cacheKey },
  });

  if (existing) {
    const audioUrl = await createVoiceSignedUrl(existing.storagePath);

    await prisma.isabellaVoiceMetric.create({
      data: {
        requestId,
        textHash: existing.textHash,
        profileId: profile,
        voiceVersion: ISABELLA_VOICE_VERSION,
        provider: provider.name,
        providerVoiceId: provider.voiceId,
        mode: 'CLOUD',
        status: 'SUCCESS',
        cacheHit: true,
        latencyMs: Date.now() - startedAt,
        federationId: input.federationId,
      },
    });

    return {
      requestId,
      status: 'ready',
      mode: 'cloud',
      normalizedText,
      profile,
      audioUrl,
      cacheHit: true,
      durationMs: existing.durationMs ?? undefined,
      voiceVersion: ISABELLA_VOICE_VERSION,
    };
  }

  try {
    const ssml = buildIsabellaSsml(normalizedText, profile);
    const result = await provider.synthesize({ ssml, locale: 'es-MX' });

    const storagePath = `${ISABELLA_VOICE_VERSION}/${cacheKey}.mp3`;

    await uploadVoiceAudio(storagePath, result.audio);

    await prisma.isabellaVoiceAsset.create({
      data: {
        cacheKey,
        storagePath,
        profileId: profile,
        voiceVersion: ISABELLA_VOICE_VERSION,
        provider: result.provider,
        providerVoiceId: result.voiceId,
        textHash: cacheKey,
        durationMs: result.durationMs,
        byteSize: result.audio.byteLength,
      },
    });

    const audioUrl = await createVoiceSignedUrl(storagePath);
    const latencyMs = Date.now() - startedAt;

    await prisma.isabellaVoiceMetric.create({
      data: {
        requestId,
        textHash: cacheKey,
        profileId: profile,
        voiceVersion: ISABELLA_VOICE_VERSION,
        provider: result.provider,
        providerVoiceId: result.voiceId,
        mode: 'CLOUD',
        status: 'SUCCESS',
        cacheHit: false,
        latencyMs,
        durationMs: result.durationMs,
        federationId: input.federationId,
      },
    });

    return {
      requestId,
      status: 'ready',
      mode: 'cloud',
      normalizedText,
      profile,
      audioUrl,
      cacheHit: false,
      durationMs: result.durationMs,
      voiceVersion: ISABELLA_VOICE_VERSION,
    };
  } catch (error) {
    await prisma.isabellaVoiceMetric.create({
      data: {
        requestId,
        textHash: cacheKey,
        profileId: profile,
        voiceVersion: ISABELLA_VOICE_VERSION,
        provider: provider.name,
        providerVoiceId: provider.voiceId,
        mode: 'LOCAL',
        status: 'FALLBACK',
        cacheHit: false,
        latencyMs: Date.now() - startedAt,
        failureCode: error instanceof Error ? error.message : 'unknown_error',
        federationId: input.federationId,
      },
    });

    return {
      requestId,
      status: 'fallback',
      mode: 'local',
      normalizedText,
      profile,
      cacheHit: false,
      voiceVersion: ISABELLA_VOICE_VERSION,
      reason: 'cloud_tts_unavailable',
    };
  }
}

'use client';

import { useCallback, useRef, useState } from 'react';
import type { IsabellaAudioClip } from '@/lib/isabella/voice/contracts';

const priorityRank = {
  critical: 0,
  normal: 1,
  ambient: 2,
} as const;

export function useIsabellaAudioQueue() {
  const queueRef = useRef<IsabellaAudioClip[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentRef = useRef<IsabellaAudioClip | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stopCurrent = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    currentRef.current = null;
    setIsPlaying(false);
  }, []);

  const playNext = useCallback(() => {
    if (currentRef.current) return;

    const next = queueRef.current.shift();
    if (!next || !next.audioUrl) return;

    currentRef.current = next;

    const audio = new Audio(next.audioUrl);
    audioRef.current = audio;

    audio.onplay = () => {
      setIsPlaying(true);
      next.onStart?.();
    };

    audio.onended = () => {
      next.onEnd?.();
      audioRef.current = null;
      currentRef.current = null;
      setIsPlaying(false);
      playNext();
    };

    audio.onerror = () => {
      next.onError?.(new Error('No fue posible reproducir el audio.'));
      audioRef.current = null;
      currentRef.current = null;
      setIsPlaying(false);
      playNext();
    };

    void audio.play().catch((error) => {
      next.onError?.(error);
      currentRef.current = null;
      setIsPlaying(false);
    });
  }, []);

  const enqueue = useCallback(
    (clip: IsabellaAudioClip) => {
      const current = currentRef.current;

      if (
        current &&
        priorityRank[clip.priority] < priorityRank[current.priority]
      ) {
        stopCurrent();
      }

      queueRef.current = [...queueRef.current, clip].sort(
        (a, b) => priorityRank[a.priority] - priorityRank[b.priority],
      );

      playNext();
    },
    [playNext, stopCurrent],
  );

  const cancelAll = useCallback(() => {
    queueRef.current = [];
    stopCurrent();
  }, [stopCurrent]);

  return {
    enqueue,
    cancelAll,
    pause: () => audioRef.current?.pause(),
    resume: () => void audioRef.current?.play(),
    isPlaying,
    pending: queueRef.current.length,
  };
}

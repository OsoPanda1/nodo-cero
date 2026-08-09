"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  VolumeX,
  SkipForward,
  Play,
  Shield,
  ChevronRight,
  Landmark,
  Mountain,
  Palette,
  BookMarked,
} from "lucide-react";

export type AAACinematicIntroProps = {
  onComplete: () => void;
};

type Act = {
  id: string;
  image: string;
  chapter: string;
  eyebrow: string;
  title: string;
  words: string[];
  line: string;
  icon: React.ReactNode;
  accent: string;
};

/* Acto por acto: patrimonio, territorio, cultura y el Nodo Cero.
   Usa fotografía real de Real del Monte servida localmente. */
const ACTS: Act[] = [
  {
    id: "historia",
    image: "/images/mina-acosta.jpg",
    chapter: "ACTO I",
    eyebrow: "COMARCA MINERA · ESTADO DE HIDALGO",
    title: "500 AÑOS DE MEMORIA",
    words: ["500 AÑOS", "DE MEMORIA"],
    line: "Donde la plata escribió la historia de un pueblo",
    icon: <Mountain className="h-3.5 w-3.5" />,
    accent: "#c8a356",
  },
  {
    id: "territorio",
    image: "/images/mirador-purisima.jpg",
    chapter: "ACTO II",
    eyebrow: "RUTAS ECOTURÍSTICAS · SENDEROS · MIRADORES",
    title: "TERRITORIO VIVO",
    words: ["TERRITORIO", "VIVO"],
    line: "Bosques, minas y horizontes que se recorren a pie",
    icon: <Landmark className="h-3.5 w-3.5" />,
    accent: "#38bdf8",
  },
  {
    id: "cultura",
    image: "/images/realito-gastronomia.png",
    chapter: "ACTO III",
    eyebrow: "CULTURA CORNISH · ARTE · GASTRONOMÍA · LEYENDAS",
    title: "SABOR & IDENTIDAD",
    words: ["SABOR &", "IDENTIDAD"],
    line: "El paste, la plata .925 y el arte que nos define",
    icon: <Palette className="h-3.5 w-3.5" />,
    accent: "#b85c3c",
  },
  {
    id: "nodo",
    image: "/images/intro-cinematic02.png",
    chapter: "ACTO IV",
    eyebrow: "ARCHIVO DIGITAL · MÚSICA · PODCAST · MAPA VIVO",
    title: "NODO CERO",
    words: ["NODO", "CERO"],
    line: "Isabella AI conecta la memoria con el futuro",
    icon: <BookMarked className="h-3.5 w-3.5" />,
    accent: "#10b981",
  },
];

const ACT_MS = 5200;

export default function AAACinematicIntro({ onComplete }: AAACinematicIntroProps) {
  const [act, setAct] = useState(0);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<{ ctx: AudioContext; gain: GainNode } | null>(null);

  /* Secuencia de actos + barra de progreso continua. */
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = (now - start) % ACT_MS;
      setProgress(elapsed / ACT_MS);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const timer = setInterval(() => {
      setAct((prev) => (prev + 1) % ACTS.length);
    }, ACT_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
    };
  }, []);

  /* Pad ambiental generado por WebAudio (sin archivos): drone suave y
     filtrado que sólo suena tras el gesto del usuario. Inmersivo y ligero. */
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.gain.gain.exponentialRampToValueAtTime(
          0.0001,
          audioRef.current.ctx.currentTime + 0.6,
        );
        const ctx = audioRef.current.ctx;
        setTimeout(() => ctx.close().catch(() => {}), 700);
      } catch {
        /* noop */
      }
      audioRef.current = null;
    }
  }, []);

  const startAudio = useCallback(() => {
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctx();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 1.5);
      gain.connect(ctx.destination);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 620;
      filter.connect(gain);

      [55, 82.4, 110].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = i === 2 ? "triangle" : "sine";
        osc.frequency.value = freq;
        const detune = ctx.createGain();
        detune.gain.value = i === 0 ? 1 : 0.5;
        osc.connect(detune);
        detune.connect(filter);
        osc.start();
      });

      audioRef.current = { ctx, gain };
    } catch {
      /* WebAudio no disponible: degradar silenciosamente */
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      if (next) stopAudio();
      else startAudio();
      return next;
    });
  }, [startAudio, stopAudio]);

  useEffect(() => () => stopAudio(), [stopAudio]);

  const current = ACTS[act];

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden bg-[#04060a] font-sans text-white">
      {/* CAPA 1 — Fotografía cinemática con Ken Burns */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.18 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{
              opacity: { duration: 1.4, ease: "easeInOut" },
              scale: { duration: ACT_MS / 1000 + 1.5, ease: "linear" },
            }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image || "/placeholder.svg"}
              alt={current.title}
              className="h-full w-full object-cover"
              style={{ filter: "brightness(0.62) contrast(1.08) saturate(1.05)" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradientes cinemáticos + viñeta */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04060a] via-[#04060a]/35 to-[#04060a]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04060a]/70 via-transparent to-[#04060a]/40" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(4,6,10,0.55) 78%, rgba(4,6,10,0.92) 100%)",
          }}
        />
      </div>

      {/* CAPA 2 — Grano de película + scanlines */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 3px)",
        }}
      />

      {/* CAPA 3 — Barras letterbox cinemáticas */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: "8vh" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 top-0 z-30 bg-black"
      />
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: "8vh" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 bottom-0 z-30 bg-black"
      />

      {/* CAPA 4 — Barrido de luz sutil */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(200,163,86,0.08) 50%, transparent 60%)",
        }}
      />

      {/* TOP BAR — marca + controles */}
      <div className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-4 md:px-12 md:py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#c8a356] to-[#b85c3c] p-[1.5px] shadow-lg shadow-[#c8a356]/25">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#04060a]">
              <Shield className="h-4 w-4 text-[#c8a356]" />
            </div>
          </div>
          <div className="leading-tight">
            <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-[#c8a356]">
              RDM DIGITAL HUB
            </span>
            <span className="block font-serif text-xs tracking-[0.2em] text-slate-300">
              NODO CERO · REAL DEL MONTE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 font-mono text-[11px] backdrop-blur-md transition hover:border-[#c8a356] hover:text-[#c8a356]"
          >
            {muted ? (
              <VolumeX className="h-4 w-4 text-slate-400" />
            ) : (
              <Volume2 className="h-4 w-4 text-[#c8a356]" />
            )}
            <span className="hidden sm:inline">
              {muted ? "ACTIVAR ATMÓSFERA" : "ATMÓSFERA ACTIVA"}
            </span>
          </button>

          <button
            onClick={onComplete}
            className="flex items-center gap-2 rounded-full border border-[#c8a356]/50 bg-[#c8a356]/10 px-5 py-2 font-mono text-[11px] font-bold text-[#f2cc76] backdrop-blur-md transition hover:bg-[#c8a356] hover:text-[#04060a]"
          >
            <span>SALTAR</span>
            <SkipForward className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* CENTRO — tipografía de tráiler acto por acto */}
      <div className="absolute inset-0 z-30 flex items-center">
        <div className="mx-auto w-full max-w-6xl px-8 md:px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              {/* Capítulo + icono */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="mb-5 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 backdrop-blur-md"
                style={{
                  borderColor: `${current.accent}55`,
                  background: `${current.accent}14`,
                }}
              >
                <span style={{ color: current.accent }}>{current.icon}</span>
                <span
                  className="font-mono text-[10px] font-bold tracking-[0.3em]"
                  style={{ color: current.accent }}
                >
                  {current.chapter}
                </span>
                <span className="h-3 w-px bg-white/20" />
                <span className="font-mono text-[10px] tracking-[0.25em] text-slate-300">
                  {current.eyebrow}
                </span>
              </motion.div>

              {/* Título con revelado por palabra */}
              <h1 className="font-serif text-5xl font-black leading-[0.95] tracking-tight text-white drop-shadow-[0_12px_40px_rgba(0,0,0,0.85)] sm:text-7xl md:text-8xl">
                {current.words.map((word, i) => (
                  <span key={word} className="block overflow-hidden">
                    <motion.span
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{
                        delay: 0.35 + i * 0.16,
                        duration: 0.85,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="inline-block"
                      style={
                        i === current.words.length - 1
                          ? {
                              backgroundImage: `linear-gradient(120deg, #ffffff 0%, ${current.accent} 100%)`,
                              WebkitBackgroundClip: "text",
                              backgroundClip: "text",
                              color: "transparent",
                            }
                          : undefined
                      }
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </h1>

              {/* Línea de guion */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="mt-6 flex items-center gap-4"
              >
                <span
                  className="h-px w-12"
                  style={{ background: current.accent }}
                />
                <p className="max-w-xl font-serif text-base italic text-slate-200 md:text-xl">
                  {current.line}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM BAR — línea de tiempo + CTA */}
      <div className="absolute inset-x-0 bottom-0 z-40 px-6 pb-5 md:px-12 md:pb-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {/* Timeline de actos */}
          <div className="flex items-center gap-2.5">
            {ACTS.map((a, idx) => (
              <button
                key={a.id}
                onClick={() => setAct(idx)}
                className="group flex flex-col gap-1.5"
                aria-label={`Ir a ${a.chapter}`}
              >
                <span className="font-mono text-[9px] tracking-[0.25em] text-slate-400 transition group-hover:text-white">
                  {a.chapter}
                </span>
                <span className="relative h-[3px] w-14 overflow-hidden rounded-full bg-white/15 md:w-20">
                  {idx < act && (
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{ background: a.accent }}
                    />
                  )}
                  {idx === act && (
                    <span
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: `${progress * 100}%`,
                        background: a.accent,
                      }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* CTA de entrada */}
          <button
            onClick={onComplete}
            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#c8a356] via-[#d4b26a] to-[#b85c3c] px-7 py-3.5 font-mono text-sm font-bold text-[#04060a] shadow-[0_0_40px_rgba(200,163,86,0.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(200,163,86,0.6)]"
          >
            <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-500 group-hover:translate-x-full" />
            <Play className="h-5 w-5 fill-[#04060a]" />
            <span className="tracking-[0.18em]">ENTRAR AL NODO CERO</span>
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

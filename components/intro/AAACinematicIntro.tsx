"use client";

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward, Play, Sparkles, Shield, Compass, Mountain, ChevronRight } from 'lucide-react';

export type AAACinematicIntroProps = {
  onComplete: () => void;
};

const TRAILER_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=85",
    subtitle: "DISTRITO MINERO HISTÓRICO · ESTADO DE HIDALGO",
    title: "REAL DEL MONTE",
    highlight: "DONDE LA MEMORIA CONECTA AL FUTURO",
    tag: "500 AÑOS DE PATRIMONIO",
  },
  {
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=2000&q=85",
    subtitle: "NÚCLEOS HEPTAFEDERADOS YUN · TECNOLOGÍA PHYGITAL",
    title: "NODO CERO",
    highlight: "INTELIGENCIA COGNITIVA & GEMELOS DIGITALES",
    tag: "GOBERNAZA SOBERANA",
  },
  {
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=85",
    subtitle: "CULTURA CORNISH · GASTRONOMÍA · LEYENDAS",
    title: "VIVE LA EXPERIENCIA",
    highlight: "UN VIAJE SENSORIAL Y TECNOLÓGICO ÚNICO",
    tag: "PUEBLO MÁGICO CERTIFICADO",
  },
];

export default function AAACinematicIntro({ onComplete }: AAACinematicIntroProps) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [fadeText, setFadeText] = useState<boolean>(true);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setFadeText(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % TRAILER_SLIDES.length);
        setFadeText(true);
      }, 400);
    }, 5500);

    return () => clearInterval(slideTimer);
  }, []);

  const slide = TRAILER_SLIDES[currentSlide];

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col justify-between overflow-hidden bg-slate-950 text-white font-sans transition-all duration-700">
      {/* Background Image Carousel with Ken Burns Effect */}
      <div className="absolute inset-0 z-0">
        {TRAILER_SLIDES.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? "opacity-100 scale-105 transition-transform duration-[6000ms]" : "opacity-0 scale-100"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.image}
              alt={s.title}
              className="h-full w-full object-cover filter brightness-75 contrast-110"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/50 to-slate-950" />
          </div>
        ))}
      </div>

      {/* Particle Overlay Sparkles */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-30 bg-[radial-gradient(#c89a45_1px,transparent_1px)] [background-size:24px_24px] animate-pulse" />

      {/* TOP BAR — Controls & Branding */}
      <div className="relative z-20 flex items-center justify-between p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#c89a45] to-[#d97832] p-0.5 shadow-lg shadow-[#c89a45]/20 flex items-center justify-center">
            <div className="h-full w-full rounded-[10px] bg-slate-950 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#c89a45]" />
            </div>
          </div>
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-[#c89a45] font-bold">RDM DIGITAL HUB</span>
            <span className="block text-xs font-serif tracking-widest text-slate-300">PRESENTACIÓN CINEMÁTICA AAA</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/60 px-4 py-2 text-xs font-mono backdrop-blur-md transition hover:border-[#c89a45] hover:text-[#c89a45]"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#c89a45] animate-bounce" />}
            <span className="hidden sm:inline">{isMuted ? "ATMÓSFERA MUTEADA" : "AUDIO ACTIVO"}</span>
          </button>

          <button
            onClick={onComplete}
            className="flex items-center gap-2 rounded-full border border-[#c89a45]/60 bg-[#c89a45]/20 px-5 py-2 text-xs font-mono font-bold text-[#fceecb] backdrop-blur-md transition hover:bg-[#c89a45] hover:text-slate-950"
          >
            <span>SALTAR INTRO</span>
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CENTER CONTENT — AAA Trailer Typography */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center space-y-6 my-auto">
        <div
          className={`transition-all duration-700 transform ${
            fadeText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c89a45]/40 bg-slate-950/80 px-4 py-1.5 text-[11px] font-mono tracking-[0.25em] text-[#c89a45] mb-4 backdrop-blur-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{slide.tag}</span>
          </div>

          <p className="font-mono text-xs md:text-sm tracking-[0.35em] text-slate-300 uppercase mb-3 drop-shadow-md">
            {slide.subtitle}
          </p>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)] bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-[#c89a45]/80">
            {slide.title}
          </h1>

          <p className="font-mono text-sm md:text-lg tracking-widest text-[#c89a45] font-semibold uppercase mt-4 max-w-3xl mx-auto drop-shadow-lg">
            {slide.highlight}
          </p>
        </div>
      </div>

      {/* BOTTOM BAR — Navigation & Enter Action */}
      <div className="relative z-20 p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/10 bg-slate-950/40 backdrop-blur-xl">
        {/* Slide Indicators */}
        <div className="flex items-center gap-3">
          {TRAILER_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentSlide ? "w-10 bg-[#c89a45]" : "w-3 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Enter CTA */}
        <button
          onClick={onComplete}
          className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#c89a45] via-[#d97832] to-[#c89a45] px-8 py-4 text-sm font-bold font-mono text-slate-950 shadow-[0_0_40px_rgba(200,154,69,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(200,154,69,0.7)]"
        >
          <Play className="w-5 h-5 fill-slate-950 transition-transform group-hover:scale-110" />
          <span className="tracking-widest">ENTRAR AL NODO CERO</span>
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

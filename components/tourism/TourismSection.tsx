"use client";

import React, { useEffect, useState } from 'react';
import {
  CalendarDays, Map, BookOpen, Clock, Timer, Route, Mountain, UtensilsCrossed,
  Church, Music, Trophy, Footprints, Star, Quote, ChevronDown, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { RDM_TIMELINE } from '@/lib/data/rdm-tourism';
import type { TourismPlace, TourismEvent, TourismStory, TourismRoute } from '@/lib/tourism/contracts';

const categoryIcons: Record<string, React.ReactNode> = {
  fiesta: <Trophy className="w-3.5 h-3.5" />,
  gastronomico: <UtensilsCrossed className="w-3.5 h-3.5" />,
  musical: <Music className="w-3.5 h-3.5" />,
  religioso: <Church className="w-3.5 h-3.5" />,
  deportivo: <Footprints className="w-3.5 h-3.5" />,
  feria: <CalendarDays className="w-3.5 h-3.5" />,
};

const placeCategoryLabels: Record<string, string> = {
  mina: 'Mina',
  museo: 'Museo',
  patrimonio: 'Patrimonio',
  iglesia: 'Iglesia',
  plaza: 'Plaza',
  mirador: 'Mirador',
  bosque: 'Bosque',
  panteon: 'Panteón',
  'centro-historico': 'Centro Histórico',
  gastronomia: 'Gastronomía',
  hospedaje: 'Hospedaje',
  otro: 'Otro',
};

const difficultyColor: Record<string, string> = {
  facil: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/60',
  moderada: 'text-amber-400 border-amber-500/30 bg-amber-950/60',
  exigente: 'text-rose-400 border-rose-500/30 bg-rose-950/60',
};

const difficultyLabels: Record<string, string> = {
  facil: 'Fácil',
  moderada: 'Moderada',
  exigente: 'Exigente',
};

const timelineIcons: Record<string, React.ReactNode> = {
  cross: <Church className="w-4 h-4" />,
  gear: <Clock className="w-4 h-4" />,
  pickaxe: <Mountain className="w-4 h-4" />,
  building: <Map className="w-4 h-4" />,
  star: <Star className="w-4 h-4" />,
  leaf: <Footprints className="w-4 h-4" />,
};

/* Badge de verificación del dato vivo (catálogo editorial). */
function VerificationBadge({ level }: { level: TourismPlace['confidenceLevel'] }) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    verified: {
      label: 'Confirmado',
      cls: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/70',
      icon: <ShieldCheck className="w-3 h-3" />,
    },
    pending: {
      label: 'Por confirmar',
      cls: 'text-amber-300 border-amber-500/40 bg-amber-950/70',
      icon: <AlertTriangle className="w-3 h-3" />,
    },
    contradictory: {
      label: 'Re-verificar',
      cls: 'text-rose-300 border-rose-500/40 bg-rose-950/70',
      icon: <AlertTriangle className="w-3 h-3" />,
    },
    historical: {
      label: 'Histórico',
      cls: 'text-slate-300 border-slate-500/40 bg-slate-900/70',
      icon: <Clock className="w-3 h-3" />,
    },
  };
  const badge = map[level] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${badge.cls}`}>
      {badge.icon}
      {badge.label}
    </span>
  );
}

export default function TourismSection() {
  const [activeTab, setActiveTab] = useState<'atractivos' | 'eventos' | 'rutas' | 'dichos' | 'historia'>('atractivos');
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);
  const [places, setPlaces] = useState<TourismPlace[]>([]);
  const [events, setEvents] = useState<TourismEvent[]>([]);
  const [stories, setStories] = useState<TourismStory[]>([]);
  const [routes, setRoutes] = useState<TourismRoute[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [placesRes, eventsRes, culturaRes, routesRes] = await Promise.all([
          fetch('/api/turismo/places').then(r => r.json()),
          fetch('/api/turismo/events').then(r => r.json()),
          fetch('/api/turismo/cultura').then(r => r.json()),
          fetch('/api/turismo/routes').then(r => r.json()),
        ]);
        if (cancelled) return;
        if (placesRes.ok) setPlaces(placesRes.places);
        if (eventsRes.ok) setEvents(eventsRes.events);
        if (culturaRes.ok) setStories(culturaRes.stories);
        if (routesRes.ok) setRoutes(routesRes.routes);
      } catch {
        /* catálogo opcional: si la API no está lista, se muestra vacío */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const dichos = stories.filter(s => s.kind === 'dicho');
  const leyendas = stories.filter(s => s.kind !== 'dicho');

  const FALLBACK_IMG = '/images/real-3.jpg';
  const onImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== `${window.location.origin}${FALLBACK_IMG}`) img.src = FALLBACK_IMG;
  };

  const tabs = [
    { id: 'atractivos' as const, label: 'Atractivos', icon: <Map className="w-4 h-4" /> },
    { id: 'eventos' as const, label: 'Eventos & Festivales', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'rutas' as const, label: 'Rutas Turísticas', icon: <Route className="w-4 h-4" /> },
    { id: 'dichos' as const, label: 'Dichos & Leyendas', icon: <Quote className="w-4 h-4" /> },
    { id: 'historia' as const, label: 'Línea de Tiempo', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Map className="w-6 h-6 text-rose-400" />
            Real del Monte para Visitantes
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Catálogo turístico vivo · datos verificados con procedencia y caducidad editorial
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 rounded-2xl glass-panel border border-white/10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-rose-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* PLACES — catálogo vivo con estado de verificación */}
      {activeTab === 'atractivos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {places.map((place) => (
            <div
              key={place.id}
              className="group p-5 rounded-2xl glass-panel-interactive border border-white/10 flex flex-col space-y-3 overflow-hidden"
            >
              <div className="relative h-36 rounded-xl overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={place.image ?? FALLBACK_IMG}
                  alt={place.name}
                  onError={onImageError}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute top-2 left-3">
                  <span className="text-[10px] font-mono text-cyan-300 bg-slate-950/70 px-2 py-0.5 rounded-md border border-cyan-500/30">
                    {placeCategoryLabels[place.category] ?? place.category}
                  </span>
                </div>
                <div className="absolute bottom-2 left-3">
                  <VerificationBadge level={place.confidenceLevel} />
                </div>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">{place.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light flex-1">{place.description}</p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
                {place.admissionFee && (
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800">
                    <Star className="w-3 h-3 text-amber-400" />
                    {place.admissionFee}
                  </span>
                )}
                {place.hours.length > 0 && place.hours[0].open && (
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {place.hours[0].open}–{place.hours[0].close} {place.hours[0].days}
                  </span>
                )}
              </div>
            </div>
          ))}
          {places.length === 0 && (
            <p className="text-xs text-slate-500 font-mono col-span-full">
              Cargando catálogo editorial…
            </p>
          )}
        </div>
      )}

      {/* EVENTS */}
      {activeTab === 'eventos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <div
              key={event.id}
              className="group p-5 rounded-2xl glass-panel-interactive border border-white/10 flex flex-col space-y-3 overflow-hidden"
            >
              <div className="relative h-36 rounded-xl overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.image ?? FALLBACK_IMG}
                  alt={event.name}
                  onError={onImageError}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white bg-slate-950/70 px-2 py-0.5 rounded-md border border-white/20">
                    {categoryIcons[event.category]} {event.category}
                  </span>
                  <VerificationBadge level={event.confidenceLevel} />
                </div>
              </div>
              <h3 className="text-base font-bold text-white">{event.name}</h3>
              {event.sessions[0]?.startsAt && (
                <span className="text-[10px] font-mono text-cyan-300">
                  {event.sessions[0].startsAt}
                  {event.sessions[0].endsAt && event.sessions[0].endsAt !== event.sessions[0].startsAt
                    ? ` → ${event.sessions[0].endsAt}`
                    : ''}
                </span>
              )}
              <p className="text-xs text-slate-300 leading-relaxed font-light flex-1">{event.description}</p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <Map className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">{event.place}</span>
              </div>
              {event.sessions[0]?.admission && (
                <span className="text-[11px] font-mono text-amber-300">
                  Entrada: {event.sessions[0].admission}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ROUTES */}
      {activeTab === 'rutas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {routes.map(route => (
            <div
              key={route.id}
              className="p-5 rounded-2xl glass-panel-interactive border border-white/10 space-y-3"
            >
              <div className="relative h-40 rounded-xl overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={route.image ?? FALLBACK_IMG}
                  alt={route.name}
                  onError={onImageError}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
                <div className="absolute top-2 right-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-md border ${difficultyColor[route.difficulty]}`}>
                    {difficultyLabels[route.difficulty] ?? route.difficulty}
                  </span>
                </div>
                <h3 className="absolute bottom-2 left-3 right-3 text-lg font-black text-white drop-shadow">
                  {route.name}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-300">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                  <Timer className="w-3.5 h-3.5 text-cyan-400" />
                  {route.duration}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                  <Map className="w-3.5 h-3.5 text-amber-400" />
                  {route.distance}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-light">{route.description}</p>

              <button
                onClick={() => setExpandedRoute(expandedRoute === route.id ? null : route.id)}
                className="w-full pt-3 border-t border-white/10 text-xs font-mono font-semibold text-cyan-400 hover:text-white flex items-center justify-between transition-colors"
              >
                <span>Ver Paradas ({route.stops.length})</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${expandedRoute === route.id ? 'rotate-180' : ''}`} />
              </button>

              {expandedRoute === route.id && (
                <ol className="space-y-2 pt-1">
                  {route.stops.map((stop) => (
                    <li key={stop.order} className="flex items-center gap-3 text-xs text-slate-300">
                      <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-mono text-[10px] shrink-0">
                        {stop.order}
                      </span>
                      <span className="font-medium">{stop.name}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
          {routes.length === 0 && (
            <p className="text-xs text-slate-500 font-mono col-span-full">
              Cargando rutas del catálogo editorial…
            </p>
          )}
        </div>
      )}

      {/* DICHOS Y LEYENDAS */}
      {activeTab === 'dichos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {dichos.map(story => (
            <div
              key={story.id}
              className="p-6 rounded-2xl glass-panel-interactive border border-white/10 space-y-3 flex flex-col justify-between"
            >
              <Quote className="w-6 h-6 text-rose-400" />
              <p className="text-lg font-bold text-white leading-snug">{story.text}</p>
              <p className="text-xs text-slate-300 leading-relaxed font-light">{story.meaning}</p>
              <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-slate-500">
                Origen: {story.origin}
              </div>
            </div>
          ))}
          {leyendas.map(story => (
            <div
              key={story.id}
              className="p-6 rounded-2xl glass-panel-interactive border border-white/10 space-y-3 flex flex-col justify-between"
            >
              <BookOpen className="w-6 h-6 text-cyan-400" />
              <p className="text-base font-bold text-white leading-snug">{story.title}</p>
              <p className="text-xs text-slate-300 leading-relaxed font-light">{story.text}</p>
              {story.meaning && (
                <p className="text-[11px] text-slate-400 italic font-light">{story.meaning}</p>
              )}
              <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-slate-500">
                Origen: {story.origin}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TIMELINE */}
      {activeTab === 'historia' && (
        <div className="relative pl-6 border-l-2 border-cyan-500/30 space-y-6">
          {RDM_TIMELINE.map(event => (
            <div key={event.year} className="relative">
              <div className="absolute -left-[35px] w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-500/60 text-cyan-400 flex items-center justify-center">
                {timelineIcons[event.icon]}
              </div>
              <div className="p-4 rounded-2xl glass-panel border border-white/10">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30">
                    {event.year}
                  </span>
                  <h4 className="text-sm font-bold text-white">{event.title}</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-light">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

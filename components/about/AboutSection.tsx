"use client";

import React from 'react';
import { Users, Compass, Network, HeartHandshake, Lightbulb, Lock, Gem } from 'lucide-react';
import { RDM_TEAM, RDM_VALUES } from '@/lib/data/rdm-content';

const valueIcons = [
  <Lock key="v1" className="w-5 h-5" />,
  <Lightbulb key="v2" className="w-5 h-5" />,
  <HeartHandshake key="v3" className="w-5 h-5" />,
  <Gem key="v4" className="w-5 h-5" />,
];

export default function AboutSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Compass className="w-6 h-6 text-cyan-400" />
          Quiénes Somos
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          El Nodo Cero del RDM Digital Hub — Heptafederación YUN
        </p>
      </div>

      {/* Mission */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-slate-950/60 space-y-4">
        <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
          <Network className="w-4 h-4" />
          Manifiesto del Nodo Cero
        </div>
        <p className="text-sm text-slate-200 leading-relaxed font-light">
          Somos una comunidad digital soberana que habita en las laderas del Real del Monte, a 20.1398°N / 98.6738°W.
          Tejemos tecnología, patrimonio y memoria para que el legado minero de la comarca no se pierda en la niebla.
          Operamos como el <span className="text-cyan-300 font-bold">Nodo Cero</span> de una arquitectura
          <span className="text-amber-300 font-bold"> Heptafederada YUN</span>: siete núcleos, treinta y cinco nodos,
          y un solo propósito — que el Real sea dueño de su propia voz digital.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            ['7', 'Núcleos federados'],
            ['35', 'Nodos activos'],
            ['1', 'Real del Monte'],
          ].map(([num, label]) => (
            <div key={label} className="p-3 rounded-xl bg-slate-950/60 border border-white/10 text-center">
              <div className="text-2xl font-black text-amber-400">{num}</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div>
        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
          <HeartHandshake className="w-5 h-5 text-amber-400" />
          Nuestros Valores
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RDM_VALUES.map((value, i) => (
            <div key={value.id} className="p-5 rounded-2xl glass-panel-interactive border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-amber-400">
                {valueIcons[i % valueIcons.length]}
              </div>
              <h4 className="text-sm font-bold text-white">{value.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-emerald-400" />
          Consejo del Nodo
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RDM_TEAM.map(member => (
            <div key={member.id} className="p-5 rounded-2xl glass-panel-interactive border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-white/15 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{member.name}</h4>
                  <div className="text-[11px] font-mono text-emerald-400">{member.role}</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-light">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

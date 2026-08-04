"use client";

import React from "react";
import {
  Users,
  Compass,
  Network,
  HeartHandshake,
  Lightbulb,
  Lock,
  Gem,
} from "lucide-react";
import { RDM_TEAM, RDM_VALUES } from "@/lib/data/rdm-content";

const valueIcons = [
  <Lock key="v1" className="w-5 h-5" />,
  <Lightbulb key="v2" className="w-5 h-5" />,
  <HeartHandshake key="v3" className="w-5 h-5" />,
  <Gem key="v4" className="w-5 h-5" />,
];

export default function AboutSection() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-1">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Compass className="w-6 h-6 text-cyan-400" />
          Quiénes somos
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Nodo Cero del RDM Digital Hub · Heptafederación YUN · TAMV Online Network
        </p>
      </header>

      {/* Manifiesto del Nodo Cero / TAMV */}
      <section className="p-6 rounded-2xl glass-panel border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-slate-950/60 space-y-4">
        <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
          <Network className="w-4 h-4" />
          Manifiesto del Nodo Cero
        </div>
        <p className="text-sm text-slate-200 leading-relaxed font-light">
          Somos una comunidad digital soberana que habita en las laderas de
          Real del Monte, a 20.1398°N / 98.6738°W. Tejemos tecnología, patrimonio y
          memoria para que el legado minero de la Comarca no se pierda en la niebla ni
          se diluya en los servidores de las grandes plataformas.
        </p>
        <p className="text-sm text-slate-200 leading-relaxed font-light">
          Este nodo nace de un sueño, el cual se volvio una meta a cumplir,
          el resultado llevo 23,200 horas de trabajo silencioso de un solo
          arquitecto, que desea ver cumplidos sus sueños en su tierra natal. —{" "}
          <span className="text-cyan-300 font-semibold">
            Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)
          </span>{" "}
          — que decidió que la historia de su pueblo no iba a depender de la
          voluntad de ninguna big tech. Su dolor es simple y radical: ver cómo
          comunidades enteras son reducidas a métricas de publicidad y perfiles
          anónimos, mientras su identidad, sus muertos y sus fiestas son
          convertidos en contenido desechable.
        </p>
        <p className="text-sm text-slate-200 leading-relaxed font-light">
          TAMV Online Network no es una red social, es un{" "}
          <span className="text-amber-300 font-semibold">
            ecosistema antifrágil de soberanía digital
          </span>{" "}
          diseñado desde Real del Monte para demostrar que en Latinoamérica
          también se construyen infraestructuras de clase mundial sin pedir
          permiso a Silicon Valley. Este Nodo Cero es la primera pieza de un
          sistema operativo territorial que devuelve el control del dato, de la
          voz y del mapa a quienes viven aquí. Durante casi 50 años se etiqueto
          a LATAM como simples consumidores, se les olvido que en Latinoamerica,
          existe un pais llamado Mexico, donde cada mexicano, nace  con la
          nececidad y sentido de sobrevivencia y resiliencia en sus venas y 
          eso señor es lo mismo que innovar. Recordemos que, La innovación nace
          de la necesidad, se forja en el dolor y sobrevive como resiliencia. 
          Entonces definamos para Silicon Vlley un punto: 
          Innovar no es un lujo: es sobrevivir, resistir y convertir el dolor en futuro.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          {[
            ["7", "Federaciones YUN"],
            ["35", "Nodos soberanos"],
            ["1", "Pueblo que no se rinde"],
          ].map(([num, label]) => (
            <div
              key={label}
              className="p-3 rounded-xl bg-slate-950/60 border border-white/10 text-center"
            >
              <div className="text-2xl font-black text-amber-400">{num}</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section>
        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
          <HeartHandshake className="w-5 h-5 text-amber-400" />
          Nuestros valores
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RDM_VALUES.map((value, i) => (
            <article
              key={value.id}
              className="p-5 rounded-2xl glass-panel-interactive border border-white/10 space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-amber-400">
                {valueIcons[i % valueIcons.length]}
              </div>
              <h4 className="text-sm font-bold text-white">{value.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Consejo / Equipo */}
      <section>
        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-emerald-400" />
          Consejo del Nodo
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RDM_TEAM.map((member) => (
            <article
              key={member.id}
              className="p-5 rounded-2xl glass-panel-interactive border border-white/10 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-white/15 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {member.name}
                  </h4>
                  <div className="text-[11px] font-mono text-emerald-400">
                    {member.role}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                {member.bio}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

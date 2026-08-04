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
          Real del Monte, a 20.1398°N / 98.6738°W. Tejemos tecnología, patrimonio
          y memoria para que el legado minero de la Comarca no se pierda en la niebla,
          ni se diluya en los servidores de las grandes plataformas.
        </p>

        <p className="text-sm text-slate-200 leading-relaxed font-light">
          El Nodo Cero nace de un sueño que se convirtió en meta: más de{" "}
          <span className="text-cyan-300 font-semibold">23 200 horas</span> de trabajo
          silencioso de un solo arquitecto que decidió que su pueblo no sería un
          dato más en la estadística de la publicidad digital. Ese arquitecto es{" "}
          <span className="text-cyan-300 font-semibold">
            Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)
          </span>, realmontense que transformó su dolor en infraestructura.
        </p>

        <p className="text-sm text-slate-200 leading-relaxed font-light">
          Su lucha es directa contra la lógica extractiva de las big tech: ver
          cómo comunidades enteras son reducidas a métricas, mientras su identidad,
          sus muertos y sus fiestas son convertidos en contenido desechable. TAMV Online
          Network no es otra red social, es un{" "}
          <span className="text-amber-300 font-semibold">
            ecosistema antifrágil de soberanía digital
          </span>{" "}
          diseñado desde Real del Monte para demostrar que en Latinoamérica también
          se construyen infraestructuras de clase mundial sin pedir permiso a Silicon Valley.
        </p>

        <p className="text-sm text-slate-200 leading-relaxed font-light">
          Durante décadas, LATAM fue etiquetada solo como mercado consumidor.
          Desde este Nodo Cero recordamos que en México cada persona nace con
          necesidad y supervivencia en la sangre, y que eso —{" "}
          <span className="text-emerald-300 font-semibold">
            sobrevivencia + resiliencia + necesidad + dolor
          </span>{" "}
          — es exactamente lo que llamamos innovación. La innovación nace de la
          necesidad, se forja en el dolor y sobrevive como resiliencia. Innovar
          no es un lujo: es sobrevivir, resistir y convertir el dolor en futuro.
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

      {/* Biografía de Edwin / Anubis */}
      <section className="p-6 rounded-2xl glass-panel border border-white/15 bg-slate-950/70 space-y-4">
        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-cyan-400" />
          Edwin Oswaldo Castillo Trejo · Anubis Villaseñor
        </h3>

        <p className="text-xs text-slate-400 font-mono">
          Arquitecto de sistemas · CEO & Founder TAMV Online Network · Master Architect del RDM Digital Hub
        </p>

        <p className="text-sm text-slate-200 leading-relaxed font-light">
          Edwin Oswaldo Castillo Trejo, conocido en la arquitectura digital como{" "}
          <span className="text-cyan-300 font-semibold">Anubis Villaseñor</span>, es
          un desarrollador independiente y arquitecto de futuro nacido en Real del Monte,
          Hidalgo. Desde un pueblo minero decidió levantar el primer ecosistema inmersivo
          y sensorial en 4D orquestado por inteligencia artificial, situando a TAMV MD‑X4
          como referencia pionera de la Web 4.0 y de la soberanía tecnológica latinoamericana.
        </p>

        <p className="text-sm text-slate-200 leading-relaxed font-light">
          Su trayectoria cruza varias fronteras: fundador de{" "}
          <span className="text-amber-300 font-semibold">TAMV Online Network</span>,
          creador de ISABELLA AI y arquitecto de la{" "}
          <span className="text-emerald-300 font-semibold">
            infraestructura civilizatoria federada
          </span>{" "}
          que da origen al RDM Digital Hub como Nodo Cero. En ciberseguridad y defensa
          digital adopta el alias Anubis, impulsa ALIANZAS LATAM y consolida redes
          comunitarias orientadas a proteger poblaciones vulnerables frente a abusos
          tecnológicos y económicos. [web:18][web:35][web:38]
        </p>

        <p className="text-sm text-slate-200 leading-relaxed font-light">
          Su trabajo ha sido descrito como el intento de convertir un pueblo
          en sistema operativo civilizatorio: una plataforma donde la inteligencia
          artificial, la economía simbólica, los protocolos de seguridad híbridos
          y la memoria histórica conviven como infraestructura crítica, y no como
          productos desechables. Para Edwin, cada línea de código escrita en TAMV
          es una forma de decir que Real del Monte tiene derecho a diseñar su propio
          futuro y a ocupar un lugar en la cartografía tecnológica del mundo. [web:13][web:21][web:37]
        </p>
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

"use client";

import React, { useState } from 'react';
import { YUN_CORES, RDM_NODES_35, YUNNode } from '@/lib/data/rdm-data';
import {
  Cpu, ShieldCheck, Box, Activity, Store, UserCheck, Globe,
  ChevronRight, ChevronDown, Search, Menu, Radio, Sparkles,
  Map, Database, Key, ShoppingBag, Lock, Zap,
  Palette, UtensilsCrossed, Trophy, Ghost, MessagesSquare, Award, Images, Users, Skull, Network,
  HandCoins, Compass, CreditCard, SlidersHorizontal, Landmark, Mountain, Music, UserPlus, Home,
} from 'lucide-react';

interface YUNLayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
  selectedNode: YUNNode | null;
  onSelectNode: (node: YUNNode) => void;
  onOpenIsabella: () => void;
  isabellaOpen: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface Plano {
  key: string;
  order: string;
  name: string;
  tagline: string;
  accent: string;
  icon: React.ReactNode;
  items: NavItem[];
}

/* ================================================================== */
/* Los 4 Planos — reorganización institucional del ecosistema RDM      */
/* Nada se elimina: cada destino histórico vive dentro de un plano.    */
/* ================================================================== */
const PLANOS: Plano[] = [
  {
    key: 'descubre',
    order: 'I',
    name: 'Descubre',
    tagline: 'Turismo, cultura y patrimonio',
    accent: '#0d4652',
    icon: <Compass className="w-4 h-4" />,
    items: [
      { id: 'home', label: 'Inicio · Pueblo Mágico', icon: <Home className="w-4 h-4" /> },
      { id: 'tourism', label: 'Turismo, ecoturismo y rutas', icon: <Mountain className="w-4 h-4" /> },
      { id: 'gastronomy', label: 'Gastronomía del Monte', icon: <UtensilsCrossed className="w-4 h-4" /> },
      { id: 'art', label: 'Arte y artesanos', icon: <Palette className="w-4 h-4" /> },
      { id: 'legends', label: 'Historia, mitos y leyendas', icon: <Ghost className="w-4 h-4" /> },
      { id: 'media', label: 'Música y podcast', icon: <Music className="w-4 h-4" /> },
      { id: 'gallery', label: 'Galería compartida', icon: <Images className="w-4 h-4" /> },
      { id: 'map', label: 'Mapa interactivo 2D/3D', icon: <Map className="w-4 h-4" /> },
      { id: 'about', label: 'Quiénes somos', icon: <Users className="w-4 h-4" /> },
    ],
  },
  {
    key: 'comercia',
    order: 'II',
    name: 'Comercia',
    tagline: 'Negocios, pagos y suscripciones',
    accent: '#c89a45',
    icon: <CreditCard className="w-4 h-4" />,
    items: [
      { id: 'business', label: 'Catálogo de negocios', icon: <Store className="w-4 h-4" /> },
      { id: 'marketplace', label: 'Marketplace pastes & plata', icon: <ShoppingBag className="w-4 h-4" /> },
      { id: 'payments', label: 'Pagos, donaciones y suscripciones', icon: <HandCoins className="w-4 h-4" /> },
      { id: 'digital-marketplace', label: 'Marketplace de datos', icon: <Database className="w-4 h-4" /> },
    ],
  },
  {
    key: 'personaliza',
    order: 'III',
    name: 'Personaliza',
    tagline: 'Comunidad, cuenta y gamificación',
    accent: '#d97832',
    icon: <SlidersHorizontal className="w-4 h-4" />,
    items: [
      { id: 'register', label: 'Registro de usuarios y negocios', icon: <UserPlus className="w-4 h-4" /> },
      { id: 'forum', label: 'Foro RDM', icon: <MessagesSquare className="w-4 h-4" /> },
      { id: 'gamification', label: 'Gamificación del Nodo', icon: <Trophy className="w-4 h-4" /> },
      { id: 'zombies', label: 'Zombies RDM Invasion', icon: <Skull className="w-4 h-4" /> },
      { id: 'honor', label: 'Muro de honor', icon: <Award className="w-4 h-4" /> },
    ],
  },
  {
    key: 'gobierna',
    order: 'IV',
    name: 'Gobierna',
    tagline: 'Gemelo digital y Smart City',
    accent: '#536b86',
    icon: <Landmark className="w-4 h-4" />,
    items: [
      { id: 'twins', label: 'Gemelo territorial DTDL', icon: <Box className="w-4 h-4" /> },
      { id: 'city', label: 'Ciudad IOC', icon: <Activity className="w-4 h-4" /> },
      { id: 'grid', label: 'Smart Grid / Agua', icon: <Zap className="w-4 h-4" /> },
      { id: 'eam', label: 'EAM / APM activos', icon: <Cpu className="w-4 h-4" /> },
      { id: 'telemetry', label: 'Telemetría y sensores', icon: <Radio className="w-4 h-4" /> },
      { id: 'security', label: 'Criptografía post-cuántica', icon: <Key className="w-4 h-4" /> },
      { id: 'crown-gateway', label: 'CROWN Gateway · IA federada', icon: <Network className="w-4 h-4" /> },
    ],
  },
];

export default function YUNLayout({
  children,
  activeView,
  setActiveView,
  selectedNode,
  onSelectNode,
  onOpenIsabella,
}: YUNLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openPlano, setOpenPlano] = useState<string>('descubre');
  const [coresOpen, setCoresOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNodes = searchQuery.trim()
    ? RDM_NODES_35.filter(
        n =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const activePlano = PLANOS.find(p => p.items.some(i => i.id === activeView));

  return (
    <div className="min-h-screen text-[#283038] font-sans flex flex-col">

      {/* ============ TOP NAVBAR — cristal perlado ============ */}
      <header className="h-16 w-full fixed top-0 z-40 px-4 md:px-8 flex items-center justify-between border-b border-[#c9d0d4]/70 bg-[rgba(251,252,250,0.82)] backdrop-blur-xl shadow-[0_8px_30px_rgba(13,70,82,0.06)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-[#0d4652] hover:bg-[#0d4652]/8 transition-all"
            title="Alternar navegación"
            aria-label="Alternar navegación"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button onClick={() => setActiveView('home')} className="flex items-center gap-3 group text-left">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#c9d0d4] via-[#f2cc76] to-[#2e9cff] p-0.5 shadow-[0_6px_20px_rgba(13,70,82,0.16)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#082f3b] rounded-[10px] flex items-center justify-center font-black text-xs text-white">
                RDM
              </div>
            </div>
            <div>
              <h1 className="font-patrimonial text-sm font-bold tracking-wider text-[#082f3b] flex items-center gap-1.5">
                RDM DIGITAL HUB
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0d4652] text-[#f2cc76] border border-[#c89a45]/40">
                  NODO CERO
                </span>
              </h1>
              <p className="text-[10px] text-[#536b86] font-mono tracking-tight hidden sm:block">
                Pueblo Mágico de Real del Monte · Hidalgo
              </p>
            </div>
          </button>
        </div>

        {/* Indicadores en vivo */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-[#c9d0d4]/80 text-[#0d4652]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Territorio en vivo</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-[#c9d0d4]/80 text-[#536b86]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Isabella AI</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-[#c9d0d4]/80 text-[#a9481e]">
            <Lock className="w-3.5 h-3.5" />
            <span>Post-Quantum</span>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('register')}
            className="crystal-button crystal-button-gold px-3.5 py-1.5 text-xs font-bold"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Únete</span>
          </button>
          <button onClick={onOpenIsabella} className="crystal-button px-3.5 py-1.5 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#0d4652]" />
            <span className="hidden sm:inline">Isabella AI</span>
          </button>
        </div>
      </header>

      {/* ============ CUERPO: SIDEBAR + VISTA ============ */}
      <div className="flex pt-16 h-screen overflow-hidden relative">

        {/* SIDEBAR DE 4 PLANOS */}
        <aside
          className={`h-full flex flex-col justify-between transition-all duration-300 z-30 border-r border-[#c9d0d4]/70 bg-[rgba(255,255,255,0.72)] backdrop-blur-xl ${
            sidebarOpen ? 'w-80' : 'w-16'
          }`}
        >
          <div className="p-3 space-y-3 overflow-y-auto custom-scrollbar flex-1">

            {sidebarOpen && (
              <div className="relative">
                <Search className="w-4 h-4 text-[#536b86] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar en los 35 nodos…"
                  className="w-full bg-white/80 border border-[#c9d0d4] focus:border-[#2e9cff] rounded-xl pl-9 pr-3 py-2 text-xs text-[#283038] placeholder-[#8a97a4] focus:outline-none transition-all font-mono"
                />
              </div>
            )}

            {sidebarOpen && searchQuery.trim().length > 0 && (
              <div className="p-2 rounded-xl bg-white/90 border border-[#2e9cff]/40 space-y-1 max-h-60 overflow-y-auto shadow-sm">
                <div className="text-[10px] font-mono text-[#0d4652] px-2 py-1 uppercase">
                  Nodos encontrados ({filteredNodes.length})
                </div>
                {filteredNodes.map(node => (
                  <button
                    key={node.id}
                    onClick={() => { onSelectNode(node); setSearchQuery(''); }}
                    className="w-full p-2 rounded-lg hover:bg-[#eef1ec] text-left text-xs transition-all flex items-center justify-between"
                  >
                    <span className="font-medium text-[#082f3b] truncate">{node.title}</span>
                    <span className="text-[9px] font-mono text-[#2e9cff]">{node.code}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Acordeón de los 4 planos */}
            <nav className="space-y-2" aria-label="Navegación por planos">
              {PLANOS.map(plano => {
                const isOpen = sidebarOpen && openPlano === plano.key;
                const hasActive = plano.items.some(i => i.id === activeView);
                return (
                  <div
                    key={plano.key}
                    className="rounded-2xl border border-[#c9d0d4]/60 bg-white/55 overflow-hidden"
                    style={hasActive ? { borderColor: plano.accent, boxShadow: `0 10px 30px ${plano.accent}1f` } : undefined}
                  >
                    <button
                      onClick={() => (sidebarOpen ? setOpenPlano(isOpen ? '' : plano.key) : setSidebarOpen(true))}
                      className="w-full p-3 flex items-center justify-between text-left transition-all hover:bg-white/70"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                          style={{ background: plano.accent }}
                        >
                          {plano.icon}
                        </span>
                        {sidebarOpen && (
                          <span className="min-w-0">
                            <span className="flex items-center gap-1.5">
                              <span className="font-rdm-mono text-[9px] tracking-widest" style={{ color: plano.accent }}>
                                PLANO {plano.order}
                              </span>
                            </span>
                            <span className="block font-patrimonial text-sm font-bold text-[#082f3b] leading-tight truncate">
                              {plano.name}
                            </span>
                            <span className="block text-[10px] text-[#536b86] truncate">{plano.tagline}</span>
                          </span>
                        )}
                      </div>
                      {sidebarOpen && (
                        <ChevronDown
                          className="w-4 h-4 shrink-0 transition-transform"
                          style={{ color: plano.accent, transform: isOpen ? 'rotate(180deg)' : 'none' }}
                        />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-2 pb-2 space-y-1 border-t border-[#c9d0d4]/50 pt-2">
                        {plano.items.map(item => {
                          const active = activeView === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => setActiveView(item.id)}
                              className="w-full p-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all"
                              style={
                                active
                                  ? { background: `${plano.accent}14`, color: plano.accent, border: `1px solid ${plano.accent}55` }
                                  : { color: '#3c4750' }
                              }
                              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#eef1ec'; }}
                              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                            >
                              <span style={{ color: active ? plano.accent : '#7c8894' }}>{item.icon}</span>
                              <span className="truncate text-left">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Arquitectura heptafederada (nodos técnicos) — dentro de Gobierna */}
            {sidebarOpen && (
              <div className="rounded-2xl border border-[#c9d0d4]/60 bg-white/55 overflow-hidden">
                <button
                  onClick={() => setCoresOpen(!coresOpen)}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-white/70 transition-all"
                  aria-expanded={coresOpen}
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-[#536b86]" />
                    <span className="font-rdm-mono text-[10px] uppercase tracking-widest text-[#536b86]">
                      7 Núcleos heptafederados
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#536b86] transition-transform ${coresOpen ? 'rotate-180' : ''}`} />
                </button>
                {coresOpen && (
                  <div className="p-2 space-y-1 border-t border-[#c9d0d4]/50">
                    {YUN_CORES.map(core => {
                      const coreNodes = RDM_NODES_35.filter(n => n.coreId === core.id);
                      return (
                        <details key={core.id} className="rounded-lg bg-[#f7f8f5]/70">
                          <summary className="cursor-pointer p-2 text-[11px] font-bold text-[#0d4652] flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#c89a45]" />
                            <span className="truncate">{core.name}</span>
                          </summary>
                          <div className="p-1 space-y-1">
                            {coreNodes.map(node => (
                              <button
                                key={node.id}
                                onClick={() => onSelectNode(node)}
                                className={`w-full p-2 rounded-lg text-left text-[11px] font-mono transition-all flex items-center justify-between ${
                                  selectedNode?.id === node.id
                                    ? 'bg-[#e6eef1] text-[#0d4652] border border-[#2e9cff]/40 font-bold'
                                    : 'text-[#536b86] hover:text-[#082f3b] hover:bg-white'
                                }`}
                              >
                                <span className="truncate pr-2">{node.title}</span>
                                <span className="text-[9px] text-[#2e9cff] shrink-0">{node.code}</span>
                              </button>
                            ))}
                          </div>
                        </details>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer del sidebar */}
          <div className="p-3 border-t border-[#c9d0d4]/70 bg-white/60 flex items-center justify-between">
            {sidebarOpen && (
              <span className="text-[10px] font-mono text-[#8a97a4]">RDM v3.0 · Soberano</span>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-[#0d4652]/8 text-[#536b86] hover:text-[#0d4652] transition-all mx-auto"
              aria-label="Colapsar navegación"
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </aside>

        {/* VISTA PRINCIPAL */}
        <main className="flex-1 overflow-y-auto relative custom-scrollbar">
          {/* Barra de contexto: plano activo */}
          {activePlano && activeView !== 'home' && (
            <div className="sticky top-0 z-20 px-6 md:px-10 py-2.5 border-b border-[#c9d0d4]/60 bg-[rgba(251,252,250,0.85)] backdrop-blur-md">
              <div className="max-w-7xl mx-auto flex items-center gap-2 text-[11px] font-mono">
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-md text-white text-[9px] font-bold"
                  style={{ background: activePlano.accent }}
                >
                  {activePlano.order}
                </span>
                <span className="font-semibold" style={{ color: activePlano.accent }}>
                  Plano {activePlano.order} · {activePlano.name}
                </span>
                <ChevronRight className="w-3 h-3 text-[#8a97a4]" />
                <span className="text-[#536b86]">
                  {activePlano.items.find(i => i.id === activeView)?.label}
                </span>
              </div>
            </div>
          )}

          {children}

          {/* Footer institucional perlado */}
          <footer className="mt-16 border-t border-[#c9d0d4]/70 bg-white/55 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-6 md:px-10 py-12">
              <div className="grid gap-10 md:grid-cols-3">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#c9d0d4] via-[#f2cc76] to-[#2e9cff] p-px">
                      <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#082f3b] font-black text-xs text-white">
                        RDM
                      </div>
                    </div>
                    <div>
                      <p className="font-patrimonial text-sm font-bold tracking-wide text-[#082f3b]">
                        RDM Digital Hub — Nodo Cero
                      </p>
                      <p className="font-rdm-mono text-[10px] tracking-widest text-[#8a97a4]">
                        REAL DEL MONTE · HIDALGO · MÉXICO
                      </p>
                    </div>
                  </div>
                  <p className="max-w-xs text-xs leading-relaxed text-[#536b86]">
                    Plataforma territorial del Pueblo Mágico: turismo, cultura, comercio, comunidad y
                    gemelo digital, unidos en cuatro planos de una misma identidad.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="font-rdm-mono text-[10px] uppercase tracking-widest text-[#c89a45]">
                    Los 4 planos
                  </p>
                  <ul className="space-y-1.5 text-[#536b86]">
                    <li>I · Descubre — turismo y patrimonio</li>
                    <li>II · Comercia — pagos y suscripciones</li>
                    <li>III · Personaliza — comunidad y cuenta</li>
                    <li>IV · Gobierna — gemelo digital y ciudad</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <p className="font-rdm-mono text-[10px] uppercase tracking-widest text-[#c89a45]">
                    Autoría
                  </p>
                  <p className="font-editorial text-2xl font-medium leading-tight text-[#082f3b]">
                    Anubis Villaseñor
                  </p>
                  <p className="text-xs leading-relaxed text-[#536b86]">
                    Founder · Architect · Cognitive Systems
                    <br />
                    Sistemas territoriales · Inteligencia cognitiva
                    <br />
                    Gobernanza digital · Experiencias inmersivas
                  </p>
                  <p className="font-rdm-mono text-[10px] text-[#8a97a4]">
                    TAMV Online Network / OsoPanda1 · RDM Digital Hub
                  </p>
                </div>
              </div>

              <hr className="rdm-divider my-8" />

              <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                <span className="text-xs text-[#8a97a4]">
                  © {new Date().getFullYear()} TAMV Online Network · RDM Digital Hub — Nodo Cero
                </span>
                <span className="font-rdm-mono text-xs text-[#8a97a4]">
                  Comarca Minera · Real del Monte · Hidalgo · México
                </span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

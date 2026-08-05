"use client";

import React, { useState } from 'react';
import { YUN_CORES, RDM_NODES_35, YUNNode } from '@/lib/data/rdm-data';
import { 
  Cpu, ShieldCheck, Box, Activity, Store, UserCheck, Globe, 
  ChevronRight, ChevronDown, Search, Menu, X, Radio, Sparkles, 
  Map, Database, Key, ShoppingBag, ArrowUpRight, Lock, Zap,
  Palette, UtensilsCrossed, Trophy, Ghost, MessagesSquare, Award, Images, Users, Skull, Network
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

export default function YUNLayout({
  children,
  activeView,
  setActiveView,
  selectedNode,
  onSelectNode,
  onOpenIsabella,
  isabellaOpen,
}: YUNLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openCoreId, setOpenCoreId] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState('');

  const coreIcons: Record<number, React.ReactNode> = {
    1: <Cpu className="w-4 h-4 text-cyan-400" />,
    2: <ShieldCheck className="w-4 h-4 text-purple-400" />,
    3: <Box className="w-4 h-4 text-amber-400" />,
    4: <Activity className="w-4 h-4 text-emerald-400" />,
    5: <Store className="w-4 h-4 text-rose-400" />,
    6: <UserCheck className="w-4 h-4 text-violet-400" />,
    7: <Globe className="w-4 h-4 text-blue-400" />,
  };

  const filteredNodes = searchQuery.trim()
    ? RDM_NODES_35.filter(
        n =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-[#04060a] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-white overflow-hidden flex flex-col">
      
      {/* ELEGANT TOP CRYSTAL NAVBAR */}
      <header className="h-16 w-full glass-panel border-b border-white/10 fixed top-0 z-40 px-4 md:px-8 flex items-center justify-between backdrop-blur-xl bg-slate-950/80 shadow-lg">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-all md:flex"
            title="Alternar Menú Inteligente"
          >
            <Menu className="w-5 h-5 text-cyan-400" />
          </button>

          <button
            onClick={() => {
              setActiveView('home');
            }}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-500 to-amber-400 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-xs text-white">
                RDM
              </div>
            </div>

            <div>
              <h1 className="text-sm font-black tracking-wider text-white flex items-center gap-1.5">
                RDM DIGITAL HUB
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  NODO CERO
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
                Sistema de Inteligencia Territorial // Real del Monte, Hidalgo
              </p>
            </div>
          </button>
        </div>

        {/* Live Status Indicators */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Sincronización: 99.9%</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-purple-500/30 text-purple-300">
            <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Isabella AI Online</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-amber-500/30 text-amber-300">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Post-Quantum Dilithium</span>
          </div>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenIsabella}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span className="hidden sm:inline">Isabella AI</span>
          </button>
        </div>

      </header>

      {/* BODY MAIN CONTAINER WITH SIDEBAR & VIEW */}
      <div className="flex pt-16 h-screen overflow-hidden relative">
        
        {/* INTELLIGENT ACCORDION SIDEBAR */}
        <aside
          className={`glass-panel border-r border-white/10 bg-slate-950/90 backdrop-blur-xl h-full flex flex-col justify-between transition-all duration-300 z-30 ${
            sidebarOpen ? 'w-80' : 'w-16'
          }`}
        >
          {/* Top Section: Search & Quick Views */}
          <div className="p-3 space-y-3 overflow-y-auto custom-scrollbar flex-1">
            
            {/* Search Input when expanded */}
            {sidebarOpen && (
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar en los 35 Nodos..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-mono"
                />
              </div>
            )}

            {/* Search Results Dropdown */}
            {sidebarOpen && searchQuery.trim().length > 0 && (
              <div className="p-2 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-1 max-h-60 overflow-y-auto">
                <div className="text-[10px] font-mono text-cyan-400 px-2 py-1 uppercase">
                  Nodos Encontrados ({filteredNodes.length})
                </div>
                {filteredNodes.map(node => (
                  <button
                    key={node.id}
                    onClick={() => {
                      onSelectNode(node);
                      setSearchQuery('');
                    }}
                    className="w-full p-2 rounded-lg hover:bg-slate-800 text-left text-xs transition-all flex items-center justify-between"
                  >
                    <span className="font-medium text-white truncate">{node.title}</span>
                    <span className="text-[9px] font-mono text-cyan-300">{node.code}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Quick Navigation Menu */}
            <div className="space-y-1">
              {[
                { id: 'home', label: 'Inicio / Trailer AAA', icon: <Radio className="w-4 h-4 text-cyan-400" /> },
                { id: 'tourism', label: 'Turismo y Eventos', icon: <Map className="w-4 h-4 text-rose-400" /> },
                { id: 'map', label: 'Gemelo Digital 2D/3D', icon: <Map className="w-4 h-4 text-amber-400" /> },
                { id: 'marketplace', label: 'Marketplace Pastes & Plata', icon: <ShoppingBag className="w-4 h-4 text-rose-400" /> },
                { id: 'telemetry', label: 'Telemetría y Sensores', icon: <Activity className="w-4 h-4 text-emerald-400" /> },
                { id: 'security', label: 'Criptografía Post-Cuántica', icon: <Key className="w-4 h-4 text-purple-400" /> },
                { id: 'art', label: 'Arte y Artesanos', icon: <Palette className="w-4 h-4 text-orange-400" /> },
                { id: 'gastronomy', label: 'Gastronomía del Monte', icon: <UtensilsCrossed className="w-4 h-4 text-rose-400" /> },
                { id: 'business', label: 'Portal de Comercios', icon: <Store className="w-4 h-4 text-amber-400" /> },
                { id: 'media', label: 'Música y Podcast', icon: <Radio className="w-4 h-4 text-purple-400" /> },
                { id: 'gamification', label: 'Gamificación del Nodo', icon: <Trophy className="w-4 h-4 text-amber-400" /> },
                { id: 'zombies', label: 'Zombies RDM Invasion', icon: <Skull className="w-4 h-4 text-emerald-400" /> },
                { id: 'legends', label: 'Mitos y Leyendas', icon: <Ghost className="w-4 h-4 text-purple-400" /> },
                { id: 'forum', label: 'Foro RDM', icon: <MessagesSquare className="w-4 h-4 text-cyan-400" /> },
                { id: 'honor', label: 'Muro de Honor', icon: <Award className="w-4 h-4 text-amber-400" /> },
                { id: 'gallery', label: 'Galería Compartida', icon: <Images className="w-4 h-4 text-emerald-400" /> },
                { id: 'crown-gateway', label: 'CROWN Gateway · IA Federada', icon: <Network className="w-4 h-4 text-cyan-400" /> },
                { id: 'twins', label: 'Gemelo Territorial DTDL', icon: <Box className="w-4 h-4 text-emerald-400" /> },
                { id: 'city', label: 'Ciudad IOC', icon: <Activity className="w-4 h-4 text-red-400" /> },
                { id: 'eam', label: 'EAM / APM Activos', icon: <Zap className="w-4 h-4 text-amber-400" /> },
                { id: 'grid', label: 'Smart Grid / Agua', icon: <Zap className="w-4 h-4 text-sky-400" /> },
                { id: 'digital-marketplace', label: 'Marketplace de Datos', icon: <Database className="w-4 h-4 text-emerald-400" /> },
                { id: 'about', label: 'Quiénes Somos', icon: <Users className="w-4 h-4 text-blue-400" /> },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                    activeView === item.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </button>
              ))}
            </div>

            {/* YUN HEPTAFEDERATED ACCORDION CORES */}
            {sidebarOpen && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 px-2">
                  Arquitectura Heptafederada (7 Núcleos)
                </div>

                {YUN_CORES.map(core => {
                  const coreNodes = RDM_NODES_35.filter(n => n.coreId === core.id);
                  const isOpen = openCoreId === core.id;

                  return (
                    <div key={core.id} className="rounded-xl border border-white/5 bg-slate-900/40 overflow-hidden">
                      <button
                        onClick={() => setOpenCoreId(isOpen ? null : core.id)}
                        className={`w-full p-2.5 flex items-center justify-between text-left text-xs font-bold transition-all ${
                          isOpen ? 'bg-slate-800/80 text-white' : 'text-slate-300 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {coreIcons[core.id]}
                          <span className="truncate">{core.name}</span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : 'text-slate-500'}`} />
                      </button>

                      {/* Accordion Node Items */}
                      {isOpen && (
                        <div className="p-1 bg-slate-950/80 space-y-1 border-t border-white/5">
                          {coreNodes.map(node => (
                            <button
                              key={node.id}
                              onClick={() => onSelectNode(node)}
                              className={`w-full p-2 rounded-lg text-left text-[11px] font-mono transition-all flex items-center justify-between ${
                                selectedNode?.id === node.id
                                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold'
                                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
                              }`}
                            >
                              <span className="truncate pr-2">{node.title}</span>
                              <span className="text-[9px] text-cyan-400 shrink-0">{node.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Footer Collapse Control */}
          <div className="p-3 border-t border-white/10 bg-slate-950 flex items-center justify-between">
            {sidebarOpen && (
              <span className="text-[10px] font-mono text-slate-500">
                RDM v2.0.0 // Sovereign
              </span>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all mx-auto"
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

        </aside>

        {/* MAIN VIEW CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-transparent relative custom-scrollbar">
          {children}
        </main>

      </div>

    </div>
  );
}

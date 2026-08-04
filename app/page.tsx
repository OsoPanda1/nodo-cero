"use client";

import React, { useState } from 'react';
import YUNLayout from '@/components/layout/YUNLayout';
import CrystalHero3D from '@/components/3d/CrystalHero3D';
import DigitalTwinMap from '@/components/map/DigitalTwinMap';
import IsabellaChat from '@/components/isabella/IsabellaChat';
import TelemetryDashboard from '@/components/telemetry/TelemetryDashboard';
import PhygitalMarketplace from '@/components/phygital/PhygitalMarketplace';
import PostQuantumSecurity from '@/components/security/PostQuantumSecurity';
import NodeDetailView from '@/components/nodes/NodeDetailView';
import TourismSection from '@/components/tourism/TourismSection';
import ArtSection from '@/components/art/ArtSection';
import GastronomySection from '@/components/gastronomy/GastronomySection';
import BusinessPortal from '@/components/business/BusinessPortal';
import MediaSection from '@/components/media/MediaSection';
import GamificationSection from '@/components/gamification/GamificationSection';
import LegendsSection from '@/components/legends/LegendsSection';
import ForumSection from '@/components/forum/ForumSection';
import HonorWallSection from '@/components/honor/HonorWallSection';
import GallerySection from '@/components/gallery/GallerySection';
import AboutSection from '@/components/about/AboutSection';
import { YUN_CORES, RDM_NODES_35, YUNNode, RDM_POIS } from '@/lib/data/rdm-data';
import { 
  Cpu, ShieldCheck, Box, Activity, Store, UserCheck, Globe, 
  Sparkles, ArrowRight, Radio, MapPin, CheckCircle2, Zap, Lock
} from 'lucide-react';

export default function RDMDigitalHubHome() {
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedNode, setSelectedNode] = useState<YUNNode | null>(null);
  const [isabellaOpen, setIsabellaOpen] = useState<boolean>(false);
  const [isabellaInitialPrompt, setIsabellaInitialPrompt] = useState<string>('');

  const handleOpenIsabellaWithPrompt = (prompt: string) => {
    setIsabellaInitialPrompt(prompt);
    setIsabellaOpen(true);
  };

  const handleSelectNode = (node: YUNNode) => {
    setSelectedNode(node);
    setActiveView('node-detail');
  };

  return (
    <YUNLayout
      activeView={activeView}
      setActiveView={view => {
        setActiveView(view);
        if (view !== 'node-detail') setSelectedNode(null);
      }}
      selectedNode={selectedNode}
      onSelectNode={handleSelectNode}
      onOpenIsabella={() => setIsabellaOpen(true)}
      isabellaOpen={isabellaOpen}
    >
      {/* 1. NODE DETAIL VIEW */}
      {activeView === 'node-detail' && selectedNode && (
        <NodeDetailView
          node={selectedNode}
          onBack={() => setActiveView('home')}
          onOpenIsabella={() => setIsabellaOpen(true)}
        />
      )}

      {/* 2. MAP VIEW */}
      {activeView === 'map' && (
        <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Box className="w-6 h-6 text-cyan-400" />
              Gemelo Digital 2D/3D & Cartografía Phygital
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Representación en tiempo real del distrito minero de Real del Monte, Hidalgo.
            </p>
          </div>
          <DigitalTwinMap />
        </div>
      )}

      {/* 3. TOURISM VIEW */}
      {activeView === 'tourism' && (
        <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
          <TourismSection />
        </div>
      )}

      {/* 4. MARKETPLACE VIEW */}
      {activeView === 'marketplace' && (
        <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
          <PhygitalMarketplace />
        </div>
      )}

      {/* 5. TELEMETRY VIEW */}
      {activeView === 'telemetry' && (
        <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
          <TelemetryDashboard />
        </div>
      )}

      {/* 6. SECURITY VIEW */}
      {activeView === 'security' && (
        <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
          <PostQuantumSecurity />
        </div>
      )}

      {/* 7. ART VIEW */}
      {activeView === 'art' && (
        <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
          <ArtSection />
        </div>
      )}

      {/* 8. GASTRONOMY VIEW */}
      {activeView === 'gastronomy' && (
        <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
          <GastronomySection />
        </div>
      )}

      {/* 9. BUSINESS VIEW */}
      {activeView === 'business' && (
        <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
          <BusinessPortal />
        </div>
      )}

      {/* 10. MEDIA VIEW */}
      {activeView === 'media' && (
        <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
          <MediaSection />
        </div>
      )}

      {/* 11. GAMIFICATION VIEW */}
      {activeView === 'gamification' && (
        <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
          <GamificationSection />
        </div>
      )}

      {/* 12. LEGENDS VIEW */}
      {activeView === 'legends' && (
        <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
          <LegendsSection />
        </div>
      )}

      {/* 13. FORUM VIEW */}
      {activeView === 'forum' && (
        <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
          <ForumSection />
        </div>
      )}

      {/* 14. HONOR VIEW */}
      {activeView === 'honor' && (
        <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
          <HonorWallSection />
        </div>
      )}

      {/* 15. GALLERY VIEW */}
      {activeView === 'gallery' && (
        <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
          <GallerySection />
        </div>
      )}

      {/* 16. ABOUT VIEW */}
      {activeView === 'about' && (
        <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
          <AboutSection />
        </div>
      )}

      {/* 17. MAIN HOME VIEW */}
      {activeView === 'home' && (
        <div className="space-y-16 pb-20">
          
          {/* Hero Section with WebGL Crystal 3D & Trailer AAA Simulation */}
          <CrystalHero3D
            onOpenIsabella={() => setIsabellaOpen(true)}
            onSelectNode={nodeId => {
              const found = RDM_NODES_35.find(n => n.id === nodeId);
              if (found) handleSelectNode(found);
            }}
          />

          {/* Stats Band: RDM in Numbers */}
          <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '35', label: 'Nodos YUN Soberanos', sub: '7 Núcleos Heptafederados', color: 'text-cyan-400 border-cyan-500/30' },
                { value: '15', label: 'Puntos de Interés Phygital', sub: 'Minas, templos y miradores', color: 'text-amber-400 border-amber-500/30' },
                { value: '500', label: 'Años de Historia', sub: 'De la Real de Minas a 2026', color: 'text-rose-400 border-rose-500/30' },
                { value: '4.9', label: 'Rating Turístico', sub: 'Pueblo Mágico certificado', color: 'text-emerald-400 border-emerald-500/30' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl glass-panel border ${stat.color} text-center shadow-[0_0_30px_rgba(6,182,212,0.1)]`}
                >
                  <div className={`text-3xl sm:text-4xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-xs font-mono font-bold text-white mt-1">{stat.label}</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: The 7 Cores of Heptafederated YUN Architecture */}
          <section className="max-w-7xl mx-auto px-6 space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-400">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                ARQUITECTURA HEPTAFEDERADA YUN
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                7 Núcleos Soberanos para el Territorio
              </h2>
              <p className="text-sm text-slate-300 font-light">
                Un sistema operativo descentralizado que trata a Real del Monte como una plataforma inteligente viva, resguardada con criptografía post-cuántica y gemelo digital.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {YUN_CORES.map(core => {
                const coreNodesCount = RDM_NODES_35.filter(n => n.coreId === core.id).length;

                return (
                  <div
                    key={core.id}
                    className="group p-6 rounded-2xl glass-panel-interactive border border-white/10 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-500/30">
                          Núcleo {core.id}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {coreNodesCount} Nodos Activos
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {core.name}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed font-light">
                        {core.subtitle}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const firstCoreNode = RDM_NODES_35.find(n => n.coreId === core.id);
                        if (firstCoreNode) handleSelectNode(firstCoreNode);
                      }}
                      className="pt-3 border-t border-white/10 text-xs font-mono font-semibold text-cyan-400 hover:text-white flex items-center justify-between transition-colors"
                    >
                      <span>Explorar Nodos del Núcleo</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section: Tourism & Events */}
          <section className="max-w-7xl mx-auto px-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-white">
                  Turismo del Real: Eventos, Rutas y Tradiciones
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Feria del Paste, Semana Cornish, rutas mineras y los dichos que cuentan el alma del pueblo
                </p>
              </div>

              <button
                onClick={() => setActiveView('tourism')}
                className="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-mono font-bold transition-all flex items-center gap-2"
              >
                <span>Explorar Turismo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <TourismSection />
          </section>

          {/* Section: Interactive Digital Twin Preview */}
          <section className="max-w-7xl mx-auto px-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-white">
                  Gemelo Digital Phygital 2D/3D
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Mapeo en vivo de minas históricas, pastelerías de Cornwall y sensores del monte
                </p>
              </div>

              <button
                onClick={() => setActiveView('map')}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono font-bold transition-all flex items-center gap-2"
              >
                <span>Abrir Mapa Completo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <DigitalTwinMap />
          </section>

          {/* Section: Phygital Marketplace Showcase */}
          <section className="max-w-7xl mx-auto px-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-white">
                  Economía Phygital: Pastes & Platería Ley .925
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Comercio justo verificado con sello criptográfico inmutable
                </p>
              </div>

              <button
                onClick={() => setActiveView('marketplace')}
                className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-mono font-bold transition-all flex items-center gap-2"
              >
                <span>Ir al Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <PhygitalMarketplace />
          </section>

          {/* Section: Live Telemetry & Security Summary */}
          <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Telemetría Urbana
              </h3>
              <TelemetryDashboard />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-400" />
                Seguridad Post-Cuántica
              </h3>
              <PostQuantumSecurity />
            </div>
          </section>

        </div>
      )}

      {/* FLOATING ISABELLA AI CHAT ASSISTANT */}
      <IsabellaChat
        isOpen={isabellaOpen}
        onClose={() => setIsabellaOpen(false)}
        initialPrompt={isabellaInitialPrompt}
      />
    </YUNLayout>
  );
}

"use client";

import React, { useState } from "react";
import YUNLayout from "@/components/layout/YUNLayout";
import CrystalHero3D from "@/components/3d/CrystalHero3D";
import DigitalTwinMap from "@/components/map/DigitalTwinMap";
import IsabellaChat from "@/components/isabella/IsabellaChat";
import TelemetryDashboard from "@/components/telemetry/TelemetryDashboard";
import PhygitalMarketplace from "@/components/phygital/PhygitalMarketplace";
import PostQuantumSecurity from "@/components/security/PostQuantumSecurity";
import NodeDetailView from "@/components/nodes/NodeDetailView";
import TourismSection from "@/components/tourism/TourismSection";
import ArtSection from "@/components/art/ArtSection";
import GastronomySection from "@/components/gastronomy/GastronomySection";
import BusinessPortal from "@/components/business/BusinessPortal";
import MediaSection from "@/components/media/MediaSection";
import GamificationSection from "@/components/gamification/GamificationSection";
import ZombiesInvasionSection from "@/components/gamification/ZombiesInvasionSection";
import LegendsSection from "@/components/legends/LegendsSection";
import ForumSection from "@/components/forum/ForumSection";
import HonorWallSection from "@/components/honor/HonorWallSection";
import GallerySection from "@/components/gallery/GallerySection";
import AboutSection from "@/components/about/AboutSection";
import CrownGatewaySection from "@/components/gateway/CrownGatewaySection";
import { YUN_CORES, RDM_NODES_35, YUNNode } from "@/lib/data/rdm-data";
import { Box, Activity, ArrowRight, Radio, Lock } from "lucide-react";

export default function RDMDigitalHubHome() {
  const [activeView, setActiveView] = useState<string>("home");
  const [selectedNode, setSelectedNode] = useState<YUNNode | null>(null);
  const [isabellaOpen, setIsabellaOpen] = useState<boolean>(false);
  const [isabellaInitialPrompt, setIsabellaInitialPrompt] = useState<string>("");

  const handleOpenIsabellaWithPrompt = (prompt: string) => {
    setIsabellaInitialPrompt(prompt);
    setIsabellaOpen(true);
  };

  const handleSelectNode = (node: YUNNode) => {
    setSelectedNode(node);
    setActiveView("node-detail");
  };

  return (
    <YUNLayout
      activeView={activeView}
      setActiveView={(view) => {
        setActiveView(view);
        if (view !== "node-detail") setSelectedNode(null);
      }}
      selectedNode={selectedNode}
      onSelectNode={handleSelectNode}
      onOpenIsabella={() => setIsabellaOpen(true)}
      isabellaOpen={isabellaOpen}
    >
      {/* 1. NODE DETAIL VIEW */}
      {activeView === "node-detail" && selectedNode && (
        <NodeDetailView
          node={selectedNode}
          onBack={() => setActiveView("home")}
          onOpenIsabella={() => setIsabellaOpen(true)}
        />
      )}

      {/* 2. MAP VIEW */}
      {activeView === "map" && (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
          <header className="space-y-1">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <Box className="w-6 h-6 text-cyan-400" />
              Gemelo Digital 2D/3D · Cartografía Phygital
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Vista táctica del distrito minero de Real del Monte, integrada al sistema de nodos YUN.
            </p>
          </header>
          <DigitalTwinMap />
        </div>
      )}

      {/* 3. TOURISM VIEW */}
      {activeView === "tourism" && (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
          <TourismSection />
        </div>
      )}

      {/* 4. MARKETPLACE VIEW */}
      {activeView === "marketplace" && (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
          <PhygitalMarketplace />
        </div>
      )}

      {/* 5. TELEMETRY VIEW */}
      {activeView === "telemetry" && (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
          <TelemetryDashboard />
        </div>
      )}

      {/* 6. SECURITY VIEW */}
      {activeView === "security" && (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
          <PostQuantumSecurity />
        </div>
      )}

      {/* 7. ART VIEW */}
      {activeView === "art" && (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
          <ArtSection />
        </div>
      )}

      {/* 8. GASTRONOMY VIEW */}
      {activeView === "gastronomy" && (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
          <GastronomySection />
        </div>
      )}

      {/* 9. BUSINESS VIEW */}
      {activeView === "business" && (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
          <BusinessPortal />
        </div>
      )}

      {/* 10. MEDIA VIEW */}
      {activeView === "media" && (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
          <MediaSection />
        </div>
      )}

      {/* 11. GAMIFICATION VIEW */}
      {activeView === "gamification" && (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
          <GamificationSection />
        </div>
      )}

      {/* 11b. ZOMBIES RDM INVASION VIEW */}
      {activeView === "zombies" && (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
          <ZombiesInvasionSection onAskIsabella={handleOpenIsabellaWithPrompt} />
        </div>
      )}

      {/* 12. LEGENDS VIEW */}
      {activeView === "legends" && (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
          <LegendsSection />
        </div>
      )}

      {/* 13. FORUM VIEW */}
      {activeView === "forum" && (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
          <ForumSection />
        </div>
      )}

      {/* 14. HONOR VIEW */}
      {activeView === "honor" && (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
          <HonorWallSection />
        </div>
      )}

      {/* 15. GALLERY VIEW */}
      {activeView === "gallery" && (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
          <GallerySection />
        </div>
      )}

      {/* 15b. CROWN GATEWAY VIEW */}
      {activeView === 'crown-gateway' && (
        <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
          <CrownGatewaySection />
        </div>
      )}

      {/* 16. ABOUT VIEW */}
      {activeView === "about" && (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
          <AboutSection />
        </div>
      )}

      {/* 17. MAIN HOME VIEW — dashboard territorial sobrio */}
      {activeView === "home" && (
        <div className="space-y-16 pb-20">
          {/* Hero: WebGL Crystal + narrativa del nodo */}
          <CrystalHero3D
            onOpenIsabella={() => setIsabellaOpen(true)}
            onSelectNode={(nodeId) => {
              const found = RDM_NODES_35.find((n) => n.id === nodeId);
              if (found) handleSelectNode(found);
            }}
          />

          {/* Banda de indicadores clave del territorio */}
          <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  value: "35",
                  label: "Nodos YUN soberanos",
                  sub: "7 núcleos heptafederados",
                  color: "text-cyan-400 border-cyan-500/30",
                },
                {
                  value: "15",
                  label: "Puntos de interés phygital",
                  sub: "Minas, templos y miradores",
                  color: "text-amber-400 border-amber-500/30",
                },
                {
                  value: "500",
                  label: "Años de historia",
                  sub: "De la Real de Minas a 2026",
                  color: "text-rose-400 border-rose-500/30",
                },
                {
                  value: "4.9",
                  label: "Índice turístico",
                  sub: "Pueblo Mágico certificado",
                  color: "text-emerald-400 border-emerald-500/30",
                },
              ].map((stat, idx) => (
                <article
                  key={idx}
                  className={`p-5 rounded-2xl glass-panel border ${stat.color} text-center shadow-[0_0_28px_rgba(6,182,212,0.1)]`}
                >
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-mono font-semibold text-white">
                    {stat.label}
                  </div>
                  <div className="mt-0.5 text-[10px] font-mono text-slate-400">
                    {stat.sub}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Núcleos YUN — arquitectura heptafederada */}
          <section className="max-w-7xl mx-auto px-6 space-y-8">
            <header className="max-w-3xl mx-auto text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-400">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                ARQUITECTURA HEPTAFEDERADA YUN
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                Siete núcleos soberanos para el territorio
              </h2>
              <p className="text-sm text-slate-300 font-light">
                Cada núcleo gobierna un conjunto de nodos YUN que articulan
                historia, economía, seguridad y gemelo digital en tiempo real.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {YUN_CORES.map((core) => {
                const coreNodesCount = RDM_NODES_35.filter(
                  (n) => n.coreId === core.id,
                ).length;

                return (
                  <article
                    key={core.id}
                    className="group p-6 rounded-2xl glass-panel-interactive border border-white/10 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-500/30">
                          Núcleo {core.id}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {coreNodesCount} nodos activos
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {core.name}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed font-light">
                        {core.subtitle}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const firstCoreNode = RDM_NODES_35.find(
                          (n) => n.coreId === core.id,
                        );
                        if (firstCoreNode) handleSelectNode(firstCoreNode);
                      }}
                      className="pt-3 border-t border-white/10 text-xs font-mono font-semibold text-cyan-400 hover:text-white flex items-center justify-between transition-colors"
                    >
                      <span>Explorar nodos del núcleo</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Turismo y eventos — vista rápida + drill-down */}
          <section className="max-w-7xl mx-auto px-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-2xl font-semibold text-white">
                  Turismo del Real: eventos, rutas y tradiciones
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Feria del Paste, Semana Cornish, rutas mineras y los dichos que guardan la memoria del pueblo.
                </p>
              </div>
              <button
                onClick={() => setActiveView("tourism")}
                className="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-mono font-semibold transition-all flex items-center gap-2"
              >
                <span>Explorar turismo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <TourismSection />
          </section>

          {/* Gemelo digital — avance táctico */}
          <section className="max-w-7xl mx-auto px-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-2xl font-semibold text-white">
                  Gemelo digital phygital 2D/3D
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Mapeo vivo de minas históricas, pastelerías de Cornwall y sensores urbanos en el monte.
                </p>
              </div>
              <button
                onClick={() => setActiveView("map")}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono font-semibold transition-all flex items-center gap-2"
              >
                <span>Abrir mapa completo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <DigitalTwinMap />
          </section>

          {/* Marketplace phygital — resumen económico */}
          <section className="max-w-7xl mx-auto px-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-2xl font-semibold text-white">
                  Economía phygital: pastes y platería ley .925
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Comercio territorial verificado con sello criptográfico, conectado al gemelo digital.
                </p>
              </div>
              <button
                onClick={() => setActiveView("marketplace")}
                className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-mono font-semibold transition-all flex items-center gap-2"
              >
                <span>Ir al marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <PhygitalMarketplace />
          </section>

          {/* Telemetría y seguridad — vista ejecutiva */}
          <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Telemetría urbana
              </h3>
              <TelemetryDashboard />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-400" />
                Seguridad post‑cuántica
              </h3>
              <PostQuantumSecurity />
            </div>
          </section>
        </div>
      )}

      {/* Asistente Isabella AI flotante */}
      <IsabellaChat
        isOpen={isabellaOpen}
        onClose={() => setIsabellaOpen(false)}
        initialPrompt={isabellaInitialPrompt}
      />
    </YUNLayout>
  );
}

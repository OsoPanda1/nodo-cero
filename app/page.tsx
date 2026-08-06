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
import { TwinsDashboard } from "@/components/twins/TwinsDashboard";
import { CityDashboard } from "@/components/city/CityDashboard";
import { AssetDashboard } from "@/components/assets/AssetDashboard";
import { GridDashboard } from "@/components/grid/GridDashboard";
import { MarketplaceDashboard } from "@/components/marketplace/MarketplaceDashboard";
import PaymentsSection from "@/components/payments/PaymentsSection";
import { StatPill } from "@/components/design-system/StatPill";
import { SectionHeader } from "@/components/design-system/SectionHeader";
import { MetallicHeading } from "@/components/design-system/MetallicHeading";
import { GradientDivider } from "@/components/design-system/GradientDivider";
import { CrystalButton } from "@/components/design-system/CrystalButton";
import { YUN_CORES, RDM_NODES_35, YUNNode } from "@/lib/data/rdm-data";
import { Box, Activity, ArrowRight, Radio, Lock, Sparkles } from "lucide-react";

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

      {/* 15c. GEMELO TERRITORIAL (TWINS) VIEW */}
      {activeView === "twins" && <TwinsDashboard />}

      {/* 15d. CIUDAD IOC VIEW */}
      {activeView === "city" && <CityDashboard />}

      {/* 15e. EAM / APM VIEW */}
      {activeView === "eam" && <AssetDashboard />}

      {/* 15f. SMART GRID / AGUA VIEW */}
      {activeView === "grid" && <GridDashboard />}

      {/* 15g. MARKETPLACE DIGITAL VIEW */}
      {activeView === "digital-marketplace" && <MarketplaceDashboard />}

      {/* 15h. PAGOS Y DONACIONES VIEW */}
      {activeView === "payments" && (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
          <PaymentsSection />
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

          {/* Banda de indicadores clave del territorio — cápsulas de cristal */}
          <section className="max-w-7xl mx-auto px-6 -mt-14 relative z-10">
            <div className="crystal-card p-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatPill
                  value="35"
                  label="Nodos YUN soberanos"
                  sub="7 núcleos heptafederados"
                  color="#2e9cff"
                />
                <StatPill
                  value="15"
                  label="Puntos de interés"
                  sub="Minas, templos y miradores"
                  color="#f2cc76"
                />
                <StatPill
                  value="500"
                  label="Años de historia"
                  sub="De la Real de Minas a 2026"
                  color="#d97832"
                />
                <StatPill
                  value="4.9"
                  label="Índice turístico"
                  sub="Pueblo Mágico certificado"
                  color="#3f9b78"
                />
              </div>
            </div>
          </section>

          {/* Núcleos YUN — arquitectura heptafederada */}
          <section className="max-w-7xl mx-auto px-6 space-y-8">
            <SectionHeader
              badge="ARQUITECTURA HEPTAFEDERADA YUN"
              title="Siete núcleos soberanos para el territorio"
              description="Cada núcleo gobierna un conjunto de nodos YUN que articulan historia, economía, seguridad y gemelo digital en tiempo real."
            />

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
                <MetallicHeading as="h3" className="text-2xl sm:text-3xl">
                  Turismo del Real: eventos, rutas y tradiciones
                </MetallicHeading>
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
                <MetallicHeading as="h3" className="text-2xl sm:text-3xl">
                  Gemelo digital phygital 2D/3D
                </MetallicHeading>
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
                <MetallicHeading as="h3" className="text-2xl sm:text-3xl">
                  Economía phygital: pastes y platería ley .925
                </MetallicHeading>
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

          {/* Panel de identidad — Anubis Villaseñor */}
          <section className="max-w-7xl mx-auto px-6">
            <div className="crystal-card p-8 md:p-12 text-center">
              <div className="crystal-badge mx-auto mb-5">
                <Sparkles className="w-3.5 h-3.5 text-[#d97832]" />
                <span>Autoría e identidad</span>
              </div>
              <p className="font-editorial text-2xl sm:text-3xl font-medium text-[#082f3b]">
                Una plataforma creada y arquitectada por
              </p>
              <p className="rdm-metallic-text font-editorial text-4xl sm:text-6xl font-semibold tracking-tight mt-3">
                Anubis Villaseñor
              </p>
              <p className="font-rdm-mono text-xs tracking-[0.28em] uppercase text-[#536b86] mt-4">
                Sistemas territoriales · Inteligencia cognitiva · Gobernanza digital · Experiencias inmersivas
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <CrystalButton onClick={() => setActiveView("about")} className="px-7 py-3.5 text-sm font-bold">
                  <span>Conocer la plataforma</span>
                  <ArrowRight className="w-4 h-4" />
                </CrystalButton>
                <CrystalButton variant="ghost" onClick={() => setIsabellaOpen(true)} className="px-7 py-3.5 text-sm font-semibold">
                  <Sparkles className="w-4 h-4 text-[#0d4652]" />
                  <span>Hablar con Isabella</span>
                </CrystalButton>
              </div>
              <GradientDivider className="mt-8" />
              <p className="font-rdm-mono text-[10px] tracking-widest text-[#536b86]">
                NODO CERO · RDM DIGITAL · REAL DEL MONTE, HIDALGO
              </p>
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

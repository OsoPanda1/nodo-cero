"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Sparkles, ShieldCheck, Zap, Globe, Cpu, Radio, Volume2, VolumeX } from 'lucide-react';

interface CrystalHero3DProps {
  onOpenIsabella: () => void;
  onSelectNode: (nodeId: string) => void;
}

export default function CrystalHero3D({ onOpenIsabella, onSelectNode }: CrystalHero3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!showTrailerModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowTrailerModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showTrailerModal]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x04060a, 0.035);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x04060a, 0);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x00f0ff, 3, 20);
    pointLightCyan.position.set(3, 4, 3);
    scene.add(pointLightCyan);

    const pointLightPurple = new THREE.PointLight(0xa855f7, 3, 20);
    pointLightPurple.position.set(-3, -2, 2);
    scene.add(pointLightPurple);

    const pointLightGold = new THREE.PointLight(0xeab308, 2, 15);
    pointLightGold.position.set(0, 3, -4);
    scene.add(pointLightGold);

    // Main Crystal Node (Icosahedron / Crystal Cluster)
    const geometry = new THREE.IcosahedronGeometry(1.8, 1);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.85,
      ior: 1.5,
      thickness: 1.2,
      transparent: true,
      opacity: 0.8,
      wireframe: false,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const crystalMesh = new THREE.Mesh(geometry, material);
    scene.add(crystalMesh);

    // Outer Wireframe Hologram Ring
    const wireGeo = new THREE.IcosahedronGeometry(2.3, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireMesh);

    // Orbiting Satellite Nodes (Representing 7 Cores)
    const satellites: THREE.Mesh[] = [];
    const coreColors = [0x00f0ff, 0xa855f7, 0xeab308, 0x10b981, 0xf43f5e, 0x8b5cf6, 0x06b6d4];
    for (let i = 0; i < 7; i++) {
      const satGeo = new THREE.OctahedronGeometry(0.22, 0);
      const satMat = new THREE.MeshStandardMaterial({
        color: coreColors[i],
        emissive: coreColors[i],
        emissiveIntensity: 0.6,
        roughness: 0.2,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satellites.push(satMesh);
      scene.add(satMesh);
    }

    // Floating Particles
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 16;
      posArray[i + 1] = (Math.random() - 0.5) * 16;
      posArray[i + 2] = (Math.random() - 0.5) * 16;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Main crystal rotation
      crystalMesh.rotation.x = elapsedTime * 0.15;
      crystalMesh.rotation.y = elapsedTime * 0.25;

      wireMesh.rotation.x = -elapsedTime * 0.1;
      wireMesh.rotation.y = -elapsedTime * 0.2;

      // Orbit satellites around center
      satellites.forEach((sat, idx) => {
        const angle = elapsedTime * 0.5 + (idx * Math.PI * 2) / 7;
        const radius = 3.2;
        sat.position.x = Math.cos(angle) * radius;
        sat.position.z = Math.sin(angle) * radius;
        sat.position.y = Math.sin(elapsedTime * 1.5 + idx) * 0.8;
        sat.rotation.x += 0.02;
        sat.rotation.y += 0.03;
      });

      // Particles gentle drift
      particlesMesh.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[88vh] min-h-[620px] overflow-hidden bg-gradient-to-b from-[#020408] via-[#060a14] to-[#04060a] border-b border-cyan-900/30">
      {/* Background 3D Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Cyber Grid & Overlay Glow Effects */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.12)_0%,transparent_70%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-between py-10 pointer-events-none">
        
        {/* Top Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>NODO CERO // REAL DEL MONTE // HEPTAFEDERADO YUN</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTrailerModal(true)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel-interactive border border-purple-500/40 text-xs font-semibold text-purple-300 hover:text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              <Play className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
              <span>Trailer AAA 4K</span>
            </button>

            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-amber-500/30 text-xs font-mono text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Cripto Post-Cuántica Dilithium</span>
            </div>
          </div>
        </div>

        {/* Main Title & Value Proposition */}
        <div className="my-auto max-w-3xl pointer-events-auto">
          <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-mono tracking-widest text-cyan-400 uppercase">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Sistema de Inteligencia Territorial Soberano
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-none mb-4">
            RDM Digital Hub{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-300 to-amber-300 animate-rainbow-glow">
              Nodo Cero
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light mb-8 max-w-2xl backdrop-blur-md bg-black/40 p-4 rounded-xl border border-white/10 shadow-2xl">
            Plataforma digital soberana para Real del Monte, Hidalgo. Una convergencia Phygital de gemelo digital 2D/3D, mapas interactivos, economía de la plata y el paste, y la asistencia cognitiva de <strong className="text-cyan-300 font-semibold">Isabella Villaseñor AI</strong>.
          </p>

          {/* Action Callouts */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenIsabella}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_45px_rgba(6,182,212,0.8)] transition-all hover:scale-105 flex items-center gap-2 group"
            >
              <Cpu className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span>Consultar a Isabella AI</span>
            </button>

            <button
              onClick={() => onSelectNode('node-10')}
              className="px-6 py-3.5 rounded-xl glass-panel-interactive border border-white/20 text-white font-semibold text-sm hover:border-cyan-400 transition-all flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Explorar Gemelo Digital 3D</span>
            </button>

            <button
              onClick={() => onSelectNode('node-06')}
              className="px-5 py-3.5 rounded-xl glass-panel-interactive border border-purple-500/30 text-purple-300 text-xs font-mono hover:border-purple-400 transition-all flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Ver Núcleos YUN</span>
            </button>
          </div>
        </div>

        {/* Bottom Real-time Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pointer-events-auto">
          <div className="p-3 rounded-xl glass-panel border border-cyan-500/20 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Clima en el Monte</div>
              <div className="text-sm font-bold text-cyan-200">13.8°C // Niebla 88%</div>
            </div>
          </div>

          <div className="p-3 rounded-xl glass-panel border border-purple-500/20 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Isabella AI Status</div>
              <div className="text-sm font-bold text-purple-200">En Línea // 14ms</div>
            </div>
          </div>

          <div className="p-3 rounded-xl glass-panel border border-amber-500/20 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Pastelerías Activas</div>
              <div className="text-sm font-bold text-amber-200">18 RDM Certificadas</div>
            </div>
          </div>

          <div className="p-3 rounded-xl glass-panel border border-emerald-500/20 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Nodos YUN Activos</div>
              <div className="text-sm font-bold text-emerald-200">35 / 35 Operativos</div>
            </div>
          </div>
        </div>

      </div>

      {/* Trailer AAA Video Modal */}
      {showTrailerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
          <div className="relative w-full max-w-5xl glass-panel rounded-2xl border border-cyan-500/40 p-4 shadow-[0_0_50px_rgba(6,182,212,0.4)]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                <h3 className="text-base font-bold text-white tracking-wide">
                  TRAILER AAA // REAL DEL MONTE - NODO CERO 4K
                </h3>
              </div>
              <button
                onClick={() => setShowTrailerModal(false)}
                className="px-3 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-mono transition-all"
              >
                Cerrar [ESC]
              </button>
            </div>

            {/* Video Canvas Simulation Container */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group">
              {/* Simulated Ambient Cinematic Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950 via-slate-900 to-purple-950 opacity-90 animate-pulse-glow" />
              
              {/* Simulated Video Content HUD */}
              <div className="relative z-10 text-center p-8 max-w-2xl">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-[0_0_30px_rgba(6,182,212,0.8)]">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-cyan-300 animate-spin" />
                  </div>
                </div>

                <h4 className="text-2xl font-black text-white mb-2 tracking-wide uppercase">
                  EXPERIENCIA TERRITORIAL CINEMÁTICA
                </h4>
                <p className="text-sm text-cyan-200 font-light mb-6">
                  Inmersión fotogramétrica en la cuna de la minería de plata, el Panteón Inglés, la niebla dorada de la sierra y el legado gastronómico del Paste Cornish.
                </p>

                <div className="inline-flex items-center gap-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-3 rounded-full glass-panel border border-white/20 text-cyan-300 hover:text-white transition-all"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>

                  <div className="px-4 py-2 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-mono text-cyan-300">
                    4K HDR // 60 FPS // Dolby Atmos 8D
                  </div>
                </div>
              </div>

              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.8)_51%)] bg-[size:100%_4px]" />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Producción: RDM Digital Hub & YUN Media Node</span>
              <span>Ubicación: Real del Monte, Hidalgo, México</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

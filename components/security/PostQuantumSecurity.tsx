"use client";

import React, { useState } from 'react';
import { ShieldCheck, Key, Lock, Cpu, Terminal, RefreshCw, CheckCircle2, AlertTriangle, Database } from 'lucide-react';

interface Block {
  hash: string;
  prevHash: string;
  timestamp: string;
  transactions: number;
  validator: string;
  algorithm: string;
}

const mockBlocks: Block[] = [
  {
    hash: '0x8f2a9c1e4b3d7f0a5c8e2b9d1f4a6c8e',
    prevHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    timestamp: 'Hace 12 seg',
    transactions: 42,
    validator: 'Nodo Cero // Core 2',
    algorithm: 'CRYSTALS-Dilithium-5',
  },
  {
    hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    prevHash: '0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b',
    timestamp: 'Hace 45 seg',
    transactions: 28,
    validator: 'Nodo Mina Acosta',
    algorithm: 'CRYSTALS-Dilithium-5',
  },
  {
    hash: '0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b',
    prevHash: '0x3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c',
    timestamp: 'Hace 2 min',
    transactions: 64,
    validator: 'Nodo Panteón Inglés',
    algorithm: 'Falcon-1024',
  },
];

export default function PostQuantumSecurity() {
  const [blocks, setBlocks] = useState<Block[]>(mockBlocks);
  const [keyStatus, setKeyStatus] = useState<'Protegido' | 'Rotando Keys...'>('Protegido');
  const [simulatingKeyRotation, setSimulatingKeyRotation] = useState(false);

  const triggerKeyRotation = () => {
    setSimulatingKeyRotation(true);
    setKeyStatus('Rotando Keys...');

    setTimeout(() => {
      const newBlock: Block = {
        hash: `0x${Math.random().toString(16).substring(2, 18)}${Math.random().toString(16).substring(2, 18)}`,
        prevHash: blocks[0].hash,
        timestamp: 'Justo ahora',
        transactions: Math.floor(Math.random() * 30) + 10,
        validator: 'Nodo Cero // Key-Rotator',
        algorithm: 'CRYSTALS-Kyber-1024',
      };

      setBlocks([newBlock, ...blocks]);
      setKeyStatus('Protegido');
      setSimulatingKeyRotation(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Security Status Header */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-500/40 bg-purple-950/20 shadow-[0_0_40px_rgba(168,85,247,0.15)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-lg">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Criptografía Post-Cuántica Dilithium & Kyber
            </h3>
            <p className="text-xs text-purple-200 font-mono">
              Blindaje inalterable para el territorio, registros de propiedad, pasaportes y finanzas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-500/40 text-xs font-mono text-purple-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Estado: {keyStatus}</span>
          </div>

          <button
            onClick={triggerKeyRotation}
            disabled={simulatingKeyRotation}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-all shadow-md flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${simulatingKeyRotation ? 'animate-spin' : ''}`} />
            <span>Rotar Llaves Quantum</span>
          </button>
        </div>
      </div>

      {/* Grid of Security Algorithms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">NIST Standard 1</span>
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
          <h4 className="text-base font-bold text-white">CRYSTALS-Dilithium</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Esquema de firma digital basado en retículos para verificación inalterable de actas y transacciones.
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
            Nivel de Seguridad: Category 5 (256-bit)
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-purple-400 font-bold uppercase">NIST Standard 2</span>
            <Key className="w-4 h-4 text-purple-400" />
          </div>
          <h4 className="text-base font-bold text-white">CRYSTALS-Kyber</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Mecanismo de encapsulamiento de claves (KEM) para túneles de comunicación indescifrables.
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
            Resistencia Post-Cuántica: 100%
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 font-bold uppercase">NIST Standard 3</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <h4 className="text-base font-bold text-white">Falcon Signatures</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Algoritmo ultrarrápido para autenticar dispositivos IoT y sensores meteorológicos del monte.
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
            Latencia de Firma: 0.2ms
          </div>
        </div>

      </div>

      {/* Ledger Block Explorer */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            Explorador de Bloques Ledger Inmutable
          </h3>
          <span className="text-xs font-mono text-purple-300">
            Consenso YUN // 7 Nodos Auditados
          </span>
        </div>

        <div className="space-y-3">
          {blocks.map((block, i) => (
            <div
              key={block.hash}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 transition-all space-y-2 font-mono"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-purple-400 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  Hash: {block.hash}
                </span>
                <span className="text-slate-400 text-[11px]">{block.timestamp}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300 pt-2 border-t border-slate-900">
                <div>Validator: <strong className="text-cyan-300">{block.validator}</strong></div>
                <div>Transacciones: <strong className="text-amber-300">{block.transactions} txs</strong></div>
                <div>Algoritmo: <strong className="text-purple-300">{block.algorithm}</strong></div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

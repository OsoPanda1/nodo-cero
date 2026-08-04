"use client";

import React, { useState } from 'react';
import { Trophy, Medal, Target, CheckCircle2, Flame, Crown, Lock, TrendingUp } from 'lucide-react';
import { RDM_BADGES, RDM_CHALLENGES } from '@/lib/data/rdm-content';

const rarityColors: Record<string, string> = {
  Común: 'border-slate-500/40 text-slate-300',
  Raro: 'border-cyan-500/40 text-cyan-300',
  Épico: 'border-purple-500/40 text-purple-300',
  Legendario: 'border-amber-500/50 text-amber-300',
};

export default function GamificationSection() {
  const [activeTab, setActiveTab] = useState<'badges' | 'retos'>('badges');
  const [userXp, setUserXp] = useState(2480);
  const unlockedIds = new Set(['b-1', 'b-2', 'b-3', 'b-4']);
  const level = Math.floor(userXp / 500) + 1;
  const levelProgress = (userXp % 500) / 5;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          Gamificación del Nodo Cero
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Insignias, retos y experiencia soberana para los habitantes del Real
        </p>
      </div>

      {/* Player Card */}
      <div className="p-5 rounded-2xl glass-panel border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-950/60 to-slate-950/80 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.4)]">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">Minerx · Nodo Cero</div>
              <div className="text-lg font-black text-white">Nivel {level} — Hornero del Monte</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase">XP Total</div>
            <div className="text-xl font-black text-amber-400">{userXp.toLocaleString()} XP</div>
          </div>
        </div>
        <div>
          <div className="h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 animate-shimmer" style={{ width: `${levelProgress}%` }} />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
            <span>{userXp % 500} / 500 XP</span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              Racha: 12 días
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-1 rounded-2xl glass-panel border border-white/10 w-fit">
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'badges' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Medal className="w-4 h-4" />
          Insignias
        </button>
        <button
          onClick={() => setActiveTab('retos')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'retos' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Target className="w-4 h-4" />
          Retos de la Comarca
        </button>
      </div>

      {activeTab === 'badges' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {RDM_BADGES.map(badge => {
            const unlocked = unlockedIds.has(badge.id);
            return (
            <div key={badge.id} className={`p-4 rounded-2xl glass-panel border bg-slate-950/60 text-center space-y-2 ${unlocked ? rarityColors[badge.rarity] : 'border-slate-800 opacity-50'}`}>
              <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center border-2 ${unlocked ? rarityColors[badge.rarity] + ' bg-slate-900' : 'border-slate-700 bg-slate-900'}`}>
                {unlocked ? <Medal className="w-6 h-6" /> : <Lock className="w-6 h-6 text-slate-600" />}
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-tight">{badge.name}</div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">{badge.rarity.toUpperCase()}</div>
              </div>
              <div className="text-[10px] font-mono text-slate-400 leading-snug">{badge.description}</div>
            </div>
            );
          })}
        </div>
      )}

      {activeTab === 'retos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {RDM_CHALLENGES.map(challenge => (
            <div key={challenge.id} className="p-5 rounded-2xl glass-panel-interactive border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">{challenge.category}</div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${
                  challenge.progress >= 100
                    ? 'text-emerald-300 border-emerald-500/40 bg-emerald-950/60'
                    : 'text-amber-300 border-amber-500/40 bg-amber-950/60'
                }`}>
                  {challenge.progress >= 100 ? 'Completado' : `+${challenge.points} XP`}
                </span>
              </div>
              <h4 className="text-base font-bold text-white">{challenge.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">{challenge.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  {challenge.progress >= 100 ? 'Dominado' : 'Por completar'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{challenge.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

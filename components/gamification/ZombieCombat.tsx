'use client';

import { useMemo, useState } from 'react';
import { Battery, Ghost, Hourglass, MapPin, MessageSquare, Skull, Sparkles } from 'lucide-react';
import {
  ZOMBIE_ARTIFACTS,
  SEAL_ARTIFACT,
  ZombieArchetype,
  ZombieSpawn,
  TimeContext,
  artifactDamage,
  captureChance,
  computeMultiplier,
  computePoints,
  evasionRoll,
} from '@/lib/data/zombies-data';
import ZombieSprite from './ZombieSprite';

interface ZombieCombatProps {
  spawn: ZombieSpawn;
  archetype: ZombieArchetype;
  ctx: TimeContext;
  ownedArtifacts: string[];
  energy: number;
  onEnergyUse: (amount: number) => void;
  onFinish: (result: { captured: boolean; points: number }) => void;
  onAskIsabella: (prompt: string) => void;
}

type SpriteFx = 'idle' | 'hurt' | 'dodge' | 'captured';

const RARITY_STYLE: Record<string, string> = {
  comun: 'text-slate-300 border-slate-500/40 bg-slate-900',
  raro: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/60',
  epico: 'text-amber-300 border-amber-500/40 bg-amber-950/60',
};

const RARITY_LABEL: Record<string, string> = { comun: 'Común', raro: 'Raro', epico: 'Épico' };

const MAX_TURNS = 8;

export default function ZombieCombat({
  spawn,
  archetype,
  ctx,
  ownedArtifacts,
  energy,
  onEnergyUse,
  onFinish,
  onAskIsabella,
}: ZombieCombatProps) {
  const [resistance, setResistance] = useState(archetype.resistance);
  const [turnsLeft, setTurnsLeft] = useState(MAX_TURNS);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [sealCooldown, setSealCooldown] = useState(0);
  const [farolActive, setFarolActive] = useState(false);
  const [lenteActive, setLenteActive] = useState(false);
  const [spriteFx, setSpriteFx] = useState<SpriteFx>('idle');
  const [log, setLog] = useState<string[]>(['El zombie emerge entre la niebla del territorio.']);
  const [phase, setPhase] = useState<'fight' | 'result'>('fight');
  const [result, setResult] = useState<'captured' | 'escaped' | null>(null);

  const multiplier = useMemo(() => computeMultiplier(ctx, spawn.zone), [ctx, spawn.zone]);
  const sealable = resistance <= archetype.resistance * 0.35;
  const sealChance = sealable
    ? captureChance(archetype, resistance, archetype.resistance, 0, lenteActive)
    : 0;

  const pushLog = (line: string) => setLog(prev => [line, ...prev].slice(0, 4));

  const tickTurn = () => {
    setTurnsLeft(t => {
      const next = t - 1;
      if (next <= 0) {
        setPhase('result');
        setResult('escaped');
        setSpriteFx('idle');
      }
      return next;
    });
    setCooldowns(c => {
      const next: Record<string, number> = {};
      for (const [k, v] of Object.entries(c)) {
        if (v > 0) next[k] = v - 1;
      }
      return next;
    });
    if (sealCooldown > 0) setSealCooldown(c => c - 1);
  };

  const applyArtifact = (id: string) => {
    if (phase !== 'fight') return;
    const artifact = ZOMBIE_ARTIFACTS.find(a => a.id === id);
    if (!artifact) return;
    if (cooldowns[id] && cooldowns[id] > 0) return;
    if (energy < artifact.energyCost) return;

    onEnergyUse(artifact.energyCost);
    setCooldowns(c => ({ ...c, [id]: artifact.cooldown }));

    if (artifact.kind === 'soporte' && artifact.id === 'a-farol') {
      setFarolActive(true);
      pushLog('El Farol de Mina enciende: la evasión del zombie se reduce a la mitad.');
    } else if (artifact.kind === 'defensivo' && artifact.id === 'a-casco') {
      setTurnsLeft(t => Math.min(t + 2, MAX_TURNS + 2));
      pushLog('Casco de Barretero: ganas dos turnos de resistencia.');
    } else if (artifact.kind === 'soporte' && artifact.id === 'a-lente') {
      setLenteActive(true);
      pushLog('La Lente de la Niebla revela las líneas del pulso: +25% captura.');
    } else {
      const dodged = evasionRoll(archetype, farolActive);
      if (dodged) {
        setSpriteFx('dodge');
        pushLog(`${archetype.name} esquiva el ${artifact.name} y se hunde en la sombra.`);
      } else {
        const dmg = artifactDamage(artifact, archetype);
        setResistance(r => {
          const next = Math.max(0, r - dmg);
          if (next <= 0) {
            setPhase('result');
            setResult('captured');
            setSpriteFx('captured');
            pushLog(`${archetype.name} se derrumba: captura garantizada.`);
          }
          return next;
        });
        setSpriteFx('hurt');
        pushLog(`${artifact.name} impacta: ${dmg} de daño contra ${archetype.name}.`);
      }
    }
    tickTurn();
  };

  const fireSeal = () => {
    if (phase !== 'fight' || !sealable || sealCooldown > 0) return;
    const roll = Math.random();
    if (roll < sealChance) {
      setPhase('result');
      setResult('captured');
      setSpriteFx('captured');
      pushLog('¡El Sello RDM se activa! La cadena del Nodo lo contiene.');
    } else {
      setSealCooldown(1);
      setSpriteFx('dodge');
      pushLog('El Sello RDM vibra en el aire, pero el zombie se retuerce y escapa del lacre.');
    }
    tickTurn();
  };

  const handleClose = () => {
    if (!result) return;
    const points = result === 'captured' ? computePoints(archetype, ctx, spawn.zone) : 0;
    onFinish({ captured: result === 'captured', points });
  };

  const points = computePoints(archetype, ctx, spawn.zone);
  const pct = Math.round((resistance / archetype.resistance) * 100);

  return (
    <div className="glass-panel rounded-2xl border border-emerald-500/30 overflow-hidden">
      {/* Encabezado del encuentro */}
      <div className="p-4 border-b border-white/10 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white">{archetype.name}</h4>
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md border ${RARITY_STYLE[archetype.rarity]}`}>
              {RARITY_LABEL[archetype.rarity]}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-emerald-400" /> {spawn.poiName}
          </p>
        </div>
        <div className="text-right font-mono text-[10px] text-slate-400 space-y-0.5">
          <p className="flex items-center justify-end gap-1"><Hourglass className="w-3 h-3" /> Turnos: {turnsLeft}</p>
          <p className="flex items-center justify-end gap-1"><Battery className="w-3 h-3 text-cyan-300" /> Energía: {energy}</p>
        </div>
      </div>

      <div className="p-4 grid md:grid-cols-[200px_1fr] gap-4">
        {/* Arena */}
        <div className="relative h-52 rounded-xl bg-gradient-to-b from-emerald-950/60 to-slate-950 border border-white/10 flex items-center justify-center overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-950/80 to-transparent" />
          <div className="scale-90">
            <ZombieSprite archetype={archetype} size={150} state={spriteFx} />
          </div>
          <span className="absolute top-2 left-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
            Encuentro #{spawn.id.slice(-4)}
          </span>
        </div>

        {/* Panel de combate */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-slate-400">Resistencia</span>
              <span className="text-emerald-300">{resistance} / {archetype.resistance}</span>
            </div>
            <div className="h-3 rounded-full bg-slate-900 border border-white/10 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
              <div className="absolute inset-y-0 left-[35%] w-px bg-amber-400/80" title="Umbral de captura (35%)" />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
              <span>Umbral de captura</span>
              <span className={sealable ? 'text-amber-300' : ''}>Sello disponible {sealable ? '✓' : ''}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={fireSeal}
              disabled={!sealable || sealCooldown > 0}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                sealable
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md hover:opacity-90'
                  : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
              }`}
            >
              <Skull className="w-4 h-4" />
              Lanzar Sello RDM
              {sealable && <span className="text-[9px] font-mono opacity-80">{Math.round(sealChance * 100)}%</span>}
            </button>
            <button
              onClick={() => onAskIsabella(`Hay un ${archetype.name} (${archetype.rarity}) en ${spawn.poiName}, Real del Monte. ${archetype.lore} ¿Qué estrategia o historia del territorio me recomiendas para contener esta invasión?`)}
              className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 bg-slate-900 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Consultar a Isabella
            </button>
          </div>

          <div>
            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Artefactos del guardián
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ZOMBIE_ARTIFACTS.filter(a => ownedArtifacts.includes(a.id)).map(a => {
                const Icon = a.icon;
                const cd = cooldowns[a.id] ?? 0;
                const disabled = cd > 0 || energy < a.energyCost;
                const synergy = a.synergies.some(s => s.type === archetype.type || (s.zone && archetype.zones.includes(s.zone)));
                return (
                  <button
                    key={a.id}
                    onClick={() => applyArtifact(a.id)}
                    disabled={disabled}
                    className={`text-left p-2 rounded-xl border transition-all ${
                      disabled
                        ? 'bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed'
                        : synergy
                          ? 'bg-gradient-to-br from-amber-950/60 to-slate-900 border-amber-500/40 hover:border-amber-400'
                          : 'bg-slate-900/70 border-white/10 hover:border-cyan-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${synergy ? 'text-amber-300' : 'text-cyan-300'}`} />
                      <span className="text-[10px] font-bold text-white truncate">{a.name}</span>
                    </div>
                    <p className="text-[9px] font-mono text-slate-400 mt-1">
                      {a.power > 0 ? `Daño ${a.power}+` : a.id === 'a-farol' ? 'Anti-evisión' : a.id === 'a-lente' ? 'Captura +25%' : '+2 turnos'}
                      <span className="ml-1.5">Energía {a.energyCost}</span>
                      {cd > 0 && <span className="ml-1.5 text-amber-300">CD {cd}</span>}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-950/70 p-2 space-y-1">
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Registro de encuentro</p>
            {log.map((line, i) => (
              <p key={`${i}-${line.slice(0, 12)}`} className="text-[10px] text-slate-300 leading-snug">{line}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Resultado */}
      {phase === 'result' && result && (
        <div className="p-4 border-t border-white/10 bg-slate-950/80">
          {result === 'captured' ? (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <ZombieSprite archetype={archetype} size={90} state="captured" />
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-base font-bold text-emerald-300 flex items-center gap-2 justify-center sm:justify-start">
                  <Ghost className="w-4 h-4" /> ¡{archetype.name} capturado!
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  El Sello RDM lo registró en el bestiario del Nodo. Puntos obtenidos:{' '}
                  <span className="font-mono text-amber-300 font-bold">+{points}</span>
                </p>
                <p className="text-[10px] font-mono text-slate-500 mt-1">
                  Base {archetype.basePoints} × multiplicador {multiplier.toFixed(2)}
                  {ctx.niebla ? ' (niebla ×1.5)' : ''}{ctx.period === 'noche' ? ' (noche ×1.3)' : ''}
                  {ctx.isEventMonth ? ' (evento ×2)' : ''}{spawn.zone === 'mina' ? ' (mina activa ×1.2)' : ''}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
              >
                Continuar patrulla
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <ZombieSprite archetype={archetype} size={90} state="idle" />
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-base font-bold text-rose-300">El zombie escapó al socavón</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Sin turnos restantes, {archetype.name} se desvaneció en la niebla. Refuerza tu energía y vuelve a intentarlo.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
              >
                Volver al mapa
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { ZombieArchetype } from '@/lib/data/zombies-data';

type SpriteState = 'idle' | 'hurt' | 'dodge' | 'captured';

const STATE_CLASS: Record<SpriteState, string> = {
  idle: 'zr-idle',
  hurt: 'zr-hurt',
  dodge: 'zr-dodge',
  captured: 'zr-captured',
};

const STYLE = `
@keyframes zr-limpL { 0%,100% { transform: rotate(9deg); } 50% { transform: rotate(-16deg); } }
@keyframes zr-limpR { 0%,100% { transform: rotate(-9deg); } 50% { transform: rotate(16deg); } }
@keyframes zr-sway  { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-4px) rotate(2deg); } }
@keyframes zr-hurt  { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
@keyframes zr-dodge { 0%,100% { transform: rotate(0) translateX(0); } 50% { transform: rotate(-20deg) translateX(-10px); } }
@keyframes zr-captured { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
.zr-idle .zr-root, .zr-hurt .zr-root, .zr-dodge .zr-root, .zr-captured .zr-root { transform-box: fill-box; transform-origin: 50% 100%; }
.zr-idle .zr-body { animation: zr-sway 2.2s ease-in-out infinite; transform-box: fill-box; }
.zr-idle .zr-arm-l { animation: zr-limpL 1.4s ease-in-out infinite; transform-box: fill-box; transform-origin: top right; }
.zr-idle .zr-arm-r { animation: zr-limpR 1.4s ease-in-out infinite; transform-box: fill-box; transform-origin: top left; }
.zr-idle .zr-leg-l { animation: zr-limpR 1.4s ease-in-out infinite; transform-box: fill-box; transform-origin: bottom right; }
.zr-idle .zr-leg-r { animation: zr-limpL 1.4s ease-in-out infinite; transform-box: fill-box; transform-origin: bottom left; }
.zr-hurt .zr-root { animation: zr-hurt 0.45s linear infinite; }
.zr-dodge .zr-root { animation: zr-dodge 0.5s ease-in-out; }
.zr-captured .zr-root { animation: zr-captured 1s ease-in-out infinite; }
`;

interface ZombieSpriteProps {
  archetype: ZombieArchetype;
  size?: number;
  state?: SpriteState;
  className?: string;
}

export default function ZombieSprite({ archetype, size = 160, state = 'idle', className }: ZombieSpriteProps) {
  const [mediaError, setMediaError] = useState(false);
  const accent = archetype.color;

  const renderMedia = !mediaError && (archetype.spriteVideo || archetype.sprite);

  return (
    <div className={`relative inline-block select-none ${className ?? ''}`} style={{ width: size, height: size * 1.25 }}>
      <style>{STYLE}</style>
      {renderMedia ? (
        archetype.spriteVideo ? (
          <video
            src={archetype.spriteVideo}
            autoPlay
            loop
            muted
            playsInline
            onError={() => setMediaError(true)}
            className="w-full h-full object-contain"
            style={{ filter: `drop-shadow(0 0 14px ${accent}66)` }}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={archetype.sprite}
            alt={archetype.name}
            onError={() => setMediaError(true)}
            className="w-full h-full object-contain"
            style={{ filter: `drop-shadow(0 0 14px ${accent}66)` }}
          />
        )
      ) : (
        <svg viewBox="0 0 120 160" className={STATE_CLASS[state]} style={{ width: '100%', height: '100%' }}>
          <g className="zr-root">
            <g className="zr-body">
              <ellipse cx="60" cy="100" rx="27" ry="31" fill={`${accent}2e`} stroke={accent} strokeWidth="3" />
              <path d="M44 82 L50 118 L70 118 L76 82 Z" fill={`${accent}38`} stroke={accent} strokeWidth="2" />
              <circle cx="60" cy="72" r="9" fill={`${accent}55`} stroke={accent} strokeWidth="2" />
            </g>

            <g className="zr-arm-l">
              <path d="M38 86 L24 118" stroke={accent} strokeWidth="8" strokeLinecap="round" />
              <circle cx="24" cy="122" r="4.5" fill={`${accent}88`} />
            </g>
            <g className="zr-arm-r">
              <path d="M82 86 L96 116" stroke={accent} strokeWidth="8" strokeLinecap="round" />
              <circle cx="96" cy="120" r="4.5" fill={`${accent}88`} />
            </g>

            <g className="zr-leg-l">
              <path d="M48 124 L42 152" stroke={accent} strokeWidth="9" strokeLinecap="round" />
            </g>
            <g className="zr-leg-r">
              <path d="M72 124 L78 152" stroke={accent} strokeWidth="9" strokeLinecap="round" />
            </g>

            <g className="zr-head">
              <circle cx="60" cy="56" r="23" fill={`${accent}22`} stroke={accent} strokeWidth="3" />
              <path d="M42 48 L78 52" stroke={`${accent}aa`} strokeWidth="2" strokeDasharray="3 3" />
              <circle cx="52" cy="50" r="3.5" fill="#ff5f56" className="zr-eye" style={{ filter: 'drop-shadow(0 0 6px #ff5f56)' }} />
              <circle cx="69" cy="51" r="3.5" fill="#ff5f56" className="zr-eye" style={{ filter: 'drop-shadow(0 0 6px #ff5f56)' }} />
              <path d="M52 66 Q60 72 68 66" stroke={accent} strokeWidth="2.5" fill="none" />
            </g>

            {archetype.type === 'minero' && (
              <g>
                <path d="M41 44 L45 30 L75 30 L79 44 Z" fill={`${accent}77`} stroke={accent} strokeWidth="2" />
                <line x1="60" y1="30" x2="60" y2="40" stroke={accent} strokeWidth="2" strokeDasharray="3 3" />
              </g>
            )}
            {archetype.type === 'espectro' && (
              <g opacity="0.85">
                <path d="M38 50 Q60 20 82 50 L82 60 L38 60 Z" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="4 4" />
              </g>
            )}
            {archetype.type === 'leyenda' && (
              <g>
                <path d="M30 130 L90 130 L86 156 L34 156 Z" fill={`${accent}22`} stroke={accent} strokeWidth="2" />
                <path d="M35 96 L60 84 L85 96" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="60" cy="96" r="6" fill={accent} />
              </g>
            )}
          </g>
        </svg>
      )}
    </div>
  );
}

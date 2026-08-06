'use client';

import { useState } from 'react';
import {
  UserPlus,
  Store,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Trophy,
  Gift,
  Landmark,
  HandCoins,
} from 'lucide-react';
import { SectionHeader } from '@/components/design-system/SectionHeader';
import { GradientDivider } from '@/components/design-system/GradientDivider';

type RegisterKind = 'user' | 'business';

const ROLES = ['vecino', 'artesano', 'comerciante', 'operador', 'turista'] as const;
const CATEGORIES = ['Gastronomía', 'Platería', 'Artesanías', 'Hospedaje', 'Turismo', 'Otro'];

interface RegisterResult {
  ok: boolean;
  id?: string;
  kind?: string;
  error?: string;
}

const PERKS = [
  { icon: <Trophy className="h-4 w-4 text-[#d97832]" />, text: 'Perfil del Nodo con XP y logros de gamificación' },
  { icon: <HandCoins className="h-4 w-4 text-[#3f9b78]" />, text: 'Participación en la economía phygital y donaciones' },
  { icon: <Landmark className="h-4 w-4 text-[#0d4652]" />, text: 'Acceso a misiones de la Comarca y eventos en vivo' },
  { icon: <ShieldCheck className="h-4 w-4 text-[#536b86]" />, text: 'Identidad soberana verificada por CROWN Gateway' },
];

export default function RegisterSection() {
  const [kind, setKind] = useState<RegisterKind>('user');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<RegisterResult | null>(null);

  /* Formulario de vecino */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<(typeof ROLES)[number]>('vecino');
  const [neighborhood, setNeighborhood] = useState('');
  const [occupation, setOccupation] = useState('');

  /* Formulario de negocio */
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [address, setAddress] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setBusy(true);
    try {
      const body = kind === 'user'
        ? {
            kind: 'user',
            name: name.trim(),
            email: email.trim(),
            role,
            neighborhood: neighborhood.trim() || undefined,
            occupation: occupation.trim() || undefined,
            interests: [],
            acceptTerms: true,
          }
        : {
            kind: 'business',
            businessName: businessName.trim(),
            ownerName: ownerName.trim(),
            email: businessEmail.trim(),
            category: category.trim(),
            address: address.trim() || undefined,
            acceptTerms: true,
          };
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as RegisterResult;
      if (!res.ok) {
        setError(data.error === 'EMAIL_ALREADY_REGISTERED' ? 'Ese correo ya está registrado en el Nodo.' : (data.error ?? 'No se pudo completar el registro.'));
        return;
      }
      setSuccess(data);
    } catch {
      setError('Error de red al registrarte.');
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    'w-full rounded-xl border border-[#c9d0d4] bg-white/85 px-3.5 py-2.5 text-sm text-[#082f3b] placeholder-[#8a97a4] focus:border-[#2e9cff] focus:outline-none transition-all';

  return (
    <div className="space-y-8">
      <SectionHeader
        badge="PLANO III · PERSONALIZA"
        title="Registro de vecinos y negocios del Real"
        description="Crea tu identidad soberana en el Nodo Cero. Cada habitante y cada oficio de la Comarca tiene su lugar en la plataforma."
      />

      {/* Tarjetas de acceso: qué desbloquea la cuenta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PERKS.map(perk => (
          <div key={perk.text} className="p-4 rounded-2xl border border-[#c9d0d4]/70 bg-white/70 flex items-start gap-3">
            <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-tr from-[#eef1ec] to-[#f7f8f5] border border-[#c9d0d4]/70 flex items-center justify-center">
              {perk.icon}
            </div>
            <p className="text-xs text-[#536b86] leading-relaxed pt-1">{perk.text}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Formulario */}
        <form onSubmit={submit} className="lg:col-span-3 p-6 rounded-2xl border border-[#c9d0d4]/70 bg-white/70 space-y-5">
          <div className="flex items-center gap-2 p-1 rounded-2xl border border-[#c9d0d4]/70 bg-white/60 w-fit">
            <button
              type="button"
              onClick={() => setKind('user')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                kind === 'user' ? 'bg-[#0d4652] text-[#f2cc76] shadow-md' : 'text-[#536b86] hover:text-[#082f3b]'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Vecino
            </button>
            <button
              type="button"
              onClick={() => setKind('business')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                kind === 'business' ? 'bg-[#0d4652] text-[#f2cc76] shadow-md' : 'text-[#536b86] hover:text-[#082f3b]'
              }`}
            >
              <Store className="w-4 h-4" />
              Negocio
            </button>
          </div>

          {kind === 'user' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#0d4652]">Nombre completo</label>
                  <input className={inputCls} value={name} onChange={e => setName(e.target.value)} placeholder="Ej. María de los Ángeles" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#0d4652]">Correo</label>
                  <input type="email" className={inputCls} value={email} onChange={e => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.mx" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#0d4652]">Rol en la Comarca</label>
                  <select className={inputCls} value={role} onChange={e => setRole(e.target.value as typeof role)}>
                    {ROLES.map(r => (
                      <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#0d4652]">Barrio o comunidad</label>
                  <input className={inputCls} value={neighborhood} onChange={e => setNeighborhood(e.target.value)} placeholder="Ej. El Arbolito" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#0d4652]">Oficio u ocupación</label>
                <input className={inputCls} value={occupation} onChange={e => setOccupation(e.target.value)} placeholder="Ej. Pasteuría, platería, guía de minas…" />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#0d4652]">Nombre del negocio</label>
                  <input className={inputCls} value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Ej. Pastería La Cornish" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#0d4652]">Propietario</label>
                  <input className={inputCls} value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Nombre del responsable" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#0d4652]">Correo del negocio</label>
                  <input type="email" className={inputCls} value={businessEmail} onChange={e => setBusinessEmail(e.target.value)} placeholder="negocio@ejemplo.mx" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#0d4652]">Rubro</label>
                  <select className={inputCls} value={category} onChange={e => setCategory(e.target.value)}>
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#0d4652]">Dirección</label>
                <input className={inputCls} value={address} onChange={e => setAddress(e.target.value)} placeholder="Calle, número y localidad" />
              </div>
            </>
          )}

          {error && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {success?.ok && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="space-y-0.5">
                <p className="font-bold">Registro completado en el Nodo Cero</p>
                <p className="font-mono text-xs">
                  Identificador: {success.kind === 'business' ? 'NEGOCIO' : 'VECINO'} · {success.id}
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d4652] px-4 py-3 text-sm font-bold text-[#f2cc76] shadow-[0_8px_24px_rgba(13,70,82,0.25)] transition-all hover:shadow-[0_10px_32px_rgba(13,70,82,0.4)] disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Registrar {kind === 'business' ? 'negocio' : 'mi cuenta'}
          </button>
        </form>

        {/* Panel lateral: identidad y beneficios */}
        <div className="lg:col-span-2 space-y-5">
          <div className="p-6 rounded-2xl glass-panel-interactive border border-white/10 space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#d97832]">Identidad soberana</div>
            <h3 className="text-lg font-bold text-[#f5f0e8]">Una cuenta, cuatro planos</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Tu registro te vincula con el Plano I (descubrir), el Plano II (comerciar), el Plano III
              (personalizar tu gamificación) y el Plano IV (gobernar el territorio a través del gemelo digital).
            </p>
            <GradientDivider />
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2"><Gift className="w-4 h-4 text-[#f2cc76] mt-0.5 shrink-0" />Recompensas de bienvenida: 250 XP iniciales.</li>
              <li className="flex items-start gap-2"><Trophy className="w-4 h-4 text-[#d97832] mt-0.5 shrink-0" />Misiones de la Comarca con insignias por rareza.</li>
              <li className="flex items-start gap-2"><HandCoins className="w-4 h-4 text-[#3f9b78] mt-0.5 shrink-0" />Los negocios pueden cobrar vía la economía phygital.</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl border border-[#c9d0d4]/70 bg-white/70">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#0d4652]">CROWN Gateway</div>
            <p className="text-xs text-[#536b86] leading-relaxed mt-2">
              El registro es la puerta de entrada al CROWN Gateway: la inteligencia federada de Isabella AI
              que correlaciona identidad, gamificación y territorio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

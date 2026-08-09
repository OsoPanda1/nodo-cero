'use client';

import { useMemo, useState } from 'react';
import {
  UserPlus,
  Store,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Trophy,
  Gift,
  Crown,
  MapPin,
  Clock,
  Truck,
  Image as ImageIcon,
  Phone,
  Globe,
  Tag,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { SectionHeader } from '@/components/design-system/SectionHeader';
import { GradientDivider } from '@/components/design-system/GradientDivider';
import {
  BUSINESS_PLANS,
  PREMIUM_USER_PLAN,
  BUSINESS_CATEGORIES,
  WEEKDAYS,
  IDENTITY_ROLES,
  type BusinessPlanId,
  type Weekday,
} from '@/lib/identity/contracts';

type RegisterKind = 'user' | 'business';
type PayMethod = 'card' | 'spei' | 'paypal';

const WEEKDAY_LABELS: Record<Weekday, string> = {
  lun: 'Lun', mar: 'Mar', mie: 'Mié', jue: 'Jue', vie: 'Vie', sab: 'Sáb', dom: 'Dom',
};

const PHOTO_SUGGESTIONS = [
  '/images/gastronomia-1.jpg',
  '/images/gastronomia-2.jpg',
  '/images/gastronomia-3.jpg',
  '/images/plaza-principal.jpg',
  '/images/callejon.jpg',
  '/images/centro.jpg',
];

interface RegisterResult {
  ok: boolean;
  id?: string;
  kind?: string;
  published?: boolean;
  plan?: string;
  premium?: boolean;
  error?: string;
}

const inputCls =
  'w-full rounded-xl border border-[#c9d0d4] bg-white/90 px-3.5 py-2.5 text-sm text-[#082f3b] placeholder-[#8a97a4] focus:border-[#c8a356] focus:ring-2 focus:ring-[#c8a356]/25 focus:outline-none transition-all';
const labelCls = 'text-xs font-mono font-bold text-[#0d4652]';

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className="text-[11px] text-[#8a97a4]">{hint}</p>}
    </div>
  );
}

export default function RegisterSection() {
  const [kind, setKind] = useState<RegisterKind>('business');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<RegisterResult | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  /* -------- Vecino -------- */
  const [uName, setUName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uRole, setURole] = useState<(typeof IDENTITY_ROLES)[number]>('vecino');
  const [uNeighborhood, setUNeighborhood] = useState('');
  const [uOccupation, setUOccupation] = useState('');
  const [wantPremium, setWantPremium] = useState(false);

  /* -------- Negocio: propietario -------- */
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [bEmail, setBEmail] = useState('');

  /* -------- Negocio: comercio -------- */
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState<string>(BUSINESS_CATEGORIES[0]);
  const [services, setServices] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [hours, setHours] = useState('');
  const [serviceDays, setServiceDays] = useState<Weekday[]>(['lun', 'mar', 'mie', 'jue', 'vie']);
  const [offers, setOffers] = useState('');
  const [homeDelivery, setHomeDelivery] = useState(false);
  const [photos, setPhotos] = useState<string[]>(['', '', '']);
  const [contactPhone, setContactPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [social, setSocial] = useState({ facebook: '', instagram: '', tiktok: '', whatsapp: '' });

  /* -------- Suscripción / pago -------- */
  const [plan, setPlan] = useState<BusinessPlanId>('mensual');
  const [method, setMethod] = useState<PayMethod>('card');

  const planPrice = BUSINESS_PLANS[plan].price;

  const toggleDay = (d: Weekday) =>
    setServiceDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const setPhoto = (i: number, v: string) =>
    setPhotos((prev) => prev.map((p, idx) => (idx === i ? v : p)));

  const cleanPhotos = useMemo(() => photos.map((p) => p.trim()).filter(Boolean), [photos]);

  /* Paso 1 -> Paso 2: valida lo esencial en cliente antes del pago. */
  const goToPayment = () => {
    setError(null);
    if (kind !== 'business') return;
    if (!ownerName.trim() || !ownerPhone.trim() || !bEmail.trim()) {
      setError('Completa los datos del propietario (nombre, teléfono y correo).');
      return;
    }
    if (!businessName.trim() || !services.trim() || !hours.trim() || !contactPhone.trim()) {
      setError('Completa los datos del comercio (nombre, giro, horarios y contacto).');
      return;
    }
    if (serviceDays.length === 0) {
      setError('Selecciona al menos un día de servicio.');
      return;
    }
    if (cleanPhotos.length === 0) {
      setError('Agrega al menos una foto de presentación.');
      return;
    }
    if (description.length > 250) {
      setError('La descripción no puede superar 250 caracteres.');
      return;
    }
    setStep(2);
  };

  /* Cobra la suscripción y SÓLO si el pago se confirma, registra/publica. */
  const payAndRegisterBusiness = async () => {
    setError(null);
    setSuccess(null);
    setBusy(true);
    try {
      const checkoutRes = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'subscription',
          amount: planPrice,
          method,
          concept: `Suscripción comercio ${BUSINESS_PLANS[plan].label}`,
        }),
      });
      const pay = await checkoutRes.json();
      if (!checkoutRes.ok || !pay.ok || pay.status !== 'confirmed') {
        setError('No se pudo procesar el pago de la suscripción. El registro no se completó.');
        return;
      }

      const socials = Object.fromEntries(
        Object.entries(social).map(([k, v]) => [k, v.trim()]).filter(([, v]) => v),
      );
      const geo =
        lat.trim() && lng.trim() && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng))
          ? { lat: Number(lat), lng: Number(lng) }
          : undefined;

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'business',
          ownerName: ownerName.trim(),
          ownerPhone: ownerPhone.trim(),
          email: bEmail.trim(),
          businessName: businessName.trim(),
          category,
          services: services.trim(),
          description: description.trim(),
          address: address.trim() || undefined,
          geo,
          hours: hours.trim(),
          serviceDays,
          offers: offers.trim() || undefined,
          homeDelivery,
          photos: cleanPhotos,
          contactPhone: contactPhone.trim(),
          website: website.trim() || undefined,
          socials: Object.keys(socials).length ? socials : undefined,
          subscription: { plan, paymentRef: pay.ref },
          acceptTerms: true,
        }),
      });
      const data = (await res.json()) as RegisterResult;
      if (!res.ok) {
        setError(
          data.error === 'EMAIL_ALREADY_REGISTERED'
            ? 'Ese correo ya está registrado en el Nodo.'
            : 'No se pudo publicar el comercio. Verifica los datos e intenta de nuevo.',
        );
        return;
      }
      setSuccess(data);
      setStep(1);
    } catch {
      setError('Error de red al procesar el registro.');
    } finally {
      setBusy(false);
    }
  };

  /* Alta de vecino (con o sin Premium). Premium requiere pago previo. */
  const registerUserFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setBusy(true);
    try {
      let premiumRef: string | undefined;
      if (wantPremium) {
        const checkoutRes = await fetch('/api/payments/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'subscription',
            amount: PREMIUM_USER_PLAN.price,
            method,
            concept: 'Suscripción usuario Premium',
          }),
        });
        const pay = await checkoutRes.json();
        if (!checkoutRes.ok || !pay.ok || pay.status !== 'confirmed') {
          setError('No se pudo procesar el pago Premium. Tu cuenta no se creó como Premium.');
          return;
        }
        premiumRef = pay.ref;
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'user',
          name: uName.trim(),
          email: uEmail.trim(),
          role: uRole,
          neighborhood: uNeighborhood.trim() || undefined,
          occupation: uOccupation.trim() || undefined,
          interests: [],
          premium: premiumRef ? { paymentRef: premiumRef } : undefined,
          acceptTerms: true,
        }),
      });
      const data = (await res.json()) as RegisterResult;
      if (!res.ok) {
        setError(
          data.error === 'EMAIL_ALREADY_REGISTERED'
            ? 'Ese correo ya está registrado en el Nodo.'
            : 'No se pudo completar el registro.',
        );
        return;
      }
      setSuccess(data);
    } catch {
      setError('Error de red al registrarte.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        badge="PLANO III · PERSONALIZA"
        title="Registro de vecinos y comercios del Real"
        description="Crea tu identidad soberana en el Nodo Cero. Los comercios se publican en el mapa, el catálogo y las recomendaciones de Isabella sólo con su suscripción activa."
      />

      {/* Selector de tipo */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-[#c9d0d4]/70 bg-white/70 w-fit mx-auto">
        <button
          type="button"
          onClick={() => { setKind('user'); setStep(1); setError(null); setSuccess(null); }}
          className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            kind === 'user' ? 'bg-[#0d4652] text-[#f2cc76] shadow-md' : 'text-[#536b86] hover:text-[#082f3b]'
          }`}
        >
          <UserPlus className="w-4 h-4" /> Vecino
        </button>
        <button
          type="button"
          onClick={() => { setKind('business'); setStep(1); setError(null); setSuccess(null); }}
          className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            kind === 'business' ? 'bg-[#0d4652] text-[#f2cc76] shadow-md' : 'text-[#536b86] hover:text-[#082f3b]'
          }`}
        >
          <Store className="w-4 h-4" /> Negocio
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      {success?.ok && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="space-y-0.5">
            <p className="font-bold">
              {success.kind === 'business'
                ? 'Comercio publicado en el Nodo Cero'
                : success.premium
                  ? 'Cuenta Premium activada'
                  : 'Registro completado en el Nodo Cero'}
            </p>
            <p className="font-mono text-xs">
              {success.kind === 'business'
                ? `Ya apareces en mapa, catálogo, banners y recomendaciones de Isabella · Plan ${success.plan}`
                : `Identificador: ${success.id}`}
            </p>
          </div>
        </div>
      )}

      {kind === 'user' ? (
        <UserForm
          {...{
            uName, setUName, uEmail, setUEmail, uRole, setURole, uNeighborhood, setUNeighborhood,
            uOccupation, setUOccupation, wantPremium, setWantPremium, method, setMethod, busy,
            onSubmit: registerUserFlow,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 p-6 rounded-2xl border border-[#c9d0d4]/70 bg-white/75 space-y-6">
            {/* Progreso */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className={`flex items-center gap-1.5 ${step === 1 ? 'text-[#0d4652] font-bold' : 'text-[#8a97a4]'}`}>
                <span className={`h-6 w-6 rounded-full flex items-center justify-center ${step === 1 ? 'bg-[#0d4652] text-white' : 'bg-[#e5e9ea] text-[#8a97a4]'}`}>1</span>
                Datos
              </span>
              <span className="h-px flex-1 bg-[#c9d0d4]" />
              <span className={`flex items-center gap-1.5 ${step === 2 ? 'text-[#0d4652] font-bold' : 'text-[#8a97a4]'}`}>
                <span className={`h-6 w-6 rounded-full flex items-center justify-center ${step === 2 ? 'bg-[#0d4652] text-white' : 'bg-[#e5e9ea] text-[#8a97a4]'}`}>2</span>
                Suscripción
              </span>
            </div>

            {step === 1 ? (
              <div className="space-y-6">
                {/* Propietario */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-[#0d4652]"><ShieldCheck className="w-4 h-4 text-[#c8a356]" /> Datos del propietario</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Nombre del propietario"><input className={inputCls} value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Nombre y apellidos" /></Field>
                    <Field label="Teléfono del propietario"><input className={inputCls} value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} placeholder="771 000 0000" /></Field>
                  </div>
                  <Field label="Correo de la cuenta"><input type="email" className={inputCls} value={bEmail} onChange={(e) => setBEmail(e.target.value)} placeholder="negocio@ejemplo.mx" /></Field>
                </div>

                <GradientDivider />

                {/* Comercio */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-[#0d4652]"><Store className="w-4 h-4 text-[#c8a356]" /> Datos del comercio</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Nombre del comercio"><input className={inputCls} value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Ej. Pastería La Cornish" /></Field>
                    <Field label="Rubro / categoría">
                      <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
                        {BUSINESS_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>
                  <Field label="Giro o servicios que ofrece"><input className={inputCls} value={services} onChange={(e) => setServices(e.target.value)} placeholder="Ej. Pastes tradicionales, café de olla, repostería" /></Field>
                  <Field label={`Descripción (${description.length}/250)`}>
                    <textarea
                      className={`${inputCls} resize-none`}
                      rows={3}
                      maxLength={250}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Cuenta la historia y el sello de tu comercio (máx. 250 caracteres)."
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Dirección"><input className={inputCls} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Calle, número y localidad" /></Field>
                    <Field label="Horarios"><div className="relative"><Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a97a4]" /><input className={`${inputCls} pl-9`} value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Ej. 09:00 – 20:00" /></div></Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Latitud (mapa)" hint="Opcional, para el mapa interactivo"><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a97a4]" /><input className={`${inputCls} pl-9`} value={lat} onChange={(e) => setLat(e.target.value)} placeholder="20.1447" /></div></Field>
                    <Field label="Longitud (mapa)" hint="Opcional"><input className={inputCls} value={lng} onChange={(e) => setLng(e.target.value)} placeholder="-98.6672" /></Field>
                  </div>

                  {/* Días de servicio */}
                  <Field label="Días de servicio">
                    <div className="flex flex-wrap gap-2">
                      {WEEKDAYS.map((d) => (
                        <button
                          type="button"
                          key={d}
                          onClick={() => toggleDay(d)}
                          className={`h-9 w-12 rounded-lg text-xs font-mono font-bold transition-all ${
                            serviceDays.includes(d)
                              ? 'bg-[#0d4652] text-[#f2cc76] shadow'
                              : 'bg-white border border-[#c9d0d4] text-[#536b86] hover:border-[#c8a356]'
                          }`}
                        >
                          {WEEKDAY_LABELS[d]}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Ofertas / promociones"><div className="relative"><Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a97a4]" /><input className={`${inputCls} pl-9`} value={offers} onChange={(e) => setOffers(e.target.value)} placeholder="Ej. 2x1 en pastes los martes" /></div></Field>
                    <Field label="Teléfono / contacto para pedidos"><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a97a4]" /><input className={`${inputCls} pl-9`} value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="771 111 2222 / WhatsApp" /></div></Field>
                  </div>

                  {/* Entrega a domicilio */}
                  <button
                    type="button"
                    onClick={() => setHomeDelivery((v) => !v)}
                    className={`flex items-center gap-3 w-full rounded-xl border px-4 py-3 text-left transition-all ${
                      homeDelivery ? 'border-[#3f9b78] bg-[#3f9b78]/10' : 'border-[#c9d0d4] bg-white/70'
                    }`}
                  >
                    <Truck className={`w-5 h-5 ${homeDelivery ? 'text-[#3f9b78]' : 'text-[#8a97a4]'}`} />
                    <span className="flex-1 text-sm font-medium text-[#082f3b]">Entrega a domicilio</span>
                    <span className={`h-6 w-11 rounded-full p-0.5 transition-all ${homeDelivery ? 'bg-[#3f9b78]' : 'bg-[#c9d0d4]'}`}>
                      <span className={`block h-5 w-5 rounded-full bg-white transition-transform ${homeDelivery ? 'translate-x-5' : ''}`} />
                    </span>
                  </button>

                  {/* Fotos */}
                  <Field label="Fotos de presentación (hasta 3)" hint="Pega la URL de la imagen o elige una sugerencia.">
                    <div className="space-y-3">
                      {photos.map((p, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#c9d0d4] bg-[#eef1ec] flex items-center justify-center">
                            {p.trim() ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={p.trim() || "/placeholder.svg"} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-[#8a97a4]" />
                            )}
                          </div>
                          <input className={inputCls} value={p} onChange={(e) => setPhoto(i, e.target.value)} placeholder={`URL de la foto ${i + 1}`} />
                        </div>
                      ))}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {PHOTO_SUGGESTIONS.map((src) => (
                          <button
                            type="button"
                            key={src}
                            onClick={() => {
                              const empty = photos.findIndex((x) => !x.trim());
                              setPhoto(empty === -1 ? 0 : empty, src);
                            }}
                            className="h-10 w-14 overflow-hidden rounded-md border border-[#c9d0d4] hover:border-[#c8a356] transition"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src || "/placeholder.svg"} alt="Sugerencia" className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Sitio web (opcional)"><div className="relative"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a97a4]" /><input className={`${inputCls} pl-9`} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://…" /></div></Field>
                    <Field label="WhatsApp / redes"><input className={inputCls} value={social.whatsapp} onChange={(e) => setSocial((s) => ({ ...s, whatsapp: e.target.value }))} placeholder="WhatsApp o @usuario" /></Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Facebook"><input className={inputCls} value={social.facebook} onChange={(e) => setSocial((s) => ({ ...s, facebook: e.target.value }))} placeholder="/tucomercio" /></Field>
                    <Field label="Instagram"><input className={inputCls} value={social.instagram} onChange={(e) => setSocial((s) => ({ ...s, instagram: e.target.value }))} placeholder="@tucomercio" /></Field>
                    <Field label="TikTok"><input className={inputCls} value={social.tiktok} onChange={(e) => setSocial((s) => ({ ...s, tiktok: e.target.value }))} placeholder="@tucomercio" /></Field>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={goToPayment}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d4652] px-4 py-3 text-sm font-bold text-[#f2cc76] shadow-[0_8px_24px_rgba(13,70,82,0.25)] transition-all hover:shadow-[0_10px_32px_rgba(13,70,82,0.4)]"
                >
                  Continuar a la suscripción <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <PlanStep
                {...{ plan, setPlan, method, setMethod, busy, planPrice, onBack: () => setStep(1), onPay: payAndRegisterBusiness }}
              />
            )}
          </div>

          <SidePanel kind="business" />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Paso 2 — plan + pago                                                */
/* ------------------------------------------------------------------ */
function PlanStep({
  plan, setPlan, method, setMethod, busy, planPrice, onBack, onPay,
}: {
  plan: BusinessPlanId;
  setPlan: (p: BusinessPlanId) => void;
  method: PayMethod;
  setMethod: (m: PayMethod) => void;
  busy: boolean;
  planPrice: number;
  onBack: () => void;
  onPay: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[#c8a356]/40 bg-[#c8a356]/10 px-4 py-3 text-xs text-[#7a5a15] flex items-start gap-2">
        <Lock className="w-4 h-4 shrink-0 mt-0.5" />
        Sin el pago de la suscripción no se realiza el registro ni se publica el comercio.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(Object.keys(BUSINESS_PLANS) as BusinessPlanId[]).map((id) => {
          const p = BUSINESS_PLANS[id];
          const active = plan === id;
          const monthly = Math.round(p.price / p.months);
          return (
            <button
              key={id}
              type="button"
              onClick={() => setPlan(id)}
              className={`text-left rounded-2xl border p-5 transition-all ${
                active ? 'border-[#c8a356] bg-white shadow-[0_10px_30px_rgba(200,163,86,0.2)] ring-2 ring-[#c8a356]/30' : 'border-[#c9d0d4] bg-white/70 hover:border-[#c8a356]/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0d4652]">{p.label}</span>
                {id === 'semestral' && <span className="rounded-full bg-[#3f9b78]/15 px-2 py-0.5 text-[10px] font-bold text-[#3f9b78]">MEJOR VALOR</span>}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-serif text-3xl font-black text-[#082f3b]">${p.price}</span>
                <span className="text-xs text-[#8a97a4]">MXN</span>
              </div>
              <p className="mt-1 text-[11px] text-[#536b86]">≈ ${monthly} MXN / mes · {p.months} {p.months === 1 ? 'mes' : 'meses'}</p>
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        <span className={labelCls}>Método de pago</span>
        <div className="flex flex-wrap gap-2">
          {(['card', 'spei', 'paypal'] as PayMethod[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`rounded-lg border px-4 py-2 text-xs font-semibold uppercase transition-all ${
                method === m ? 'border-[#c8a356] bg-[#c8a356]/15 text-[#7a5a15]' : 'border-[#c9d0d4] text-[#536b86] hover:border-[#c8a356]/60'
              }`}
            >
              {m === 'card' ? 'Tarjeta' : m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={busy}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#c9d0d4] bg-white px-4 py-3 text-sm font-bold text-[#536b86] transition hover:border-[#0d4652] disabled:opacity-60"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <button
          type="button"
          onClick={onPay}
          disabled={busy}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#c8a356] to-[#b85c3c] px-4 py-3 text-sm font-bold text-[#04060a] shadow-[0_8px_24px_rgba(200,163,86,0.35)] transition-all hover:shadow-[0_10px_32px_rgba(200,163,86,0.55)] disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          Pagar ${planPrice} MXN y publicar
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Formulario de vecino                                                */
/* ------------------------------------------------------------------ */
function UserForm(props: {
  uName: string; setUName: (v: string) => void;
  uEmail: string; setUEmail: (v: string) => void;
  uRole: (typeof IDENTITY_ROLES)[number]; setURole: (v: (typeof IDENTITY_ROLES)[number]) => void;
  uNeighborhood: string; setUNeighborhood: (v: string) => void;
  uOccupation: string; setUOccupation: (v: string) => void;
  wantPremium: boolean; setWantPremium: (v: boolean) => void;
  method: PayMethod; setMethod: (m: PayMethod) => void;
  busy: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const {
    uName, setUName, uEmail, setUEmail, uRole, setURole, uNeighborhood, setUNeighborhood,
    uOccupation, setUOccupation, wantPremium, setWantPremium, method, setMethod, busy, onSubmit,
  } = props;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <form onSubmit={onSubmit} className="lg:col-span-3 p-6 rounded-2xl border border-[#c9d0d4]/70 bg-white/75 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre completo"><input className={inputCls} value={uName} onChange={(e) => setUName(e.target.value)} placeholder="Ej. María de los Ángeles" required /></Field>
          <Field label="Correo"><input type="email" className={inputCls} value={uEmail} onChange={(e) => setUEmail(e.target.value)} placeholder="tucorreo@ejemplo.mx" required /></Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Rol en la Comarca">
            <select className={inputCls} value={uRole} onChange={(e) => setURole(e.target.value as typeof uRole)}>
              {IDENTITY_ROLES.map((r) => <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>)}
            </select>
          </Field>
          <Field label="Barrio o comunidad"><input className={inputCls} value={uNeighborhood} onChange={(e) => setUNeighborhood(e.target.value)} placeholder="Ej. El Arbolito" /></Field>
        </div>
        <Field label="Oficio u ocupación"><input className={inputCls} value={uOccupation} onChange={(e) => setUOccupation(e.target.value)} placeholder="Ej. Platería, guía de minas…" /></Field>

        {/* Upsell Premium */}
        <button
          type="button"
          onClick={() => setWantPremium(!wantPremium)}
          className={`w-full rounded-2xl border p-5 text-left transition-all ${
            wantPremium ? 'border-[#c8a356] bg-gradient-to-br from-[#fff8ea] to-white ring-2 ring-[#c8a356]/30' : 'border-[#c9d0d4] bg-white/70 hover:border-[#c8a356]/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-bold text-[#082f3b]"><Crown className="w-4 h-4 text-[#c8a356]" /> Cuenta Premium</span>
            <span className="font-serif text-xl font-black text-[#082f3b]">$129 <span className="text-xs font-sans text-[#8a97a4]">MXN/mes</span></span>
          </div>
          <p className="mt-1.5 text-xs text-[#536b86]">
            Desbloquea cupones, descuentos y la monetización de la gamificación. Sin Premium, tu cuenta gratuita puede explorar pero no canjear recompensas.
          </p>
          <span className={`mt-3 inline-flex items-center gap-1.5 text-[11px] font-mono font-bold ${wantPremium ? 'text-[#3f9b78]' : 'text-[#8a97a4]'}`}>
            <CheckCircle2 className="w-3.5 h-3.5" /> {wantPremium ? 'Premium seleccionado' : 'Toca para agregar Premium'}
          </span>
        </button>

        {wantPremium && (
          <div className="space-y-2">
            <span className={labelCls}>Método de pago Premium</span>
            <div className="flex flex-wrap gap-2">
              {(['card', 'spei', 'paypal'] as PayMethod[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`rounded-lg border px-4 py-2 text-xs font-semibold uppercase transition-all ${
                    method === m ? 'border-[#c8a356] bg-[#c8a356]/15 text-[#7a5a15]' : 'border-[#c9d0d4] text-[#536b86] hover:border-[#c8a356]/60'
                  }`}
                >
                  {m === 'card' ? 'Tarjeta' : m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d4652] px-4 py-3 text-sm font-bold text-[#f2cc76] shadow-[0_8px_24px_rgba(13,70,82,0.25)] transition-all hover:shadow-[0_10px_32px_rgba(13,70,82,0.4)] disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          {wantPremium ? `Registrarme y pagar Premium ($129 MXN)` : 'Crear mi cuenta gratuita'}
        </button>
      </form>

      <SidePanel kind="user" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Panel lateral                                                       */
/* ------------------------------------------------------------------ */
function SidePanel({ kind }: { kind: RegisterKind }) {
  return (
    <div className="lg:col-span-2 space-y-5">
      <div className="p-6 rounded-2xl glass-panel-interactive border border-white/10 space-y-4">
        <div className="text-[10px] font-mono uppercase tracking-widest text-[#d4b26a]">
          {kind === 'business' ? 'Suscripción de comercios' : 'Identidad soberana'}
        </div>
        <h3 className="text-lg font-bold text-[#f5f0e8]">
          {kind === 'business' ? 'Qué incluye tu publicación' : 'Una cuenta, cuatro planos'}
        </h3>
        {kind === 'business' ? (
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#38bdf8] mt-0.5 shrink-0" />Aparición en el mapa interactivo del territorio.</li>
            <li className="flex items-start gap-2"><Store className="w-4 h-4 text-[#c8a356] mt-0.5 shrink-0" />Ficha en el catálogo de comercios.</li>
            <li className="flex items-start gap-2"><Sparkles className="w-4 h-4 text-[#b85c3c] mt-0.5 shrink-0" />Presencia en los banners de publicidad.</li>
            <li className="flex items-start gap-2"><Trophy className="w-4 h-4 text-[#3f9b78] mt-0.5 shrink-0" />Recomendaciones de Isabella AI a los visitantes.</li>
          </ul>
        ) : (
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2"><Gift className="w-4 h-4 text-[#f2cc76] mt-0.5 shrink-0" />250 XP de bienvenida al crear tu cuenta.</li>
            <li className="flex items-start gap-2"><Crown className="w-4 h-4 text-[#c8a356] mt-0.5 shrink-0" />Premium: cupones, descuentos y monetización.</li>
            <li className="flex items-start gap-2"><Trophy className="w-4 h-4 text-[#b85c3c] mt-0.5 shrink-0" />Misiones de la Comarca con insignias por rareza.</li>
          </ul>
        )}
        <GradientDivider />
        <p className="text-xs text-slate-400 leading-relaxed font-light">
          El registro es la puerta al CROWN Gateway: la inteligencia federada de Isabella AI que correlaciona
          identidad, gamificación y territorio.
        </p>
      </div>
    </div>
  );
}

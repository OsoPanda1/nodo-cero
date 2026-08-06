import type { Metadata, Viewport } from 'next';
import { Playfair_Display, DM_Sans, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-editorial',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-rdm-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
});

const SITE_URL = 'https://rdm-digital-hub.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'RDM Digital Hub — Nodo Cero | Real del Monte, Hidalgo',
    template: '%s | RDM Digital Hub — Nodo Cero',
  },
  description:
    'Sistema Operativo Territorial y plataforma de inteligencia soberana para Real del Monte, Hidalgo, México: gemelo digital 2D/3D, arquitectura heptafederada YUN, Isabella AI, turismo y economía phygital.',
  keywords: [
    'Real del Monte',
    'Pueblo Mágico',
    'Hidalgo',
    'México',
    'Comarca Minera',
    'gemelo digital',
    'Isabella AI',
    'arquitectura heptafederada',
    'turismo territorial',
    'economía phygital',
    'plata .925',
    'pastes tradicionales',
    'RDM Digital Hub',
  ],
  authors: [{ name: 'TAMV Online Network / OsoPanda1' }],
  creator: 'TAMV Online Network',
  publisher: 'TAMV Online Network',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: '/',
    siteName: 'RDM Digital Hub — Nodo Cero',
    title: 'RDM Digital Hub — Nodo Cero | Real del Monte, Hidalgo',
    description:
      'Sistema de Inteligencia Territorial soberano para Real del Monte: gemelo digital 2D/3D, rutas turísticas, Festival del Paste, Isabella AI y economía phygital de la plata y el paste.',
    images: [
      {
        url: '/images/hero.png',
        width: 1200,
        height: 630,
        alt: 'RDM Digital Hub — Nodo Cero, Real del Monte',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RDM Digital Hub — Nodo Cero | Real del Monte',
    description:
      'Gemelo digital turístico del Pueblo Mágico de Real del Monte, Hidalgo: rutas, minas, pastes, plata y asistencia cognitiva de Isabella AI.',
    images: ['/images/hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
  icons: {
    icon: '/images/hero.png',
    apple: '/images/hero.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#020617',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-[radial-gradient(circle_at_0%_0%,#0a0b0e,#020617_45%,#000)] text-slate-100 ${playfair.variable} ${dmSans.variable} ${cormorant.variable} ${jetbrainsMono.variable}`}
      >
        <div className="flex min-h-screen flex-col">
          {/* Shell superior: nombre del sistema y nodo */}
          <header className="border-b border-amber-900/20 bg-black/40 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <div className="flex flex-col">
                <span className="text-xs font-medium tracking-[0.18em] text-amber-200/70">
                  SISTEMA OPERATIVO TERRITORIAL
                </span>
                <span className="font-patrimonial text-sm font-semibold text-cream-100 text-[#f5f0e8]">
                  RDM Digital Hub — Nodo Cero · Real del Monte, Hidalgo
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Isabella AI · Arquitectura Heptafederada YUN
              </span>
            </div>
          </header>

          {/* Contenedor principal de aplicación */}
          <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-4">
            {children}
          </main>

          {/* Pie institucional — marca, autoría y gobernanza */}
          <footer className="border-t border-amber-900/20 bg-black/60 backdrop-blur-xl">
            <div className="mx-auto max-w-6xl px-4 py-10">
              <div className="grid gap-10 md:grid-cols-3">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#c9d0d4] via-[#f2cc76] to-[#2e9cff] p-px">
                      <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#082f3b] font-black text-xs text-white">
                        RDM
                      </div>
                    </div>
                    <div>
                      <p className="font-patrimonial text-sm font-bold tracking-wide text-[#f5f0e8]">
                        RDM Digital Hub — Nodo Cero
                      </p>
                      <p className="font-rdm-mono text-[10px] tracking-widest text-slate-500">
                        REAL DEL MONTE · HIDALGO · MÉXICO
                      </p>
                    </div>
                  </div>
                  <p className="max-w-xs text-xs leading-relaxed text-slate-400">
                    Sistema de inteligencia territorial soberano. Patrimonio minero, cristal
                    contemporáneo, gobernanza digital e inteligencia viva del territorio.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="font-rdm-mono text-[10px] uppercase tracking-widest text-[#d4b26a]">
                    Experiencias
                  </p>
                  <ul className="space-y-1.5 text-slate-400">
                    <li>Descubre · turismo y patrimonio</li>
                    <li>Vive · gastronomía y eventos</li>
                    <li>Conecta · comercio y comunidad</li>
                    <li>Participa · gamificación y honor</li>
                    <li>Gestiona · gemelo digital y ciudad</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <p className="font-rdm-mono text-[10px] uppercase tracking-widest text-[#d4b26a]">
                    Autoría
                  </p>
                  <p className="font-editorial text-2xl font-medium leading-tight text-[#f5f0e8]">
                    Anubis Villaseñor
                  </p>
                  <p className="text-xs leading-relaxed text-slate-400">
                    Founder · Architect · Cognitive Systems
                    <br />
                    Sistemas territoriales · Inteligencia cognitiva
                    <br />
                    Gobernanza digital · Experiencias inmersivas
                  </p>
                  <p className="font-rdm-mono text-[10px] text-slate-500">
                    TAMV Online Network / OsoPanda1 · RDM Digital Hub
                  </p>
                </div>
              </div>

              <hr className="rdm-divider my-8" />

              <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                <span className="text-xs text-slate-500">
                  © {new Date().getFullYear()} TAMV Online Network · RDM Digital Hub — Nodo Cero
                </span>
                <span className="font-rdm-mono text-xs text-slate-500">
                  Comarca Minera · Real del Monte · Hidalgo · México
                </span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

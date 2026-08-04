import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://rdm-digital-hub.vercel.app'),
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
  themeColor: '#02030a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-[radial-gradient(circle_at_0%_0%,#0f172a,#020617_45%,#000)] text-slate-100">
        <div className="flex min-h-screen flex-col">
          {/* Shell superior: nombre del sistema y nodo */}
          <header className="border-b border-white/5 bg-black/30 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <div className="flex flex-col">
                <span className="text-xs font-medium tracking-[0.18em] text-slate-400">
                  SISTEMA OPERATIVO TERRITORIAL
                </span>
                <span className="text-sm font-semibold text-slate-100">
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

          {/* Pie sobrio con identidad */}
          <footer className="border-t border-white/5 bg-black/40 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <span className="text-xs text-slate-500">
                © {new Date().getFullYear()} TAMV Online Network · RDM Digital Hub
              </span>
              <span className="text-xs font-mono text-slate-500">
                Comarca Minera · Real del Monte · Hidalgo · México
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

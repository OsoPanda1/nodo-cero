import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  metadataBase: new URL('https://rdm-digital-hub.vercel.app'),
  title: {
    default: 'RDM Digital Hub — Nodo Cero | Real del Monte, Hidalgo',
    template: '%s | RDM Digital Hub — Nodo Cero',
  },
  description:
    'Plataforma digital soberana y Sistema de Inteligencia Territorial en tiempo real para Real del Monte, Hidalgo, México. Arquitectura Heptafederada YUN, Isabella AI, Criptografía Post-Cuántica, Gemelo Digital 2D/3D Phygital, turismo, gastronomía y patrimonio minero.',
  keywords: [
    'Real del Monte',
    'Pueblo Mágico',
    'Hidalgo',
    'México',
    'turismo',
    'Ruta del Paste',
    'Mina de Acosta',
    'Panteón Inglés',
    'gemelo digital',
    'Isabella AI',
    'Comarca Minera',
    'Pastes tradicionales',
    'platería .925',
    'RDM Digital Hub',
  ],
  authors: [{name: 'TAMV Online Network / OsoPanda1'}],
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
      'Gemelo digital turístico del Pueblo Mágico de Real del Monte, Hidalgo: rutas, minas, pastes, plata y la asistencia de Isabella AI.',
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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#04060a',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

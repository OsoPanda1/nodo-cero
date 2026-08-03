import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'RDM Digital Hub — Nodo Cero | Real del Monte',
  description: 'Sistema de Inteligencia Territorial en tiempo real, Arquitectura Heptafederada YUN, Isabella AI, Criptografía Post-Cuántica y Gemelo Digital 2D/3D Phygital para Real del Monte, Hidalgo.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

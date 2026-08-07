import { NextResponse } from 'next/server';
import { guardedRoute } from '@/app/api/_shared/route-guard';
import { verifyDemoSignature } from '@/lib/archive/archive-storage';

export const runtime = 'nodejs';

const PLACEHOLDER_TITLE = 'ARCHIVO HISTÓRICO RDM DIGITAL · MODO DEMO';

/* ------------------------------------------------------------------ */
/* GET /api/archive/demo-file — entrega firmada en modo demo           */
/* ------------------------------------------------------------------ */
/* En modo demo no hay objetos reales en Storage: la URL firmada       */
/* resuelve a un marcador de posición que representa el derivado. En   */
/* producción el tráfico va a Supabase Storage con URL firmada.        */
export const GET = guardedRoute(
  {
    route: 'api:archive:demo-file',
    methods: ['GET'],
    rateLimit: 30,
    json: false,
    cacheControl: 'no-store',
  },
  async ({ req }) => {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    if (!verifyDemoSignature(params)) {
      return NextResponse.json({ ok: false, error: 'FIRMA_INVALIDA' }, { status: 403 });
    }

    const name = params.name ?? 'archivo-rdm';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#082f3b"/><stop offset="1" stop-color="#0d4652"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)"/>
      <circle cx="1000" cy="140" r="180" fill="#f2cc76" opacity="0.25"/>
      <text x="600" y="360" text-anchor="middle" font-family="Georgia,serif" font-size="44" fill="#f2cc76">ARCHIVO RDM DIGITAL</text>
      <text x="600" y="430" text-anchor="middle" font-family="monospace" font-size="22" fill="#eef1ec">${PLACEHOLDER_TITLE}</text>
      <text x="600" y="520" text-anchor="middle" font-family="monospace" font-size="18" fill="#9fc3cc">${name.replace(/"/g, '')}</text>
      <text x="600" y="580" text-anchor="middle" font-family="monospace" font-size="14" fill="#6f9aa5">En producción este enlace entrega el derivado autorizado desde Supabase Storage.</text>
    </svg>`;

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Content-Disposition': `inline; filename="${encodeURIComponent(name)}.svg"`,
        'Cache-Control': 'no-store',
      },
    });
  },
);

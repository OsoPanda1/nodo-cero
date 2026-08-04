import { NextRequest, NextResponse } from 'next/server';
import { handleIsabellaPost } from '@/lib/isabella/http';

const ROUTE_ID = 'api:isabella:chat';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const startedAt = Date.now();

  try {
    // Validación básica de método y contenido
    if (req.method !== 'POST') {
      return NextResponse.json(
        {
          route: ROUTE_ID,
          ok: false,
          error: 'METHOD_NOT_ALLOWED',
          message: 'Sólo se admite el método POST para este endpoint.',
        },
        {
          status: 405,
          headers: {
            'Allow': 'POST',
          },
        },
      );
    }

    const contentType = req.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json');

    if (!isJson) {
      return NextResponse.json(
        {
          route: ROUTE_ID,
          ok: false,
          error: 'UNSUPPORTED_MEDIA_TYPE',
          message: 'El cuerpo de la petición debe ser JSON (application/json).',
        },
        { status: 415 },
      );
    }

    // Delegación al núcleo Isabella (C.R.O.W.N. / ISA API v4.0)
    const response = await handleIsabellaPost(req);

    // Normalizamos headers de seguridad mínimos a nivel de ruta
    const elapsedMs = Date.now() - startedAt;

    const secureHeaders: Record<string, string> = {
      'X-Isabella-Route': ROUTE_ID,
      'X-Isabella-Latency-Ms': String(elapsedMs),
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
    };

    // Si handleIsabellaPost ya devuelve NextResponse, respetamos su body/status y sólo reforzamos headers
    const merged = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        ...secureHeaders,
      },
    });

    return merged;
  } catch (error: unknown) {
    const elapsedMs = Date.now() - startedAt;

    // Falla controlada con respuesta JSON uniforme
    return NextResponse.json(
      {
        route: ROUTE_ID,
        ok: false,
        error: 'INTERNAL_ISABELLA_ERROR',
        message: 'Ocurrió un error no controlado al procesar la petición de Isabella.',
        details:
          process.env.NODE_ENV === 'development'
            ? String(error)
            : undefined,
        meta: {
          latencyMs: elapsedMs,
        },
      },
      {
        status: 500,
        headers: {
          'X-Isabella-Route': ROUTE_ID,
          'X-Isabella-Latency-Ms': String(elapsedMs),
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'no-referrer',
        },
      },
    );
  }
}

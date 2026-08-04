import { NextRequest, NextResponse } from 'next/server';
import { handleIsabellaGet, handleIsabellaPost } from '@/lib/isabella/http';

const ROUTE_ID_POST = 'api:isabella:post';
const ROUTE_ID_GET = 'api:isabella:get';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const startedAt = Date.now();

  try {
    if (req.method !== 'POST') {
      return NextResponse.json(
        {
          route: ROUTE_ID_POST,
          ok: false,
          error: 'METHOD_NOT_ALLOWED',
          message: 'Sólo se admite el método POST para este endpoint de interacción Isabella.',
        },
        {
          status: 405,
          headers: { Allow: 'POST' },
        },
      );
    }

    const contentType = req.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json');

    if (!isJson) {
      return NextResponse.json(
        {
          route: ROUTE_ID_POST,
          ok: false,
          error: 'UNSUPPORTED_MEDIA_TYPE',
          message: 'El cuerpo de la petición debe ser JSON (application/json).',
        },
        { status: 415 },
      );
    }

    // Delegación al núcleo general Isabella (chat/intents)
    const response = await handleIsabellaPost(req);

    const elapsedMs = Date.now() - startedAt;

    const secureHeaders: Record<string, string> = {
      'X-Isabella-Route': ROUTE_ID_POST,
      'X-Isabella-Latency-Ms': String(elapsedMs),
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
    };

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

    return NextResponse.json(
      {
        route: ROUTE_ID_POST,
        ok: false,
        error: 'INTERNAL_ISABELLA_POST_ERROR',
        message:
          'Ocurrió un error no controlado al procesar la petición POST de Isabella.',
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
          'X-Isabella-Route': ROUTE_ID_POST,
          'X-Isabella-Latency-Ms': String(elapsedMs),
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'no-referrer',
        },
      },
    );
  }
}

export async function GET(): Promise<NextResponse> {
  const startedAt = Date.now();

  try {
    // Delegación al núcleo de manifest/health Isabella
    const response = await handleIsabellaGet();

    const elapsedMs = Date.now() - startedAt;

    const secureHeaders: Record<string, string> = {
      'X-Isabella-Route': ROUTE_ID_GET,
      'X-Isabella-Latency-Ms': String(elapsedMs),
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
    };

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

    return NextResponse.json(
      {
        route: ROUTE_ID_GET,
        ok: false,
        error: 'INTERNAL_ISABELLA_GET_ERROR',
        message:
          'Ocurrió un error no controlado al procesar la petición GET de manifest/health Isabella.',
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
          'X-Isabella-Route': ROUTE_ID_GET,
          'X-Isabella-Latency-Ms': String(elapsedMs),
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'no-referrer',
        },
      },
    );
  }
}

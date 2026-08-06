import { NextResponse } from 'next/server';
import { guardedRoute } from '@/app/api/_shared/route-guard';
import { registerSchema, type RegisterInput } from '@/lib/identity/contracts';
import { registerUser, registerBusiness } from '@/lib/identity/store';

export const runtime = 'nodejs';

/* ------------------------------------------------------------------ */
/* POST /api/auth/register — alta de vecino o negocio del territorio   */
/* ------------------------------------------------------------------ */
/* Validado por contrato zod (discriminated union kind). Emite eventos */
/* identity.* al bus para que el fabric cognitivo los correlacione.    */
/* ------------------------------------------------------------------ */
export const POST = guardedRoute<RegisterInput>(
  {
    route: 'api:auth:register',
    methods: ['POST'],
    rateLimit: 10,
    schema: registerSchema,
    cacheControl: 'no-store',
  },
  async ({ body }) => {
    if (body.kind === 'user') {
      const result = registerUser(body);
      if (!result.ok) return NextResponse.json({ ok: false, error: result.reason }, { status: 409 });
      return NextResponse.json({ ok: true, kind: 'user', id: result.user.id }, { status: 201 });
    }

    const result = registerBusiness(body);
    if (!result.ok) return NextResponse.json({ ok: false, error: result.reason }, { status: 409 });
    return NextResponse.json({ ok: true, kind: 'business', id: result.user.id }, { status: 201 });
  },
);

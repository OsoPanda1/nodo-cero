import { NextResponse } from 'next/server';
import { guardedRoute } from '@/app/api/_shared/route-guard';
import { userPaymentSchema, type UserPayment } from '@/lib/payments/contracts';
import { createPayment, confirmPayment } from '@/lib/payments/engine';

export const runtime = 'nodejs';

/* ------------------------------------------------------------------ */
/* POST /api/payments/checkout — pago de usuario (donación/compra)     */
/* ------------------------------------------------------------------ */
/* Crea la intención de pago validada por contrato zod y la asienta    */
/* de forma instantánea (modo demo). Devuelve referencia verificable.  */
/* ------------------------------------------------------------------ */
export const POST = guardedRoute<UserPayment>(
  {
    route: 'api:payments:checkout',
    methods: ['POST'],
    rateLimit: 15,
    schema: userPaymentSchema,
    cacheControl: 'no-store',
  },
  async ({ body }) => {
    const intent = createPayment(body);
    const confirmed = confirmPayment(intent.ref);
    return NextResponse.json({
      ok: true,
      ref: confirmed?.ref ?? intent.ref,
      status: confirmed?.status ?? intent.status,
      amount: intent.amount,
      currency: intent.currency,
      method: intent.method,
      serverTime: Date.now(),
    });
  },
);

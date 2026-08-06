import { NextResponse } from 'next/server';
import { guardedRoute } from '@/app/api/_shared/route-guard';
import { merchantPayoutSchema, type MerchantPayout } from '@/lib/payments/contracts';
import { requestPayout, merchantBalance } from '@/lib/payments/engine';

export const runtime = 'nodejs';

/* ------------------------------------------------------------------ */
/* POST /api/payments/merchant/payout — retiro de un comercio          */
/* ------------------------------------------------------------------ */
/* Valida el saldo del comercio y registra la solicitud de retiro.     */
/* ------------------------------------------------------------------ */
export const POST = guardedRoute<MerchantPayout>(
  {
    route: 'api:payments:merchant:payout',
    methods: ['POST'],
    rateLimit: 10,
    schema: merchantPayoutSchema,
    cacheControl: 'no-store',
  },
  async ({ body }) => {
    const result = requestPayout(body);
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.reason }, { status: 409 });
    }
    return NextResponse.json({
      ok: true,
      payoutId: result.payout?.id,
      merchantId: result.payout?.merchantId,
      amount: result.payout?.amount,
      method: result.payout?.method,
      status: result.payout?.status,
      balanceRemaining: result.payout ? merchantBalance(result.payout.merchantId) : 0,
    });
  },
);

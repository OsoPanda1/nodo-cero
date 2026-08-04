import { NextRequest } from 'next/server';
import { handleIsabellaCryptoVerify } from '@/lib/isabella/http';

export async function POST(req: NextRequest) {
  return handleIsabellaCryptoVerify(req);
}

import { NextRequest } from 'next/server';
import { handleIsabellaCryptoSign } from '@/lib/isabella/http';

export async function POST(req: NextRequest) {
  return handleIsabellaCryptoSign(req);
}

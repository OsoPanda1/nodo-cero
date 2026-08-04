import { NextRequest } from 'next/server';
import { handleIsabellaReason } from '@/lib/isabella/http';

export async function POST(req: NextRequest) {
  return handleIsabellaReason(req);
}

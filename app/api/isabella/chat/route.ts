import { NextRequest } from 'next/server';
import { handleIsabellaPost } from '@/lib/isabella/http';

export async function POST(req: NextRequest) {
  return handleIsabellaPost(req);
}

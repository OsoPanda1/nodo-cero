import { NextRequest } from 'next/server';
import { handleIsabellaGet, handleIsabellaPost } from '@/lib/isabella/http';

export async function POST(req: NextRequest) {
  return handleIsabellaPost(req);
}

export async function GET() {
  return handleIsabellaGet();
}

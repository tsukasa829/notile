import { NextResponse } from 'next/server';
import { rawClient } from '@/lib/db/index';

export async function GET() {
  if (!rawClient) {
    return NextResponse.json({ message: 'Using local PGLite or no raw client available.' });
  }
  try {
    const [row] = await rawClient`select current_user, inet_server_addr() as server_addr, inet_server_port() as server_port`;
    return NextResponse.json({ ok: true, info: row });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

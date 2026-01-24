import { NextResponse } from 'next/server';

// Simple debug endpoint to echo JSON body and log it server-side.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('/api/fitness/debug POST body:', JSON.stringify(body));
    return NextResponse.json({ ok: true, received: body });
  } catch (err) {
    console.error('/api/fitness/debug error parsing body', String(err));
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, msg: 'fitness debug endpoint' });
}

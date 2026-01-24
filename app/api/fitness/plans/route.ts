import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/fitness/plans?status=Fit
// POST /api/fitness/plans { title, exercises, status, createdBy }

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get('status');

  if (!status) {
    const plans = await prisma.fitnessPlan.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(plans);
  }

  const plans = await prisma.fitnessPlan.findMany({ where: { status }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(plans);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('/api/fitness/plans POST body:', JSON.stringify(body));
    const { title, exercises, status, createdBy } = body as { title?: string; exercises?: any; status?: string; createdBy?: string };
    if (!title || !exercises || !status || !createdBy) {
      // return received payload to help debugging
      return NextResponse.json({ error: 'missing fields', received: body }, { status: 400 });
    }

    try {
      const created = await prisma.fitnessPlan.create({ data: { title, exercises, status, createdBy } });
      console.log('Created fitnessPlan id=', created.id);
      return NextResponse.json({ ok: true, plan: created });
    } catch (dbErr) {
      console.error('DB error creating fitnessPlan', String(dbErr));
      return NextResponse.json({ error: String(dbErr), received: body }, { status: 500 });
    }
  } catch (err) {
    console.error('POST /api/fitness/plans unexpected error', String(err));
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

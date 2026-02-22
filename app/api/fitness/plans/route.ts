import { NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';
import { randomUUID } from 'crypto';

// GET /api/fitness/plans?status=Fit
// POST /api/fitness/plans { title, exercises, status, createdBy }

export async function GET(req: Request) {
  const db = getDb();
  const url = new URL(req.url);
  const status = url.searchParams.get('status');

  let rows;
  if (!status) {
    rows = await db.sql`SELECT * FROM FitnessPlan ORDER BY createdAt DESC`;
  } else {
    rows = await db.sql`SELECT * FROM FitnessPlan WHERE status = ${status} ORDER BY createdAt DESC`;
  }

  const parsed = (rows as Array<Record<string, unknown>>).map((p) => ({
    ...p,
    exercises: p.exercises ? JSON.parse(String(p.exercises)) : [],
  }));
  return NextResponse.json(parsed);
}

export async function POST(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    console.log('/api/fitness/plans POST body:', JSON.stringify(body));
    const { title, exercises, status, createdBy } = body as { title?: string; exercises?: unknown; status?: string; createdBy?: string };
    if (!title || !exercises || !status || !createdBy) {
      return NextResponse.json({ error: 'missing fields', received: body }, { status: 400 });
    }

    try {
      const id = randomUUID();
      const createdAt = new Date().toISOString();
      const exercisesStr = JSON.stringify(exercises);
      await db.sql`INSERT INTO FitnessPlan (id, title, exercises, status, createdBy, createdAt) VALUES (${id}, ${title}, ${exercisesStr}, ${status}, ${createdBy}, ${createdAt})`;
      console.log('Created fitnessPlan id=', id);
      return NextResponse.json({ ok: true, plan: { id, title, exercises, status, createdBy, createdAt } });
    } catch (dbErr) {
      console.error('DB error creating fitnessPlan', String(dbErr));
      return NextResponse.json({ error: String(dbErr), received: body }, { status: 500 });
    }
  } catch (err) {
    console.error('POST /api/fitness/plans unexpected error', String(err));
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

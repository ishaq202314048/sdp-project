import { NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';

// GET /api/fitness?userId=...  -> { userId, status }
// GET /api/fitness            -> { userId: status, ... }
// POST /api/fitness { userId, status } -> updates user's fitnessStatus

export async function GET(req: Request) {
  const db = getDb();
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    const users = await db.sql`SELECT id, fitnessStatus FROM User`;
    const map: Record<string, string | null> = {};
    (users as Array<{ id: string; fitnessStatus: string | null }>).forEach((u) => (map[u.id] = u.fitnessStatus ?? null));
    return NextResponse.json(map);
  }

  const rows = await db.sql`SELECT id, fitnessStatus FROM User WHERE id = ${userId} LIMIT 1`;
  const user = rows?.[0] as { id: string; fitnessStatus: string | null } | undefined;
  return NextResponse.json({ userId, status: user?.fitnessStatus ?? null });
}

export async function POST(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    const { userId, status } = body as { userId?: string; status?: string };
    if (!userId || !status) {
      return NextResponse.json({ error: 'userId and status are required' }, { status: 400 });
    }

    if (status !== 'Fit' && status !== 'Unfit') {
      return NextResponse.json({ error: 'invalid status' }, { status: 400 });
    }

    const now = new Date().toISOString();
    await db.sql`UPDATE User SET fitnessStatus = ${status}, updatedAt = ${now} WHERE id = ${userId}`;
    return NextResponse.json({ ok: true, userId, status });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// NOTE: seeding disabled — use scripts/setup-cloud-db.mjs to initialize the database schema.

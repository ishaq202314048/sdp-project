import { NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';
import { randomUUID } from 'crypto';

// POST /api/fitness/assign { userId, planId, assignedBy }
// GET /api/fitness/assign?userId=... -> latest assignment with plan

export async function POST(req: Request) {
  try {
    const db = getDb();
    const { userId, planId, assignedBy } = await req.json();
    if (!userId || !planId) {
      return NextResponse.json({ error: 'userId and planId required' }, { status: 400 });
    }

    const id = randomUUID();
    const assignedAt = new Date().toISOString();
    await db.sql`INSERT INTO AssignedPlan (id, userId, planId, assignedBy, assignedAt) VALUES (${id}, ${userId}, ${planId}, ${assignedBy ?? null}, ${assignedAt})`;
    return NextResponse.json({ ok: true, assignment: { id, userId, planId, assignedBy: assignedBy ?? null, assignedAt } });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const db = getDb();
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  const assignmentRows = await db.sql`SELECT * FROM AssignedPlan WHERE userId = ${userId} ORDER BY assignedAt DESC LIMIT 1`;
  if (!assignmentRows || assignmentRows.length === 0) return NextResponse.json({ assignment: null });

  const assignment = assignmentRows[0] as { id: string; userId: string; planId: string; assignedBy: string | null; assignedAt: string };
  const planRows = await db.sql`SELECT * FROM FitnessPlan WHERE id = ${assignment.planId} LIMIT 1`;
  const plan = planRows?.[0] as Record<string, unknown> | undefined;
  const parsedPlan = plan ? { ...plan, exercises: plan.exercises ? JSON.parse(String(plan.exercises)) : [] } : null;
  return NextResponse.json({ assignment, plan: parsedPlan });
}

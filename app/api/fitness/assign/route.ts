import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/fitness/assign { userId, planId, assignedBy }
// GET /api/fitness/assign?userId=... -> latest assignment with plan

export async function POST(req: Request) {
  try {
    const { userId, planId, assignedBy } = await req.json();
    if (!userId || !planId) {
      return NextResponse.json({ error: 'userId and planId required' }, { status: 400 });
    }

    const created = await prisma.assignedPlan.create({ data: { userId, planId, assignedBy } });
    return NextResponse.json({ ok: true, assignment: created });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  const assignment = await prisma.assignedPlan.findFirst({ where: { userId }, orderBy: { assignedAt: 'desc' } });
  if (!assignment) return NextResponse.json({ assignment: null });

  const plan = await prisma.fitnessPlan.findUnique({ where: { id: assignment.planId } });
  return NextResponse.json({ assignment, plan });
}

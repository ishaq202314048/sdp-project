import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/fitness?userId=...  -> { userId, status }
// GET /api/fitness            -> { userId: status, ... }
// POST /api/fitness { userId, status } -> updates user's fitnessStatus

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    const users = await prisma.user.findMany({ select: { id: true, fitnessStatus: true } });
    const map: Record<string, string | null> = {};
    users.forEach((u) => (map[u.id] = u.fitnessStatus ?? null));
    return NextResponse.json(map);
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, fitnessStatus: true } });
  return NextResponse.json({ userId, status: user?.fitnessStatus ?? null });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, status } = body as { userId?: string; status?: string };
    if (!userId || !status) {
      return NextResponse.json({ error: 'userId and status are required' }, { status: 400 });
    }

    if (status !== 'Fit' && status !== 'Unfit') {
      return NextResponse.json({ error: 'invalid status' }, { status: 400 });
    }

    const updated = await prisma.user.update({ where: { id: userId }, data: { fitnessStatus: status } });
    return NextResponse.json({ ok: true, userId: updated.id, status: updated.fitnessStatus });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// Sample data structure for the fitness plan
const sampleFitnessPlan = {
  title: 'Fit Weekly Plan - Week 1',
  status: 'Fit',
  exercises: [
    { name: 'Endurance Run', duration: '30 min', focus: 'Cardio' },
    { name: 'Core Circuit', duration: '20 min', focus: 'Core' }
  ],
  createdBy: '<adjutantUserId>'
};

// Sample data structure for assigning a fitness plan to a user
const sampleAssignPlan = {
  userId: '<soldierUserId>',
  planId: '<planId-from-create-or-list>',
  assignedBy: '<clerkUserId>'
};

// Initial data seeding
async function seedData() {
  // Check if there's any user data already
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    // No users found, seeding initial data
    await prisma.user.createMany({
      data: [
        { id: 'soldierUserId', fitnessStatus: 'Unfit' },
        { id: 'adjutantUserId', fitnessStatus: 'Fit' },
        { id: 'clerkUserId', fitnessStatus: 'Fit' }
      ]
    });
  }

  // Check if there's any fitness plan data
  const planCount = await prisma.fitnessPlan.count();
  if (planCount === 0) {
    // No plans found, seeding initial plan
    await prisma.fitnessPlan.create({
      data: {
        title: 'Fit Weekly Plan - Week 1',
        status: 'Fit',
        exercises: {
          create: [
            { name: 'Endurance Run', duration: '30 min', focus: 'Cardio' },
            { name: 'Core Circuit', duration: '20 min', focus: 'Core' }
          ]
        },
        createdBy: 'adjutantUserId'
      }
    });
  }
}

// Call the seed function
seedData()
  .catch((e) => console.error('Error seeding data:', e))
  .finally(async () => {
    await prisma.$disconnect();
  });

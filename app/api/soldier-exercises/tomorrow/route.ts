import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const soldierUserId = searchParams.get('userId');

        if (!soldierUserId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        // Get tomorrow's day name
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const tomorrowName = dayNames[tomorrow.getDay()];

        // Get soldier's fitness status
        const soldier = await prisma.user.findUnique({
            where: { id: soldierUserId },
            select: { fitnessStatus: true },
        });

        const status = soldier?.fitnessStatus || 'Unfit';

        // Fetch the latest fitness plan matching the soldier's status
        const latestPlan = await prisma.fitnessPlan.findFirst({
            where: { status },
            orderBy: { createdAt: 'desc' },
        });

        if (!latestPlan?.exercises) {
            return NextResponse.json({ exercises: [] });
        }

        const exercisesData: Array<{ day: string; items: Array<{ name: string; duration?: string; focus?: string }> }> = JSON.parse(latestPlan.exercises);

        // Find exercises for tomorrow
        const tomorrowExercises = exercisesData.find(
            (dayPlan) => dayPlan.day.toLowerCase() === tomorrowName.toLowerCase()
        );

        if (!tomorrowExercises || !tomorrowExercises.items || tomorrowExercises.items.length === 0) {
            return NextResponse.json({ exercises: [] });
        }

        const exerciseNames = tomorrowExercises.items.map((ex) => ex.name);

        return NextResponse.json({ exercises: exerciseNames });
    } catch (error) {
        console.error('Error fetching tomorrow exercises:', error);
        return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 });
    }
}

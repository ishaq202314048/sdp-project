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

        // Get today's day name (e.g., 'Monday', 'Tuesday', etc.)
        const today = new Date();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = dayNames[today.getDay()];

        // Get soldier's fitness status
        const soldier = await prisma.user.findUnique({
            where: { id: soldierUserId },
            select: { fitnessStatus: true },
        });

        const status = soldier?.fitnessStatus || 'Unfit';

        // Always fetch the latest fitness plan matching the soldier's status
        const latestPlan = await prisma.fitnessPlan.findFirst({
            where: { status },
            orderBy: { createdAt: 'desc' },
        });

        if (!latestPlan?.exercises) {
            return NextResponse.json({ exercises: [] });
        }

        const exercisesData: Array<{ day: string; items: Array<{ name: string; duration?: string; focus?: string }> }> = JSON.parse(latestPlan.exercises);

        // Find exercises for today
        const todayExercises = exercisesData.find(
            (dayPlan) => dayPlan.day.toLowerCase() === todayName.toLowerCase()
        );

        if (!todayExercises || !todayExercises.items || todayExercises.items.length === 0) {
            return NextResponse.json({ exercises: [] });
        }

        // Return only the exercise names
        const exerciseNames = todayExercises.items.map((ex) => ex.name);

        return NextResponse.json({ exercises: exerciseNames });
    } catch (error) {
        console.error('Error fetching soldier exercises:', error);
        return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 });
    }
}


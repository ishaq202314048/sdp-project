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

        // Find the soldier's assigned fitness plan
        const assignedPlan = await prisma.assignedPlan.findFirst({
            where: {
                userId: soldierUserId,
            },
        });

        if (!assignedPlan) {
            return NextResponse.json({ exercises: [] });
        }

        // Get the fitness plan
        const plan = await prisma.fitnessPlan.findUnique({
            where: {
                id: assignedPlan.planId,
            },
        });

        if (!plan || !plan.exercises) {
            return NextResponse.json({ exercises: [] });
        }

        // Parse the exercises JSON
        const exercisesData = JSON.parse(plan.exercises);

        // Find exercises for today
        const todayExercises = exercisesData.find(
            (dayPlan: { day: string; items: Array<{ name: string; duration: string; focus: string }> }) =>
                dayPlan.day.toLowerCase() === todayName.toLowerCase()
        );

        if (!todayExercises || !todayExercises.items) {
            return NextResponse.json({ exercises: [] });
        }

        // Return only the exercise names
        const exerciseNames = todayExercises.items.map(
            (ex: { name: string; duration: string; focus: string }) => ex.name
        );

        return NextResponse.json({ exercises: exerciseNames });
    } catch (error) {
        console.error('Error fetching soldier exercises:', error);
        return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 });
    }
}

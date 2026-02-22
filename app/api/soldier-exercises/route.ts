import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';

export async function GET(request: NextRequest) {
    try {
        const db = getDb();
        const { searchParams } = new URL(request.url);
        const soldierUserId = searchParams.get('userId');

        if (!soldierUserId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const today = new Date();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = dayNames[today.getDay()];

        const soldierRows = await db.sql`SELECT fitnessStatus FROM User WHERE id = ${soldierUserId} LIMIT 1` as Array<{ fitnessStatus: string | null }>;
        const status = soldierRows?.[0]?.fitnessStatus || 'Unfit';

        const planRows = await db.sql`SELECT * FROM FitnessPlan WHERE status = ${status} ORDER BY createdAt DESC LIMIT 1` as Array<{ exercises: string }>;
        if (!planRows || planRows.length === 0 || !planRows[0].exercises) {
            return NextResponse.json({ exercises: [] });
        }

        const exercisesData: Array<{ day: string; items: Array<{ name: string; duration?: string; focus?: string }> }> = JSON.parse(planRows[0].exercises);
        const todayExercises = exercisesData.find((dp) => dp.day.toLowerCase() === todayName.toLowerCase());

        if (!todayExercises || !todayExercises.items || todayExercises.items.length === 0) {
            return NextResponse.json({ exercises: [] });
        }

        const exerciseNames = todayExercises.items.map((ex) => ex.name);
        return NextResponse.json({ exercises: exerciseNames });
    } catch (error) {
        console.error('Error fetching soldier exercises:', error);
        return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 });
    }
}


import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const db = getDb();
        const body = await request.json();
        const { soldierUserId, clerkUserId, exerciseName, duration, result } = body;

        if (!soldierUserId || !clerkUserId || !exerciseName) {
            return NextResponse.json(
                { error: 'soldierUserId, clerkUserId, and exerciseName are required' },
                { status: 400 }
            );
        }

        const id = randomUUID();
        const now = new Date().toISOString();
        await db.sql`INSERT INTO FitnessTest (id, soldierUserId, exerciseName, duration, result, justifiedBy, justifiedAt, createdAt, updatedAt) VALUES (${id}, ${soldierUserId}, ${exerciseName}, ${duration ?? null}, ${result ?? 'Unknown'}, ${clerkUserId}, ${now}, ${now}, ${now})`;

        const fitnessTest = { id, soldierUserId, exerciseName, duration: duration ?? null, result: result ?? 'Unknown', justifiedBy: clerkUserId, justifiedAt: now, createdAt: now, updatedAt: now };
        return NextResponse.json({ test: fitnessTest }, { status: 201 });
    } catch (error) {
        console.error('Error creating fitness test:', error);
        return NextResponse.json({ error: 'Failed to save fitness test' }, { status: 500 });
    }
}

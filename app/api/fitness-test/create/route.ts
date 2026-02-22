import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { soldierUserId, clerkUserId, exerciseName, duration, result } = body;

        if (!soldierUserId || !clerkUserId || !exerciseName) {
            return NextResponse.json(
                { error: 'soldierUserId, clerkUserId, and exerciseName are required' },
                { status: 400 }
            );
        }

        // Create a fitness test record marked and justified by the clerk
        const fitnessTest = await prisma.FitnessTest.create({
            data: {
                soldierUserId,
                exerciseName,
                duration: duration || null,
                result: result || 'Unknown',
                justifiedBy: clerkUserId,
                justifiedAt: new Date(),
            },
        });

        return NextResponse.json({ test: fitnessTest }, { status: 201 });
    } catch (error) {
        console.error('Error creating fitness test:', error);
        return NextResponse.json({ error: 'Failed to save fitness test' }, { status: 500 });
    }
}

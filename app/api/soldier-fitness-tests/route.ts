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

        // Fetch fitness tests that have been justified by a clerk (justifiedBy is not null)
        const fitnessTests = await prisma.FitnessTest.findMany({
            where: {
                soldierUserId: soldierUserId,
                justifiedBy: { not: null }, // Only show tests justified by clerk
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 10, // Limit to last 10 tests
        });

        return NextResponse.json({ tests: fitnessTests });
    } catch (error) {
        console.error('Error fetching fitness tests:', error);
        return NextResponse.json({ error: 'Failed to fetch fitness tests' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Get all soldiers
        const soldiers = await prisma.user.findMany({
            where: { userType: 'soldier' },
            select: {
                id: true,
                fitnessStatus: true,
            },
        });

        const totalSoldiers = soldiers.length;
        const fitSoldiers = soldiers.filter(s => s.fitnessStatus === 'Fit').length;
        const unfitSoldiers = soldiers.filter(s => s.fitnessStatus === 'Unfit').length;

        // Get all fitness tests with scores
        const fitnessTests = await prisma.fitnessTest.findMany({
            select: {
                soldierUserId: true,
                score: true,
                result: true,
                createdAt: true,
            },
        });

        const totalTests = fitnessTests.length;
        const passedTests = fitnessTests.filter(t => t.result === 'Pass').length;
        const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

        // Average score from tests that have scores
        const testsWithScores = fitnessTests.filter(t => t.score !== null && t.score !== undefined);
        const averageScore = testsWithScores.length > 0
            ? Math.round(testsWithScores.reduce((sum, t) => sum + (t.score || 0), 0) / testsWithScores.length)
            : 0;

        // Total fitness tests conducted
        const totalFitnessTests = fitnessTests.length;

        return NextResponse.json({
            totalSoldiers,
            fitSoldiers,
            unfitSoldiers,
            passRate: Math.round(passRate * 10) / 10,
            averageScore,
            totalFitnessTests,
        });
    } catch (error) {
        console.error('[GET /api/soldiers/unit-overview]', error);
        return NextResponse.json(
            { error: 'Failed to fetch unit overview' },
            { status: 500 }
        );
    }
}

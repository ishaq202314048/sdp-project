import { NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';

export async function GET() {
    try {
        const db = getDb();

        const soldiers = await db.sql`SELECT id, fitnessStatus FROM User WHERE userType = 'soldier'` as Array<{ id: string; fitnessStatus: string | null }>;
        const totalSoldiers = soldiers.length;
        const fitSoldiers = soldiers.filter(s => s.fitnessStatus === 'Fit').length;
        const unfitSoldiers = soldiers.filter(s => s.fitnessStatus === 'Unfit').length;

        const fitnessTests = await db.sql`SELECT soldierUserId, score, result, createdAt FROM FitnessTest` as Array<{ soldierUserId: string; score: number | null; result: string; createdAt: string }>;
        const totalTests = fitnessTests.length;
        const passedTests = fitnessTests.filter(t => t.result === 'Pass').length;
        const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

        const testsWithScores = fitnessTests.filter(t => t.score !== null && t.score !== undefined);
        const averageScore = testsWithScores.length > 0
            ? Math.round(testsWithScores.reduce((sum, t) => sum + (t.score || 0), 0) / testsWithScores.length)
            : 0;

        return NextResponse.json({
            totalSoldiers,
            fitSoldiers,
            unfitSoldiers,
            passRate: Math.round(passRate * 10) / 10,
            averageScore,
            totalFitnessTests: totalTests,
        });
    } catch (error) {
        console.error('[GET /api/soldiers/unit-overview]', error);
        return NextResponse.json({ error: 'Failed to fetch unit overview' }, { status: 500 });
    }
}

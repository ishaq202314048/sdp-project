import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';

export async function POST(request: NextRequest) {
    try {
        const db = getDb();
        const { searchParams } = new URL(request.url);
        const soldierUserId = searchParams.get('userId');

        if (!soldierUserId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoStr = sevenDaysAgo.toISOString();

        const fitnessTests = await db.sql`SELECT * FROM FitnessTest WHERE soldierUserId = ${soldierUserId} AND createdAt >= ${sevenDaysAgoStr} AND justifiedBy IS NOT NULL` as Array<{ result: string }>;

        if (fitnessTests.length === 0) {
            return NextResponse.json({
                message: 'No fitness tests in the last week',
                passRate: 0,
                status: 'Unfit',
            });
        }

        const passedTests = fitnessTests.filter(test => test.result === 'Pass').length;
        const passRate = (passedTests / fitnessTests.length) * 100;
        const newStatus = passRate >= 80 ? 'Fit' : 'Unfit';

        const now = new Date().toISOString();
        await db.sql`UPDATE User SET fitnessStatus = ${newStatus}, updatedAt = ${now} WHERE id = ${soldierUserId}`;

        return NextResponse.json({
            userId: soldierUserId,
            totalTests: fitnessTests.length,
            passedTests,
            failedTests: fitnessTests.length - passedTests,
            passRate: parseFloat(passRate.toFixed(2)),
            newStatus,
            message: `Status updated to ${newStatus} based on ${passRate.toFixed(2)}% pass rate`,
        });
    } catch (error) {
        console.error('Error calculating fitness status:', error);
        return NextResponse.json({ error: 'Failed to calculate fitness status' }, { status: 500 });
    }
}

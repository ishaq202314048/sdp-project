import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const soldierUserId = searchParams.get('userId');

        if (!soldierUserId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        // Get fitness tests from the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const fitnessTests = await prisma.FitnessTest.findMany({
            where: {
                soldierUserId: soldierUserId,
                createdAt: {
                    gte: sevenDaysAgo,
                },
                justifiedBy: { not: null }, // Only count justified tests
            },
        });

        if (fitnessTests.length === 0) {
            return NextResponse.json({ 
                message: 'No fitness tests in the last week',
                passRate: 0,
                status: 'Unfit',
            });
        }

        // Calculate pass rate
        const passedTests = fitnessTests.filter(test => test.result === 'Pass').length;
        const passRate = (passedTests / fitnessTests.length) * 100;

        // Determine status: Unfit if pass rate < 80%, otherwise Fit
        const newStatus = passRate >= 80 ? 'Fit' : 'Unfit';

        // Update the user's fitness status
        const updatedUser = await prisma.User.update({
            where: { id: soldierUserId },
            data: { fitnessStatus: newStatus },
        });

        return NextResponse.json({
            userId: soldierUserId,
            totalTests: fitnessTests.length,
            passedTests: passedTests,
            failedTests: fitnessTests.length - passedTests,
            passRate: parseFloat(passRate.toFixed(2)),
            previousStatus: updatedUser.fitnessStatus === newStatus ? updatedUser.fitnessStatus : 'Changed',
            newStatus: newStatus,
            message: `Status updated to ${newStatus} based on ${passRate.toFixed(2)}% pass rate`,
        });
    } catch (error) {
        console.error('Error calculating fitness status:', error);
        return NextResponse.json({ error: 'Failed to calculate fitness status' }, { status: 500 });
    }
}

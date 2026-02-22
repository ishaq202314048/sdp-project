import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET — fetch all IPFT fitness test results joined with soldier info
export async function GET() {
  try {
    // Find all fitness tests where exerciseName contains 'ipft' (case-insensitive)
    const ipftTests = await prisma.fitnessTest.findMany({
      where: {
        exerciseName: {
          contains: 'ipft',
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get unique soldier IDs from the tests
    const soldierIds = [...new Set(ipftTests.map((t: { soldierUserId: string }) => t.soldierUserId))];

    // Fetch soldier details
    const soldiers = await prisma.user.findMany({
      where: {
        id: { in: soldierIds },
        userType: 'soldier',
      },
      select: {
        id: true,
        fullName: true,
        serviceNo: true,
        rank: true,
        unit: true,
        fitnessStatus: true,
        bmi: true,
        medicalCategory: true,
      },
    });

    // Build a map of soldier details
    const soldierMap = new Map(soldiers.map((s) => [s.id, s]));

    // Combine test results with soldier info — show latest test per soldier
    const latestTests = new Map<string, typeof ipftTests[0]>();
    for (const test of ipftTests) {
      if (!latestTests.has(test.soldierUserId)) {
        latestTests.set(test.soldierUserId, test);
      }
    }

    const results = Array.from(latestTests.values()).map((test) => {
      const soldier = soldierMap.get(test.soldierUserId);
      return {
        name: soldier?.fullName || 'Unknown',
        serviceNo: soldier?.serviceNo || 'N/A',
        rank: soldier?.rank || 'N/A',
        unit: soldier?.unit || 'N/A',
        fitnessStatus: soldier?.fitnessStatus || 'N/A',
        bmi: soldier?.bmi || null,
        medicalCategory: soldier?.medicalCategory || 'N/A',
        ipftResult: test.result,
        ipftDate: test.createdAt,
        exerciseName: test.exerciseName,
      };
    });

    // Fetch the scheduled IPFT date
    const ipftDate = await prisma.ipftDate.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      results,
      scheduledDate: ipftDate ? ipftDate.date.toISOString().split('T')[0] : null,
      totalTests: ipftTests.length,
    });
  } catch (error) {
    console.error('[GET /api/fitness-test/ipft-results]', error);
    return NextResponse.json({ error: 'Failed to fetch IPFT results' }, { status: 500 });
  }
}

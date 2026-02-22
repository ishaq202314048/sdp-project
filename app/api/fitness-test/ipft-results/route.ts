import { NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';

// GET — fetch all IPFT fitness test results joined with soldier info
export async function GET() {
  try {
    const db = getDb();

    // Find all fitness tests where exerciseName contains 'ipft'
    const ipftTests = await db.sql`SELECT * FROM FitnessTest WHERE LOWER(exerciseName) LIKE '%ipft%' ORDER BY createdAt DESC` as Array<{ id: string; soldierUserId: string; exerciseName: string; result: string; createdAt: string; [key: string]: unknown }>;

    // Get unique soldier IDs
    const soldierIds = [...new Set(ipftTests.map((t) => t.soldierUserId))];

    let soldiers: Array<{ id: string; fullName: string; serviceNo: string | null; rank: string | null; unit: string | null; fitnessStatus: string | null; bmi: number | null; medicalCategory: string | null }> = [];
    if (soldierIds.length > 0) {
      const placeholders = soldierIds.map(() => '?').join(', ');
      soldiers = await db.sql(`SELECT id, fullName, serviceNo, rank, unit, fitnessStatus, bmi, medicalCategory FROM User WHERE id IN (${placeholders}) AND userType = 'soldier'`, ...soldierIds) as typeof soldiers;
    }

    const soldierMap = new Map(soldiers.map((s) => [s.id, s]));

    // Show latest test per soldier
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

    const ipftDateRows = await db.sql`SELECT * FROM IpftDate ORDER BY createdAt DESC LIMIT 1` as Array<{ date: string }>;
    const ipftDate = ipftDateRows?.[0];

    return NextResponse.json({
      results,
      scheduledDate: ipftDate ? ipftDate.date.split('T')[0] : null,
      totalTests: ipftTests.length,
    });
  } catch (error) {
    console.error('[GET /api/fitness-test/ipft-results]', error);
    return NextResponse.json({ error: 'Failed to fetch IPFT results' }, { status: 500 });
  }
}

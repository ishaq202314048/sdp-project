import { NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';

export async function GET() {
    try {
        const db = getDb();

        // Get all soldiers with their current fitness status and creation date
        const soldiers = await db.sql`SELECT id, fitnessStatus, createdAt FROM User WHERE userType = 'soldier'` as Array<{ id: string; fitnessStatus: string | null; createdAt: string }>;

        // Get all fitness tests grouped by month to track historical changes
        const fitnessTests = await db.sql`SELECT soldierUserId, result, createdAt FROM FitnessTest WHERE justifiedBy IS NOT NULL ORDER BY createdAt ASC` as Array<{ soldierUserId: string; result: string; createdAt: string }>;

        // Build month labels for last 6 months
        const months: { label: string; year: number; month: number }[] = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                label: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
                year: d.getFullYear(),
                month: d.getMonth(),
            });
        }

        // For each month, determine the fitness status of each soldier at that point in time.
        // We look at the latest test result for each soldier UP TO the end of that month.
        // If no test exists for a soldier yet, they count as their current status (snapshot).
        const trendData = months.map((m) => {
            const monthEnd = new Date(m.year, m.month + 1, 0, 23, 59, 59);

            // Only count soldiers that existed by the end of this month
            const existingSoldiers = soldiers.filter(s => {
                const created = new Date(s.createdAt);
                return created <= monthEnd;
            });

            // Build a map: soldierUserId → latest test result up to this month's end
            const latestResultMap = new Map<string, string>();
            for (const test of fitnessTests) {
                const testDate = new Date(test.createdAt);
                if (testDate <= monthEnd) {
                    // Keep overwriting — since tests are sorted ASC, last one wins
                    latestResultMap.set(test.soldierUserId, test.result);
                }
            }

            let fit = 0;
            let unfit = 0;

            for (const soldier of existingSoldiers) {
                const testResult = latestResultMap.get(soldier.id);
                if (testResult) {
                    // Soldier has test data — "Pass" means Fit
                    if (testResult === 'Pass') {
                        fit++;
                    } else {
                        unfit++;
                    }
                } else {
                    // No test data for this soldier up to this month — use current status
                    if (soldier.fitnessStatus === 'Fit') {
                        fit++;
                    } else {
                        unfit++;
                    }
                }
            }

            return { month: m.label, fit, unfit };
        });

        return NextResponse.json({ trend: trendData });
    } catch (error) {
        console.error('Error fetching monthly fitness trend:', error);
        return NextResponse.json({ error: 'Failed to fetch trend data' }, { status: 500 });
    }
}

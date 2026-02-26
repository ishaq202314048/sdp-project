import { NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';

export async function GET() {
    try {
        const db = getDb();

        // --- Fitness Test Performance: per-exercise pass/fail counts ---
        const allTests = await db.sql`SELECT exerciseName, result, createdAt FROM FitnessTest WHERE justifiedBy IS NOT NULL ORDER BY createdAt ASC` as Array<{ exerciseName: string; result: string; createdAt: string }>;

        const exerciseMap: Record<string, { pass: number; fail: number; total: number }> = {};
        for (const t of allTests) {
            let name = t.exerciseName;
            if (name.toLowerCase().includes('ipft')) name = 'IPFT';
            if (!exerciseMap[name]) exerciseMap[name] = { pass: 0, fail: 0, total: 0 };
            exerciseMap[name].total++;
            if (t.result === 'Pass') exerciseMap[name].pass++;
            else if (t.result === 'Fail') exerciseMap[name].fail++;
        }

        const fitnessTestPerformance = Object.entries(exerciseMap).map(([exercise, counts]) => ({
            exercise,
            pass: counts.pass,
            fail: counts.fail,
            total: counts.total,
        }));

        // --- Quarterly Progress ---
        const soldiers = await db.sql`SELECT id, fitnessStatus, createdAt FROM User WHERE userType = 'soldier'` as Array<{ id: string; fitnessStatus: string | null; createdAt: string }>;

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentQuarter = Math.ceil((now.getMonth() + 1) / 3);

        const quarters: { label: string; start: Date; end: Date }[] = [];
        for (let i = 3; i >= 0; i--) {
            let qYear = currentYear;
            let q = currentQuarter - i;
            while (q <= 0) { q += 4; qYear--; }
            const startMonth = (q - 1) * 3;
            const start = new Date(qYear, startMonth, 1);
            const end = new Date(qYear, startMonth + 3, 0, 23, 59, 59, 999);
            quarters.push({ label: `Q${q} ${qYear}`, start, end });
        }

        const quarterlyProgress = quarters.map((q) => {
            const soldiersInQuarter = soldiers.filter(s => new Date(s.createdAt) <= q.end);
            const fit = soldiersInQuarter.filter(s => s.fitnessStatus === 'Fit').length;
            const unfit = soldiersInQuarter.filter(s => s.fitnessStatus !== 'Fit').length;
            return { quarter: q.label, fit, unfit };
        });

        return NextResponse.json({ fitnessTestPerformance, quarterlyProgress });
    } catch (error) {
        console.error('Error fetching reports chart data:', error);
        return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 });
    }
}

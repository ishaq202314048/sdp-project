import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // --- Fitness Test Performance: per-exercise pass/fail counts ---
        const allTests = await prisma.fitnessTest.findMany({
            where: { justifiedBy: { not: null } },
            select: {
                exerciseName: true,
                result: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
        });

        // Group by exercise name (normalize IPFT variations)
        const exerciseMap: Record<string, { pass: number; fail: number; total: number }> = {};
        for (const t of allTests) {
            // Normalize exercise name: merge all ipft variations into "IPFT"
            let name = t.exerciseName;
            if (name.toLowerCase().includes('ipft')) {
                name = 'IPFT';
            }
            if (!exerciseMap[name]) {
                exerciseMap[name] = { pass: 0, fail: 0, total: 0 };
            }
            exerciseMap[name].total++;
            if (t.result === 'Pass') {
                exerciseMap[name].pass++;
            } else if (t.result === 'Fail') {
                exerciseMap[name].fail++;
            }
        }

        const fitnessTestPerformance = Object.entries(exerciseMap).map(([exercise, counts]) => ({
            exercise,
            pass: counts.pass,
            fail: counts.fail,
            total: counts.total,
        }));

        // --- Quarterly Progress: fit/unfit soldier counts per quarter ---
        // Get all soldiers
        const soldiers = await prisma.user.findMany({
            where: { userType: 'soldier' },
            select: {
                id: true,
                fitnessStatus: true,
                createdAt: true,
            },
        });

        // Build quarters from the earliest soldier creation to now
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentQuarter = Math.ceil((now.getMonth() + 1) / 3);

        // Generate last 4 quarters
        const quarters: { label: string; start: Date; end: Date }[] = [];
        for (let i = 3; i >= 0; i--) {
            let qYear = currentYear;
            let q = currentQuarter - i;
            while (q <= 0) {
                q += 4;
                qYear--;
            }
            const startMonth = (q - 1) * 3; // 0-indexed
            const start = new Date(qYear, startMonth, 1);
            const end = new Date(qYear, startMonth + 3, 0, 23, 59, 59, 999);
            quarters.push({ label: `Q${q} ${qYear}`, start, end });
        }

        // For each quarter, count soldiers that existed by end of quarter
        // and use their current fitnessStatus (since we don't track historical status)
        const quarterlyProgress = quarters.map((q) => {
            // Soldiers that had been created by end of this quarter
            const soldiersInQuarter = soldiers.filter(s => new Date(s.createdAt) <= q.end);
            const fit = soldiersInQuarter.filter(s => s.fitnessStatus === 'Fit').length;
            const unfit = soldiersInQuarter.filter(s => s.fitnessStatus !== 'Fit').length;
            return {
                quarter: q.label,
                fit,
                unfit,
            };
        });

        return NextResponse.json({
            fitnessTestPerformance,
            quarterlyProgress,
        });
    } catch (error) {
        console.error('Error fetching reports chart data:', error);
        return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 });
    }
}

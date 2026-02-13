import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Get all soldiers with their current fitness status
        const soldiers = await prisma.user.findMany({
            where: { userType: 'soldier' },
            select: {
                id: true,
                fitnessStatus: true,
            },
        });

        // Current counts from actual fitnessStatus field
        const currentFit = soldiers.filter(s => s.fitnessStatus === 'Fit').length;
        const currentUnfit = soldiers.filter(s => s.fitnessStatus !== 'Fit').length;

        // Build month labels for last 6 months
        const months: { key: string; label: string }[] = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
            months.push({ key: String(i), label });
        }

        // Use current soldier fitnessStatus for all months
        // (historical tracking not available — shows current snapshot as baseline)
        const trendData = months.map((m) => ({
            month: m.label,
            fit: currentFit,
            unfit: currentUnfit,
        }));

        return NextResponse.json({ trend: trendData });
    } catch (error) {
        console.error('Error fetching monthly fitness trend:', error);
        return NextResponse.json({ error: 'Failed to fetch trend data' }, { status: 500 });
    }
}

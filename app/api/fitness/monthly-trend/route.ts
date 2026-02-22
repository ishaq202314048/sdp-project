import { NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';

export async function GET() {
    try {
        const db = getDb();
        const soldiers = await db.sql`SELECT id, fitnessStatus FROM User WHERE userType = 'soldier'` as Array<{ id: string; fitnessStatus: string | null }>;

        const currentFit = soldiers.filter(s => s.fitnessStatus === 'Fit').length;
        const currentUnfit = soldiers.filter(s => s.fitnessStatus !== 'Fit').length;

        const months: { key: string; label: string }[] = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
            months.push({ key: String(i), label });
        }

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

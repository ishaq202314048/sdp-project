import { NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';

export async function GET() {
    try {
        const db = getDb();
        const unfitSoldiers = await db.sql`SELECT id, fullName, email, rank, serviceNo, fitnessStatus FROM User WHERE userType = 'soldier' AND fitnessStatus = 'Unfit' ORDER BY fullName ASC` as Array<{ id: string; fullName: string; email: string; rank: string | null; serviceNo: string | null; fitnessStatus: string | null }>;

        const highRiskSoldiers = unfitSoldiers.map((soldier) => ({
            id: soldier.id,
            name: soldier.fullName || 'Unknown Soldier',
            serviceNo: soldier.serviceNo || 'N/A',
            rank: soldier.rank || 'Unknown',
            riskType: 'Low Fitness' as const,
            status: 'Below fitness threshold - Unfit status',
            lastTestScore: 0,
        }));

        return NextResponse.json({
            highRiskSoldiers,
            totalRiskCount: highRiskSoldiers.length,
        });
    } catch (error) {
        console.error('Error fetching high-risk soldiers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch high-risk soldiers' },
            { status: 500 }
        );
    }
}

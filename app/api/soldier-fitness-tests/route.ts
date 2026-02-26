import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';

export async function GET(request: NextRequest) {
    try {
        const db = getDb();
        const { searchParams } = new URL(request.url);
        const soldierUserId = searchParams.get('userId');

        if (!soldierUserId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const tests = await db.sql`SELECT * FROM FitnessTest WHERE soldierUserId = ${soldierUserId} AND justifiedBy IS NOT NULL ORDER BY createdAt DESC LIMIT 10`;

        return NextResponse.json({ tests });
    } catch (error) {
        console.error('Error fetching fitness tests:', error);
        return NextResponse.json({ error: 'Failed to fetch fitness tests' }, { status: 500 });
    }
}

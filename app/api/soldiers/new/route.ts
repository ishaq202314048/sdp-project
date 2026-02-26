import { NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';

export async function GET() {
  try {
    const db = getDb();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString();

    const newSoldiers = await db.sql`SELECT id, fullName, email, serviceNo, rank, createdAt FROM User WHERE userType = 'soldier' AND createdAt >= ${sevenDaysAgoStr} ORDER BY createdAt DESC` as Array<{ id: string; fullName: string; email: string; serviceNo: string | null; rank: string | null; createdAt: string }>;

    return NextResponse.json({
      count: newSoldiers.length,
      soldiers: newSoldiers.map((s) => ({
        id: s.id,
        name: s.fullName,
        email: s.email,
        serviceNo: s.serviceNo || 'N/A',
        rank: s.rank || 'N/A',
        joinedAt: s.createdAt,
      })),
    });
  } catch (error) {
    console.error('[GET /api/soldiers/new]', error);
    return NextResponse.json({ error: 'Failed to fetch new soldiers' }, { status: 500 });
  }
}

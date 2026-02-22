import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newSoldiers = await prisma.user.findMany({
      where: {
        userType: 'soldier',
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        serviceNo: true,
        rank: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      count: newSoldiers.length,
      soldiers: newSoldiers.map((s) => ({
        id: s.id,
        name: s.fullName,
        email: s.email,
        serviceNo: s.serviceNo || 'N/A',
        rank: s.rank || 'N/A',
        joinedAt: s.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('[GET /api/soldiers/new]', error);
    return NextResponse.json(
      { error: 'Failed to fetch new soldiers' },
      { status: 500 }
    );
  }
}

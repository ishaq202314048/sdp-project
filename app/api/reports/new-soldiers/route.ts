import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST — clerk sends a new-soldiers report to adjutant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { soldiers, sentBy, sentByName } = body;

    if (!soldiers || !Array.isArray(soldiers) || soldiers.length === 0) {
      return NextResponse.json({ error: 'No soldiers to report' }, { status: 400 });
    }
    if (!sentBy) {
      return NextResponse.json({ error: 'sentBy (clerk user ID) is required' }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        title: `New Soldiers Report — ${new Date().toLocaleDateString()}`,
        type: 'new-soldiers',
        content: JSON.stringify(soldiers),
        sentBy,
        sentByName: sentByName || 'Clerk',
        sentTo: 'adjutant',
        status: 'sent',
      },
    });

    return NextResponse.json({ message: 'Report sent to adjutant', report }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/reports/new-soldiers]', error);
    return NextResponse.json({ error: 'Failed to send report' }, { status: 500 });
  }
}

// GET — fetch all new-soldier reports (for adjutant to view)
export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      where: { type: 'new-soldiers' },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      reports.map((r) => ({
        ...r,
        content: JSON.parse(r.content),
      }))
    );
  } catch (error) {
    console.error('[GET /api/reports/new-soldiers]', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

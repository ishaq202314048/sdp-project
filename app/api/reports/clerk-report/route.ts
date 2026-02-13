import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST — clerk sends a report/message to adjutant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, sentBy, sentByName, fileName, fileData } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Report title is required' }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Report message is required' }, { status: 400 });
    }
    if (!sentBy) {
      return NextResponse.json({ error: 'sentBy (clerk user ID) is required' }, { status: 400 });
    }

    const contentObj: Record<string, string> = { message: message.trim() };
    if (fileName && fileData) {
      contentObj.fileName = fileName;
      contentObj.fileData = fileData; // base64 encoded PDF
    }

    const report = await prisma.report.create({
      data: {
        title: title.trim(),
        type: 'clerk-report',
        content: JSON.stringify(contentObj),
        sentBy,
        sentByName: sentByName || 'Clerk',
        sentTo: 'adjutant',
        status: 'sent',
      },
    });

    return NextResponse.json({ message: 'Report sent to adjutant', report }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/reports/clerk-report]', error);
    return NextResponse.json({ error: 'Failed to send report' }, { status: 500 });
  }
}

// GET — fetch all clerk reports (for adjutant alerts)
export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      where: { type: 'clerk-report' },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      reports.map((r) => ({
        ...r,
        content: JSON.parse(r.content),
      }))
    );
  } catch (error) {
    console.error('[GET /api/reports/clerk-report]', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

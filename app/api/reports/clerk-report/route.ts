import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';
import { randomUUID } from 'crypto';

// POST — clerk sends a report/message to adjutant
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
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
      contentObj.fileData = fileData;
    }

    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const content = JSON.stringify(contentObj);
    await db.sql`INSERT INTO Report (id, title, type, content, sentBy, sentByName, sentTo, status, createdAt) VALUES (${id}, ${title.trim()}, 'clerk-report', ${content}, ${sentBy}, ${sentByName || 'Clerk'}, 'adjutant', 'sent', ${createdAt})`;

    const report = { id, title: title.trim(), type: 'clerk-report', content, sentBy, sentByName: sentByName || 'Clerk', sentTo: 'adjutant', status: 'sent', createdAt };
    return NextResponse.json({ message: 'Report sent to adjutant', report }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/reports/clerk-report]', error);
    return NextResponse.json({ error: 'Failed to send report' }, { status: 500 });
  }
}

// GET — fetch all clerk reports (for adjutant alerts)
export async function GET() {
  try {
    const db = getDb();
    const reports = await db.sql`SELECT * FROM Report WHERE type = 'clerk-report' ORDER BY createdAt DESC` as Array<Record<string, unknown>>;

    return NextResponse.json(
      reports.map((r) => ({
        ...r,
        content: JSON.parse(r.content as string),
      }))
    );
  } catch (error) {
    console.error('[GET /api/reports/clerk-report]', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

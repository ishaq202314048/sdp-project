import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/sqlitecloud-client';
import { randomUUID } from 'crypto';

// POST — clerk sends a new-soldiers report to adjutant
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { soldiers, sentBy, sentByName } = body;

    if (!soldiers || !Array.isArray(soldiers) || soldiers.length === 0) {
      return NextResponse.json({ error: 'No soldiers to report' }, { status: 400 });
    }
    if (!sentBy) {
      return NextResponse.json({ error: 'sentBy (clerk user ID) is required' }, { status: 400 });
    }

    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const title = `New Soldiers Report — ${new Date().toLocaleDateString()}`;
    const content = JSON.stringify(soldiers);
    await db.sql`INSERT INTO Report (id, title, type, content, sentBy, sentByName, sentTo, status, createdAt) VALUES (${id}, ${title}, 'new-soldiers', ${content}, ${sentBy}, ${sentByName || 'Clerk'}, 'adjutant', 'sent', ${createdAt})`;

    const report = { id, title, type: 'new-soldiers', content, sentBy, sentByName: sentByName || 'Clerk', sentTo: 'adjutant', status: 'sent', createdAt };
    return NextResponse.json({ message: 'Report sent to adjutant', report }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/reports/new-soldiers]', error);
    return NextResponse.json({ error: 'Failed to send report' }, { status: 500 });
  }
}

// GET — fetch all new-soldier reports (for adjutant to view)
export async function GET() {
  try {
    const db = getDb();
    const reports = await db.sql`SELECT * FROM Report WHERE type = 'new-soldiers' ORDER BY createdAt DESC` as Array<Record<string, unknown>>;

    return NextResponse.json(
      reports.map((r) => ({
        ...r,
        content: JSON.parse(r.content as string),
      }))
    );
  } catch (error) {
    console.error('[GET /api/reports/new-soldiers]', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

// DELETE — remove a report after adjutant downloads it
export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get("id");

    if (!reportId) {
      return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
    }

    await db.sql`DELETE FROM Report WHERE id = ${reportId}`;
    return NextResponse.json({ message: 'Report deleted' });
  } catch (error) {
    console.error('[DELETE /api/reports/new-soldiers]', error);
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }
}

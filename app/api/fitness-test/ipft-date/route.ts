import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/sqlitecloud-client";
import { randomUUID } from "crypto";

// GET - fetch the latest IPFT date
export async function GET() {
  try {
    const db = getDb();
    const rows = await db.sql`SELECT * FROM IpftDate ORDER BY createdAt DESC LIMIT 1`;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ date: null });
    }
    const latest = rows[0] as { date: string };
    return NextResponse.json({ date: latest.date.split('T')[0] });
  } catch (error) {
    console.error("Error fetching IPFT date:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - save a new IPFT date
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { date } = body;

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const dateStr = new Date(date).toISOString();
    await db.sql`INSERT INTO IpftDate (id, date, setBy, createdAt) VALUES (${id}, ${dateStr}, 'adjutant', ${createdAt})`;

    return NextResponse.json({ message: "IPFT date saved", date: dateStr.split('T')[0] }, { status: 201 });
  } catch (error) {
    console.error("Error saving IPFT date:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

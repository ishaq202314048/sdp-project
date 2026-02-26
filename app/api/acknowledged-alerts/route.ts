import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/sqlitecloud-client";
import { randomUUID } from "crypto";

// GET - fetch all acknowledged alerts for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const db = getDb();
    const rows = await db.sql`SELECT alertId FROM AcknowledgedAlert WHERE acknowledgedBy = ${userId}`;
    
    const alertIds = Array.isArray(rows) ? rows.map((r: { alertId: string }) => r.alertId) : [];
    return NextResponse.json({ acknowledgedAlerts: alertIds });
  } catch (error) {
    console.error("Error fetching acknowledged alerts:", error);
    return NextResponse.json({ error: "Failed to fetch acknowledged alerts" }, { status: 500 });
  }
}

// POST - acknowledge an alert
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { alertId, userId } = body;

    if (!alertId || !userId) {
      return NextResponse.json({ error: "alertId and userId are required" }, { status: 400 });
    }

    const db = getDb();
    
    // Check if already exists
    const existing = await db.sql`SELECT id FROM AcknowledgedAlert WHERE alertId = ${alertId} AND acknowledgedBy = ${userId}`;
    
    if (Array.isArray(existing) && existing.length > 0) {
      // Already acknowledged
      return NextResponse.json({ success: true, message: "Already acknowledged" });
    }
    
    // Insert new acknowledgement
    const id = randomUUID();
    await db.sql`INSERT INTO AcknowledgedAlert (id, alertId, acknowledgedBy, acknowledgedAt) VALUES (${id}, ${alertId}, ${userId}, datetime('now'))`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error acknowledging alert:", error);
    return NextResponse.json({ error: "Failed to acknowledge alert" }, { status: 500 });
  }
}

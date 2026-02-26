import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/sqlitecloud-client";

// POST /api/soldiers/approve — approve or reject a pending soldier
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { soldierId, action } = body; // action: "approve" | "reject"

    if (!soldierId || !action) {
      return NextResponse.json(
        { error: "soldierId and action are required" },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    // Find the soldier
    const rows = await db.sql`SELECT id, userType, fullName, serviceNo FROM User WHERE id = ${soldierId} LIMIT 1` as Array<{ id: string; userType: string; fullName: string; serviceNo: string | null }>;
    const soldier = rows?.[0];

    if (!soldier) {
      return NextResponse.json(
        { error: "Soldier not found" },
        { status: 404 }
      );
    }

    if (soldier.userType !== "soldier") {
      return NextResponse.json(
        { error: "User is not a soldier" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      const now = new Date().toISOString();
      await db.sql`UPDATE User SET approved = 1, updatedAt = ${now} WHERE id = ${soldierId}`;

      return NextResponse.json({
        message: `Soldier ${soldier.fullName} has been approved successfully.`,
        soldier: {
          id: soldier.id,
          fullName: soldier.fullName,
          serviceNo: soldier.serviceNo,
          approved: true,
        },
      });
    }

    if (action === "reject") {
      await db.sql`DELETE FROM User WHERE id = ${soldierId}`;

      return NextResponse.json({
        message: `Soldier ${soldier.fullName} has been rejected and removed.`,
        soldier: {
          id: soldier.id,
          fullName: soldier.fullName,
          serviceNo: soldier.serviceNo,
        },
      });
    }
  } catch (error) {
    console.error("[POST /api/soldiers/approve]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

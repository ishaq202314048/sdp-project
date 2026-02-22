import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/soldiers/approve — approve or reject a pending soldier
export async function POST(request: NextRequest) {
  try {
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
    const soldier = await prisma.user.findUnique({
      where: { id: soldierId },
    });

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
      await prisma.user.update({
        where: { id: soldierId },
        data: { approved: true },
      });

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
      // Delete the soldier account entirely
      await prisma.user.delete({
        where: { id: soldierId },
      });

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

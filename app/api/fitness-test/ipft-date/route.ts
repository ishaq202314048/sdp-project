import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - fetch the latest IPFT date
export async function GET() {
  try {
    const latest = await prisma.ipftDate.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latest) {
      return NextResponse.json({ date: null });
    }

    return NextResponse.json({ date: latest.date.toISOString().split("T")[0] });
  } catch (error) {
    console.error("Error fetching IPFT date:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - save a new IPFT date
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date } = body;

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const ipftDate = await prisma.ipftDate.create({
      data: {
        date: new Date(date),
        setBy: "adjutant", // In production, extract from JWT
      },
    });

    return NextResponse.json({ message: "IPFT date saved", date: ipftDate.date.toISOString().split("T")[0] }, { status: 201 });
  } catch (error) {
    console.error("Error saving IPFT date:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

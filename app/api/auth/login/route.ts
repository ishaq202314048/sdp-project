import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { comparePassword } from "@/lib/auth";
import { generateToken } from "@/lib/jwt";
import { getDb } from "@/lib/sqlitecloud-client";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, userType } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (userType && user.userType !== userType) {
      return NextResponse.json(
        { error: `Invalid user type. Expected ${user.userType}` },
        { status: 403 }
      );
    }

    // Check if soldier account is approved by adjutant
    if (user.userType === "soldier") {
      const db = getDb();
      const approvedRows = await db.sql`SELECT approved FROM User WHERE id = ${user.id} LIMIT 1` as Array<{ approved: number }>;
      if (!approvedRows?.[0]?.approved) {
        return NextResponse.json(
          { error: "Your account is pending approval by the Adjutant. Please wait until your account is approved before logging in." },
          { status: 403 }
        );
      }
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      userType: user.userType,
    });

    // Store login session in database
    const ipAddress = request.headers.get("x-forwarded-for") || 
                      request.headers.get("x-real-ip") || 
                      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    
    const db = getDb();
    const sessionId = randomUUID();
    const loginAt = new Date().toISOString();
    await db.sql`INSERT INTO LoginSession (id, userId, email, userType, ipAddress, userAgent, loginAt) VALUES (${sessionId}, ${user.id}, ${user.email}, ${user.userType}, ${ipAddress}, ${userAgent}, ${loginAt})`;

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          userType: user.userType,
          serviceNo: user.serviceNo,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

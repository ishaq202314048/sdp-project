import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import { comparePassword } from "@/lib/auth";
import { generateToken } from "@/lib/jwt";

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

    const token = generateToken({
      userId: user.id,
      email: user.email,
      userType: user.userType,
    });

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

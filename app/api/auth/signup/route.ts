import { NextRequest, NextResponse } from "next/server";
import { createUser, emailExists } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { generateToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, userType, serviceNo } = body;

    if (!email || !password || !fullName || !userType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["soldier", "clerk", "adjutant"].includes(userType)) {
      return NextResponse.json(
        { error: "Invalid user type" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character (@$!%*?&#)" },
        { status: 400 }
      );
    }

    if (await emailExists(email)) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    if (userType === "soldier" && !serviceNo) {
      return NextResponse.json(
        { error: "Service number is required for soldiers" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await createUser({
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      userType,
      serviceNo: userType === "soldier" ? serviceNo : undefined,
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      userType: user.userType,
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          userType: user.userType,
          serviceNo: user.serviceNo,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

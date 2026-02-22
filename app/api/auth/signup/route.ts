import { NextRequest, NextResponse } from "next/server";
import { createUser, emailExists, serviceNoExists } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { generateToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, password, fullName, userType, 
      serviceNo, rank, unit, dateOfBirth, dateOfJoining, bloodGroup, height, weight, medicalCategory,
      clerkServiceNo, clerkRank, clerkUnit, clerkRole, clerkDateOfJoining, clerkPhone, clerkAddress, clerkEmergencyContactName, clerkEmergencyContact,
      adjutantServiceNo, adjutantRank, adjutantUnit, adjutantDateOfJoining, adjutantPhone, adjutantAddress, adjutantEmergencyContactName, adjutantEmergencyContact
    } = body;

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

    if (userType === "soldier") {
      if (!serviceNo) {
        return NextResponse.json(
          { error: "Service number is required for soldiers" },
          { status: 400 }
        );
      }
      if (await serviceNoExists(serviceNo)) {
        return NextResponse.json(
          { error: "A user with this service number already exists" },
          { status: 409 }
        );
      }
      if (!unit) {
        return NextResponse.json(
          { error: "Unit is required for soldiers" },
          { status: 400 }
        );
      }
      if (!rank) {
        return NextResponse.json(
          { error: "Rank is required for soldiers" },
          { status: 400 }
        );
      }
      if (!dateOfBirth) {
        return NextResponse.json(
          { error: "Date of birth is required for soldiers" },
          { status: 400 }
        );
      }
      if (!dateOfJoining) {
        return NextResponse.json(
          { error: "Date of joining is required for soldiers" },
          { status: 400 }
        );
      }
      if (!bloodGroup) {
        return NextResponse.json(
          { error: "Blood group is required for soldiers" },
          { status: 400 }
        );
      }
      if (!height || isNaN(Number(height)) || Number(height) < 50 || Number(height) > 300) {
        return NextResponse.json(
          { error: "Valid height (50-300 cm) is required for soldiers" },
          { status: 400 }
        );
      }
      if (!weight || isNaN(Number(weight)) || Number(weight) < 20 || Number(weight) > 200) {
        return NextResponse.json(
          { error: "Valid weight (20-200 kg) is required for soldiers" },
          { status: 400 }
        );
      }
      if (!medicalCategory || !["A", "B", "C"].includes(medicalCategory)) {
        return NextResponse.json(
          { error: "Valid medical category is required for soldiers" },
          { status: 400 }
        );
      }
    }

    if (userType === "clerk") {
      if (!clerkServiceNo) {
        return NextResponse.json(
          { error: "Service number is required for clerks" },
          { status: 400 }
        );
      }
      if (await serviceNoExists(clerkServiceNo)) {
        return NextResponse.json(
          { error: "A user with this service number already exists" },
          { status: 409 }
        );
      }
      if (!clerkRank) {
        return NextResponse.json(
          { error: "Rank is required for clerks" },
          { status: 400 }
        );
      }
      if (!clerkUnit) {
        return NextResponse.json(
          { error: "Unit is required for clerks" },
          { status: 400 }
        );
      }
      if (!clerkRole) {
        return NextResponse.json(
          { error: "Role/Position is required for clerks" },
          { status: 400 }
        );
      }
      if (!clerkDateOfJoining) {
        return NextResponse.json(
          { error: "Date of joining is required for clerks" },
          { status: 400 }
        );
      }
      if (!clerkPhone) {
        return NextResponse.json(
          { error: "Phone number is required for clerks" },
          { status: 400 }
        );
      }
      if (!clerkAddress) {
        return NextResponse.json(
          { error: "Address is required for clerks" },
          { status: 400 }
        );
      }
      if (!clerkEmergencyContactName) {
        return NextResponse.json(
          { error: "Emergency contact name is required for clerks" },
          { status: 400 }
        );
      }
      if (!clerkEmergencyContact) {
        return NextResponse.json(
          { error: "Emergency contact number is required for clerks" },
          { status: 400 }
        );
      }
    }

    if (userType === "adjutant") {
      if (!adjutantServiceNo) {
        return NextResponse.json(
          { error: "Service number is required for adjutants" },
          { status: 400 }
        );
      }
      if (await serviceNoExists(adjutantServiceNo)) {
        return NextResponse.json(
          { error: "A user with this service number already exists" },
          { status: 409 }
        );
      }
      if (!adjutantRank) {
        return NextResponse.json(
          { error: "Rank is required for adjutants" },
          { status: 400 }
        );
      }
      if (!adjutantUnit) {
        return NextResponse.json(
          { error: "Unit is required for adjutants" },
          { status: 400 }
        );
      }
      if (!adjutantDateOfJoining) {
        return NextResponse.json(
          { error: "Date of joining is required for adjutants" },
          { status: 400 }
        );
      }
      if (!adjutantPhone) {
        return NextResponse.json(
          { error: "Phone number is required for adjutants" },
          { status: 400 }
        );
      }
      if (!adjutantAddress) {
        return NextResponse.json(
          { error: "Address is required for adjutants" },
          { status: 400 }
        );
      }
      if (!adjutantEmergencyContactName) {
        return NextResponse.json(
          { error: "Emergency contact name is required for adjutants" },
          { status: 400 }
        );
      }
      if (!adjutantEmergencyContact) {
        return NextResponse.json(
          { error: "Emergency contact number is required for adjutants" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await hashPassword(password);

    const user = await createUser({
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      userType,
      // Soldier fields
      serviceNo: userType === "soldier" ? serviceNo : undefined,
      rank: userType === "soldier" ? rank : undefined,
      unit: userType === "soldier" ? unit : undefined,
      dateOfBirth: userType === "soldier" ? new Date(dateOfBirth) : undefined,
      dateOfJoining: userType === "soldier" ? new Date(dateOfJoining) : undefined,
      bloodGroup: userType === "soldier" ? bloodGroup : undefined,
      height: userType === "soldier" ? Number(height) : undefined,
      weight: userType === "soldier" ? Number(weight) : undefined,
      bmi: userType === "soldier" ? parseFloat((Number(weight) / ((Number(height) / 100) ** 2)).toFixed(1)) : undefined,
      medicalCategory: userType === "soldier" ? medicalCategory : undefined,
      // Clerk fields
      clerkServiceNo: userType === "clerk" ? clerkServiceNo : undefined,
      clerkRank: userType === "clerk" ? clerkRank : undefined,
      clerkUnit: userType === "clerk" ? clerkUnit : undefined,
      clerkRole: userType === "clerk" ? clerkRole : undefined,
      clerkDateOfJoining: userType === "clerk" ? new Date(clerkDateOfJoining) : undefined,
      clerkPhone: userType === "clerk" ? clerkPhone : undefined,
      clerkAddress: userType === "clerk" ? clerkAddress : undefined,
      clerkEmergencyContactName: userType === "clerk" ? clerkEmergencyContactName : undefined,
      clerkEmergencyContact: userType === "clerk" ? clerkEmergencyContact : undefined,
      // Adjutant fields
      adjutantServiceNo: userType === "adjutant" ? adjutantServiceNo : undefined,
      adjutantRank: userType === "adjutant" ? adjutantRank : undefined,
      adjutantUnit: userType === "adjutant" ? adjutantUnit : undefined,
      adjutantDateOfJoining: userType === "adjutant" ? new Date(adjutantDateOfJoining) : undefined,
      adjutantPhone: userType === "adjutant" ? adjutantPhone : undefined,
      adjutantAddress: userType === "adjutant" ? adjutantAddress : undefined,
      adjutantEmergencyContactName: userType === "adjutant" ? adjutantEmergencyContactName : undefined,
      adjutantEmergencyContact: userType === "adjutant" ? adjutantEmergencyContact : undefined,
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      userType: user.userType,
    });

    // For soldiers, inform them they need adjutant approval
    if (userType === "soldier") {
      return NextResponse.json(
        {
          message: "Account created successfully. Please wait for the Adjutant to approve your account before you can log in.",
          pendingApproval: true,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            userType: user.userType,
            serviceNo: user.serviceNo,
          },
        },
        { status: 201 }
      );
    }

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

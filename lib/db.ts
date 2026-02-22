// Switched to Prisma + SQLite instead of JSON file storage.
import { PrismaClient } from "@prisma/client";

export type UserType = "soldier" | "clerk" | "adjutant";

export interface UserRecord {
  id: string;
  email: string;
  password: string; // hashed
  fullName: string;
  userType: UserType;
  // Common fields
  serviceNo?: string | null;
  rank?: string | null;
  unit?: string | null;
  phone?: string | null;
  address?: string | null;
  emergencyContactName?: string | null;
  emergencyContact?: string | null;
  fitnessStatus?: string | null;
  
  // Soldier-specific fields
  dateOfBirth?: Date | null;
  dateOfJoining?: Date | null;
  bloodGroup?: string | null;
  height?: number | null;
  weight?: number | null;
  bmi?: number | null;
  medicalCategory?: string | null;
  
  // Clerk-specific fields
  clerkServiceNo?: string | null;
  clerkRank?: string | null;
  clerkUnit?: string | null;
  clerkRole?: string | null;
  clerkDateOfJoining?: Date | null;
  clerkPhone?: string | null;
  clerkAddress?: string | null;
  clerkEmergencyContactName?: string | null;
  clerkEmergencyContact?: string | null;
  
  // Adjutant-specific fields
  adjutantServiceNo?: string | null;
  adjutantRank?: string | null;
  adjutantUnit?: string | null;
  adjutantDateOfJoining?: Date | null;
  adjutantPhone?: string | null;
  adjutantAddress?: string | null;
  adjutantEmergencyContactName?: string | null;
  adjutantEmergencyContact?: string | null;
  
  createdAt: string;
}

const prisma = new PrismaClient();

export async function getUserByEmail(email: string): Promise<UserRecord | undefined> {
  const normalized = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) return undefined;
  return {
    id: user.id,
    email: user.email,
    password: user.password,
    fullName: user.fullName,
    userType: user.userType as UserType,
    serviceNo: user.serviceNo ?? undefined,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function getUserById(id: string): Promise<UserRecord | undefined> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return undefined;
  return {
    id: user.id,
    email: user.email,
    password: user.password,
    fullName: user.fullName,
    userType: user.userType as UserType,
    serviceNo: user.serviceNo ?? undefined,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function emailExists(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  return !!user;
}

export async function serviceNoExists(serviceNo: string): Promise<boolean> {
  const trimmed = serviceNo.trim();
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { serviceNo: trimmed },
        { clerkServiceNo: trimmed },
        { adjutantServiceNo: trimmed },
      ],
    },
  });
  return !!user;
}

export async function createUser(input: Omit<UserRecord, "id" | "createdAt">): Promise<UserRecord> {
  const normalizedEmail = input.email.trim().toLowerCase();
  
  // Build the data object with all fields
  const userData: Record<string, unknown> = {
    email: normalizedEmail,
    password: input.password,
    fullName: input.fullName,
    userType: input.userType,
    // Soldiers need adjutant approval; clerks/adjutants are auto-approved
    approved: input.userType === 'soldier' ? false : true,
    serviceNo: input.serviceNo ?? null,
    rank: input.rank ?? null,
    unit: input.unit ?? null,
    phone: input.phone ?? null,
    address: input.address ?? null,
    emergencyContactName: input.emergencyContactName ?? null,
    emergencyContact: input.emergencyContact ?? null,
    fitnessStatus: input.fitnessStatus ?? null,
    // Soldier fields
    dateOfBirth: input.dateOfBirth ?? null,
    dateOfJoining: input.dateOfJoining ?? null,
    bloodGroup: input.bloodGroup ?? null,
    height: input.height ?? null,
    weight: input.weight ?? null,
    medicalCategory: input.medicalCategory ?? null,
    // Clerk fields
    clerkServiceNo: input.clerkServiceNo ?? null,
    clerkRank: input.clerkRank ?? null,
    clerkUnit: input.clerkUnit ?? null,
    clerkRole: input.clerkRole ?? null,
    clerkDateOfJoining: input.clerkDateOfJoining ?? null,
    clerkPhone: input.clerkPhone ?? null,
    clerkAddress: input.clerkAddress ?? null,
    clerkEmergencyContactName: input.clerkEmergencyContactName ?? null,
    clerkEmergencyContact: input.clerkEmergencyContact ?? null,
    // Adjutant fields
    adjutantServiceNo: input.adjutantServiceNo ?? null,
    adjutantRank: input.adjutantRank ?? null,
    adjutantUnit: input.adjutantUnit ?? null,
    adjutantDateOfJoining: input.adjutantDateOfJoining ?? null,
    adjutantPhone: input.adjutantPhone ?? null,
    adjutantAddress: input.adjutantAddress ?? null,
    adjutantEmergencyContactName: input.adjutantEmergencyContactName ?? null,
    adjutantEmergencyContact: input.adjutantEmergencyContact ?? null,
  };

  const created = await prisma.user.create({
    data: userData as Parameters<typeof prisma.user.create>[0]['data'],
  });

  return {
    id: created.id,
    email: created.email,
    password: created.password,
    fullName: created.fullName,
    userType: created.userType as UserType,
    // Common fields
    serviceNo: created.serviceNo ?? undefined,
    rank: (created as Record<string, unknown>).rank as string | null | undefined,
    unit: (created as Record<string, unknown>).unit as string | null | undefined,
    phone: (created as Record<string, unknown>).phone as string | null | undefined,
    address: (created as Record<string, unknown>).address as string | null | undefined,
    emergencyContactName: (created as Record<string, unknown>).emergencyContactName as string | null | undefined,
    emergencyContact: (created as Record<string, unknown>).emergencyContact as string | null | undefined,
    fitnessStatus: (created as Record<string, unknown>).fitnessStatus as string | null | undefined,
    // Soldier fields
    dateOfBirth: (created as Record<string, unknown>).dateOfBirth as Date | null | undefined,
    dateOfJoining: (created as Record<string, unknown>).dateOfJoining as Date | null | undefined,
    bloodGroup: (created as Record<string, unknown>).bloodGroup as string | null | undefined,
    height: (created as Record<string, unknown>).height as number | null | undefined,
    weight: (created as Record<string, unknown>).weight as number | null | undefined,
    medicalCategory: (created as Record<string, unknown>).medicalCategory as string | null | undefined,
    // Clerk fields
    clerkServiceNo: (created as Record<string, unknown>).clerkServiceNo as string | null | undefined,
    clerkRank: (created as Record<string, unknown>).clerkRank as string | null | undefined,
    clerkUnit: (created as Record<string, unknown>).clerkUnit as string | null | undefined,
    clerkRole: (created as Record<string, unknown>).clerkRole as string | null | undefined,
    clerkDateOfJoining: (created as Record<string, unknown>).clerkDateOfJoining as Date | null | undefined,
    clerkPhone: (created as Record<string, unknown>).clerkPhone as string | null | undefined,
    clerkAddress: (created as Record<string, unknown>).clerkAddress as string | null | undefined,
    clerkEmergencyContactName: (created as Record<string, unknown>).clerkEmergencyContactName as string | null | undefined,
    clerkEmergencyContact: (created as Record<string, unknown>).clerkEmergencyContact as string | null | undefined,
    // Adjutant fields
    adjutantServiceNo: (created as Record<string, unknown>).adjutantServiceNo as string | null | undefined,
    adjutantRank: (created as Record<string, unknown>).adjutantRank as string | null | undefined,
    adjutantUnit: (created as Record<string, unknown>).adjutantUnit as string | null | undefined,
    adjutantDateOfJoining: (created as Record<string, unknown>).adjutantDateOfJoining as Date | null | undefined,
    adjutantPhone: (created as Record<string, unknown>).adjutantPhone as string | null | undefined,
    adjutantAddress: (created as Record<string, unknown>).adjutantAddress as string | null | undefined,
    adjutantEmergencyContactName: (created as Record<string, unknown>).adjutantEmergencyContactName as string | null | undefined,
    adjutantEmergencyContact: (created as Record<string, unknown>).adjutantEmergencyContact as string | null | undefined,
    createdAt: created.createdAt.toISOString(),
  };
}

// Prevent multiple PrismaClients in development hot-reload environments
declare global {
  var prisma: PrismaClient | undefined;
}

if (!global.prisma) {
  global.prisma = prisma;
}
export { prisma };

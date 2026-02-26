// Switched to SQLite Cloud (@sqlitecloud/drivers) instead of Prisma.
import { randomUUID } from "crypto";
import { getDb } from "./sqlitecloud-client";

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
  approved?: boolean | null;
}

// ---------------------------------------------------------------------------
// Helper: map a raw DB row → UserRecord
// ---------------------------------------------------------------------------
function rowToUserRecord(row: Record<string, unknown>): UserRecord {
  return {
    id: row.id as string,
    email: row.email as string,
    password: row.password as string,
    fullName: row.fullName as string,
    userType: row.userType as UserType,
    serviceNo: (row.serviceNo as string | null) ?? null,
    rank: (row.rank as string | null) ?? null,
    unit: (row.unit as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    address: (row.address as string | null) ?? null,
    emergencyContactName: (row.emergencyContactName as string | null) ?? null,
    emergencyContact: (row.emergencyContact as string | null) ?? null,
    fitnessStatus: (row.fitnessStatus as string | null) ?? null,
    dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth as string) : null,
    dateOfJoining: row.dateOfJoining ? new Date(row.dateOfJoining as string) : null,
    bloodGroup: (row.bloodGroup as string | null) ?? null,
    height: (row.height as number | null) ?? null,
    weight: (row.weight as number | null) ?? null,
    bmi: (row.bmi as number | null) ?? null,
    medicalCategory: (row.medicalCategory as string | null) ?? null,
    clerkServiceNo: (row.clerkServiceNo as string | null) ?? null,
    clerkRank: (row.clerkRank as string | null) ?? null,
    clerkUnit: (row.clerkUnit as string | null) ?? null,
    clerkRole: (row.clerkRole as string | null) ?? null,
    clerkDateOfJoining: row.clerkDateOfJoining ? new Date(row.clerkDateOfJoining as string) : null,
    clerkPhone: (row.clerkPhone as string | null) ?? null,
    clerkAddress: (row.clerkAddress as string | null) ?? null,
    clerkEmergencyContactName: (row.clerkEmergencyContactName as string | null) ?? null,
    clerkEmergencyContact: (row.clerkEmergencyContact as string | null) ?? null,
    adjutantServiceNo: (row.adjutantServiceNo as string | null) ?? null,
    adjutantRank: (row.adjutantRank as string | null) ?? null,
    adjutantUnit: (row.adjutantUnit as string | null) ?? null,
    adjutantDateOfJoining: row.adjutantDateOfJoining ? new Date(row.adjutantDateOfJoining as string) : null,
    adjutantPhone: (row.adjutantPhone as string | null) ?? null,
    adjutantAddress: (row.adjutantAddress as string | null) ?? null,
    adjutantEmergencyContactName: (row.adjutantEmergencyContactName as string | null) ?? null,
    adjutantEmergencyContact: (row.adjutantEmergencyContact as string | null) ?? null,
    createdAt: row.createdAt as string,
    approved: row.approved != null ? Boolean(row.approved) : null,
  };
}

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

export async function getUserByEmail(email: string): Promise<UserRecord | undefined> {
  const db = getDb();
  const normalized = email.trim().toLowerCase();
  const rows = await db.sql`SELECT * FROM User WHERE email = ${normalized} LIMIT 1`;
  if (!rows || rows.length === 0) return undefined;
  return rowToUserRecord(rows[0] as Record<string, unknown>);
}

export async function getUserById(id: string): Promise<UserRecord | undefined> {
  const db = getDb();
  const rows = await db.sql`SELECT * FROM User WHERE id = ${id} LIMIT 1`;
  if (!rows || rows.length === 0) return undefined;
  return rowToUserRecord(rows[0] as Record<string, unknown>);
}

export async function emailExists(email: string): Promise<boolean> {
  const db = getDb();
  const normalized = email.trim().toLowerCase();
  const rows = await db.sql`SELECT id FROM User WHERE email = ${normalized} LIMIT 1`;
  return rows != null && rows.length > 0;
}

export async function serviceNoExists(serviceNo: string): Promise<boolean> {
  const db = getDb();
  const trimmed = serviceNo.trim();
  const rows = await db.sql`SELECT id FROM User WHERE serviceNo = ${trimmed} OR clerkServiceNo = ${trimmed} OR adjutantServiceNo = ${trimmed} LIMIT 1`;
  return rows != null && rows.length > 0;
}

export async function createUser(input: Omit<UserRecord, "id" | "createdAt">): Promise<UserRecord> {
  const db = getDb();
  const id = randomUUID();
  const now = new Date().toISOString();
  const normalizedEmail = input.email.trim().toLowerCase();

  // Convert Date objects to ISO strings for storage
  const dateOfBirth = input.dateOfBirth instanceof Date ? input.dateOfBirth.toISOString() : (input.dateOfBirth ?? null);
  const dateOfJoining = input.dateOfJoining instanceof Date ? input.dateOfJoining.toISOString() : (input.dateOfJoining ?? null);
  const clerkDateOfJoining = input.clerkDateOfJoining instanceof Date ? input.clerkDateOfJoining.toISOString() : (input.clerkDateOfJoining ?? null);
  const adjutantDateOfJoining = input.adjutantDateOfJoining instanceof Date ? input.adjutantDateOfJoining.toISOString() : (input.adjutantDateOfJoining ?? null);

  await db.sql`
    INSERT INTO User (
      id, email, password, fullName, userType,
      serviceNo, rank, unit, phone, address, emergencyContactName, emergencyContact, fitnessStatus,
      dateOfBirth, dateOfJoining, bloodGroup, height, weight, bmi, medicalCategory,
      clerkServiceNo, clerkRank, clerkUnit, clerkRole, clerkDateOfJoining, clerkPhone, clerkAddress, clerkEmergencyContactName, clerkEmergencyContact,
      adjutantServiceNo, adjutantRank, adjutantUnit, adjutantDateOfJoining, adjutantPhone, adjutantAddress, adjutantEmergencyContactName, adjutantEmergencyContact,
      approved, createdAt, updatedAt
    ) VALUES (
      ${id}, ${normalizedEmail}, ${input.password}, ${input.fullName}, ${input.userType},
      ${input.serviceNo ?? null}, ${input.rank ?? null}, ${input.unit ?? null}, ${input.phone ?? null}, ${input.address ?? null}, ${input.emergencyContactName ?? null}, ${input.emergencyContact ?? null}, ${input.fitnessStatus ?? null},
      ${dateOfBirth}, ${dateOfJoining}, ${input.bloodGroup ?? null}, ${input.height ?? null}, ${input.weight ?? null}, ${input.bmi ?? null}, ${input.medicalCategory ?? null},
      ${input.clerkServiceNo ?? null}, ${input.clerkRank ?? null}, ${input.clerkUnit ?? null}, ${input.clerkRole ?? null}, ${clerkDateOfJoining}, ${input.clerkPhone ?? null}, ${input.clerkAddress ?? null}, ${input.clerkEmergencyContactName ?? null}, ${input.clerkEmergencyContact ?? null},
      ${input.adjutantServiceNo ?? null}, ${input.adjutantRank ?? null}, ${input.adjutantUnit ?? null}, ${adjutantDateOfJoining}, ${input.adjutantPhone ?? null}, ${input.adjutantAddress ?? null}, ${input.adjutantEmergencyContactName ?? null}, ${input.adjutantEmergencyContact ?? null},
      ${input.userType === 'soldier' ? 0 : 1}, ${now}, ${now}
    )
  `;

  return {
    id,
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
    dateOfBirth: input.dateOfBirth ?? null,
    dateOfJoining: input.dateOfJoining ?? null,
    bloodGroup: input.bloodGroup ?? null,
    height: input.height ?? null,
    weight: input.weight ?? null,
    bmi: input.bmi ?? null,
    medicalCategory: input.medicalCategory ?? null,
    clerkServiceNo: input.clerkServiceNo ?? null,
    clerkRank: input.clerkRank ?? null,
    clerkUnit: input.clerkUnit ?? null,
    clerkRole: input.clerkRole ?? null,
    clerkDateOfJoining: input.clerkDateOfJoining ?? null,
    clerkPhone: input.clerkPhone ?? null,
    clerkAddress: input.clerkAddress ?? null,
    clerkEmergencyContactName: input.clerkEmergencyContactName ?? null,
    clerkEmergencyContact: input.clerkEmergencyContact ?? null,
    adjutantServiceNo: input.adjutantServiceNo ?? null,
    adjutantRank: input.adjutantRank ?? null,
    adjutantUnit: input.adjutantUnit ?? null,
    adjutantDateOfJoining: input.adjutantDateOfJoining ?? null,
    adjutantPhone: input.adjutantPhone ?? null,
    adjutantAddress: input.adjutantAddress ?? null,
    adjutantEmergencyContactName: input.adjutantEmergencyContactName ?? null,
    adjutantEmergencyContact: input.adjutantEmergencyContact ?? null,
    createdAt: now,
  };
}

// Re-export getDb so routes can use it directly
export { getDb } from "./sqlitecloud-client";

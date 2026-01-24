// Switched to Prisma + SQLite instead of JSON file storage.
import { PrismaClient } from "@prisma/client";

export type UserType = "soldier" | "clerk" | "adjutant";

export interface UserRecord {
  id: string;
  email: string;
  password: string; // hashed
  fullName: string;
  userType: UserType;
  serviceNo?: string | null;
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

export async function createUser(input: Omit<UserRecord, "id" | "createdAt">): Promise<UserRecord> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const created = await prisma.user.create({
    data: {
      // allow explicit id to be passed in input if present, otherwise Prisma will generate
      id: (input as any).id ?? undefined,
      email: normalizedEmail,
      password: input.password,
      fullName: input.fullName,
      userType: input.userType,
      serviceNo: input.serviceNo ?? null,
    },
  });

  return {
    id: created.id,
    email: created.email,
    password: created.password,
    fullName: created.fullName,
    userType: created.userType as UserType,
    serviceNo: created.serviceNo ?? undefined,
    createdAt: created.createdAt.toISOString(),
  };
}

// Prevent multiple PrismaClients in development hot-reload environments
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

if (!global.prisma) {
  global.prisma = prisma;
}
export { prisma };

/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "serviceNo" TEXT,
    "rank" TEXT,
    "unit" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContact" TEXT,
    "fitnessStatus" TEXT,
    "dateOfBirth" DATETIME,
    "dateOfJoining" DATETIME,
    "bloodGroup" TEXT,
    "height" INTEGER,
    "weight" INTEGER,
    "bmi" REAL,
    "medicalCategory" TEXT,
    "clerkServiceNo" TEXT,
    "clerkRank" TEXT,
    "clerkUnit" TEXT,
    "clerkRole" TEXT,
    "clerkDateOfJoining" DATETIME,
    "clerkPhone" TEXT,
    "clerkAddress" TEXT,
    "clerkEmergencyContactName" TEXT,
    "clerkEmergencyContact" TEXT,
    "adjutantServiceNo" TEXT,
    "adjutantRank" TEXT,
    "adjutantUnit" TEXT,
    "adjutantDateOfJoining" DATETIME,
    "adjutantPhone" TEXT,
    "adjutantAddress" TEXT,
    "adjutantEmergencyContactName" TEXT,
    "adjutantEmergencyContact" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "fitnessStatus", "fullName", "id", "password", "serviceNo", "userType") SELECT "createdAt", "email", "fitnessStatus", "fullName", "id", "password", "serviceNo", "userType" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

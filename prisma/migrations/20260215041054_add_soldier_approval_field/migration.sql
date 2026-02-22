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
    "approved" BOOLEAN NOT NULL DEFAULT false,
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
INSERT INTO "new_User" ("address", "adjutantAddress", "adjutantDateOfJoining", "adjutantEmergencyContact", "adjutantEmergencyContactName", "adjutantPhone", "adjutantRank", "adjutantServiceNo", "adjutantUnit", "bloodGroup", "bmi", "clerkAddress", "clerkDateOfJoining", "clerkEmergencyContact", "clerkEmergencyContactName", "clerkPhone", "clerkRank", "clerkRole", "clerkServiceNo", "clerkUnit", "createdAt", "dateOfBirth", "dateOfJoining", "email", "emergencyContact", "emergencyContactName", "fitnessStatus", "fullName", "height", "id", "medicalCategory", "password", "phone", "rank", "serviceNo", "unit", "updatedAt", "userType", "weight") SELECT "address", "adjutantAddress", "adjutantDateOfJoining", "adjutantEmergencyContact", "adjutantEmergencyContactName", "adjutantPhone", "adjutantRank", "adjutantServiceNo", "adjutantUnit", "bloodGroup", "bmi", "clerkAddress", "clerkDateOfJoining", "clerkEmergencyContact", "clerkEmergencyContactName", "clerkPhone", "clerkRank", "clerkRole", "clerkServiceNo", "clerkUnit", "createdAt", "dateOfBirth", "dateOfJoining", "email", "emergencyContact", "emergencyContactName", "fitnessStatus", "fullName", "height", "id", "medicalCategory", "password", "phone", "rank", "serviceNo", "unit", "updatedAt", "userType", "weight" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_serviceNo_key" ON "User"("serviceNo");
CREATE UNIQUE INDEX "User_clerkServiceNo_key" ON "User"("clerkServiceNo");
CREATE UNIQUE INDEX "User_adjutantServiceNo_key" ON "User"("adjutantServiceNo");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

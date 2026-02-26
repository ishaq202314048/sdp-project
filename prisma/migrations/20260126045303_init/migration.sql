-- AlterTable
ALTER TABLE "User" ADD COLUMN "fitnessStatus" TEXT;

-- CreateTable
CREATE TABLE "FitnessPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "exercises" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AssignedPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "assignedBy" TEXT,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "FitnessPlan_status_idx" ON "FitnessPlan"("status");

-- CreateIndex
CREATE INDEX "AssignedPlan_userId_idx" ON "AssignedPlan"("userId");

-- CreateIndex
CREATE INDEX "AssignedPlan_planId_idx" ON "AssignedPlan"("planId");

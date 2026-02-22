-- CreateTable
CREATE TABLE "FitnessTest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "soldierUserId" TEXT NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "duration" TEXT,
    "result" TEXT NOT NULL,
    "score" INTEGER,
    "justifiedBy" TEXT,
    "justifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "FitnessTest_soldierUserId_idx" ON "FitnessTest"("soldierUserId");

-- CreateIndex
CREATE INDEX "FitnessTest_justifiedBy_idx" ON "FitnessTest"("justifiedBy");

-- CreateIndex
CREATE INDEX "FitnessTest_createdAt_idx" ON "FitnessTest"("createdAt");

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentBy" TEXT NOT NULL,
    "sentByName" TEXT NOT NULL,
    "sentTo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Report_sentBy_idx" ON "Report"("sentBy");

-- CreateIndex
CREATE INDEX "Report_sentTo_idx" ON "Report"("sentTo");

-- CreateIndex
CREATE INDEX "Report_createdAt_idx" ON "Report"("createdAt");

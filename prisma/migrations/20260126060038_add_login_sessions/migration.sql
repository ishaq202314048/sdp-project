-- CreateTable
CREATE TABLE "LoginSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "loginAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "LoginSession_userId_idx" ON "LoginSession"("userId");

-- CreateIndex
CREATE INDEX "LoginSession_email_idx" ON "LoginSession"("email");

-- CreateIndex
CREATE INDEX "LoginSession_loginAt_idx" ON "LoginSession"("loginAt");

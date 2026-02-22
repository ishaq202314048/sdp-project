/*
  Warnings:

  - A unique constraint covering the columns `[serviceNo]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkServiceNo]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adjutantServiceNo]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_serviceNo_key" ON "User"("serviceNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkServiceNo_key" ON "User"("clerkServiceNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_adjutantServiceNo_key" ON "User"("adjutantServiceNo");

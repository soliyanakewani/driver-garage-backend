/*
  Warnings:

  - You are about to drop the column `license` on the `Garage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Garage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Garage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Garage" DROP COLUMN "license",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Garage_email_key" ON "Garage"("email");

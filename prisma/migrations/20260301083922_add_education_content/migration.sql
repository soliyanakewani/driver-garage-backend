-- CreateEnum
CREATE TYPE "EducationCategory" AS ENUM ('ALL', 'SAFETY', 'MAINTENANCE', 'REPAIRS', 'TIPS');

-- CreateTable
CREATE TABLE "EducationContent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "EducationCategory" NOT NULL,
    "imageUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationContent_pkey" PRIMARY KEY ("id")
);

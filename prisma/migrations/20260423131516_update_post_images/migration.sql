-- DropIndex
DROP INDEX "VehicleMaintenanceHealth_vehicleId_key";

-- AlterTable
ALTER TABLE "GarageRating" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "PostComment" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "PostReport" ALTER COLUMN "updatedAt" DROP DEFAULT;

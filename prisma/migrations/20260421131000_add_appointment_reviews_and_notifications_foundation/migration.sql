-- AlterTable
ALTER TABLE "GarageRating"
ADD COLUMN "appointmentId" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "GarageRating_appointmentId_key" ON "GarageRating"("appointmentId");

-- CreateIndex
CREATE INDEX "GarageRating_driverId_idx" ON "GarageRating"("driverId");

-- AddForeignKey
ALTER TABLE "GarageRating"
ADD CONSTRAINT "GarageRating_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GarageRating"
ADD CONSTRAINT "GarageRating_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

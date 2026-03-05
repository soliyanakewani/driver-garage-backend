-- CreateTable
CREATE TABLE "GarageService" (
    "id" TEXT NOT NULL,
    "garageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GarageService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GarageService_garageId_idx" ON "GarageService"("garageId");

-- AddForeignKey
ALTER TABLE "GarageService" ADD CONSTRAINT "GarageService_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "Garage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "GarageNotification" (
    "id" TEXT NOT NULL,
    "garageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GarageNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GarageSetting" (
    "id" TEXT NOT NULL,
    "garageId" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GarageSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GarageRating" (
    "id" TEXT NOT NULL,
    "garageId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GarageRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GarageNotification_garageId_idx" ON "GarageNotification"("garageId");

-- CreateIndex
CREATE UNIQUE INDEX "GarageSetting_garageId_key" ON "GarageSetting"("garageId");

-- CreateIndex
CREATE INDEX "GarageRating_garageId_idx" ON "GarageRating"("garageId");

-- AddForeignKey
ALTER TABLE "GarageNotification" ADD CONSTRAINT "GarageNotification_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "Garage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GarageSetting" ADD CONSTRAINT "GarageSetting_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "Garage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GarageRating" ADD CONSTRAINT "GarageRating_garageId_fkey" FOREIGN KEY ("garageId") REFERENCES "Garage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

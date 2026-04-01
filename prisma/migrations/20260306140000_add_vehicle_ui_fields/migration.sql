-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN IF NOT EXISTS "vin" VARCHAR(17);
ALTER TABLE "Vehicle" ADD COLUMN IF NOT EXISTS "mileage" INTEGER;
ALTER TABLE "Vehicle" ADD COLUMN IF NOT EXISTS "fuel_type" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN IF NOT EXISTS "image_url" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN IF NOT EXISTS "insurance_document_url" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN IF NOT EXISTS "insurance_expires_at" TIMESTAMP(3);
ALTER TABLE "Vehicle" ADD COLUMN IF NOT EXISTS "registration_document_url" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN IF NOT EXISTS "registration_expires_at" TIMESTAMP(3);

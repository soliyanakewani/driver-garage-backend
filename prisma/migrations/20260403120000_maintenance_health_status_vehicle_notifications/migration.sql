-- Vehicle maintenance health (per-vehicle component percentages + custom slots)
CREATE TABLE "VehicleMaintenanceHealth" (
    "vehicleId" TEXT NOT NULL,
    "health" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleMaintenanceHealth_pkey" PRIMARY KEY ("vehicleId")
);

CREATE UNIQUE INDEX "VehicleMaintenanceHealth_vehicleId_key" ON "VehicleMaintenanceHealth"("vehicleId");

ALTER TABLE "VehicleMaintenanceHealth" ADD CONSTRAINT "VehicleMaintenanceHealth_vehicleId_fkey"
FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Driver notifications: link to vehicle + reminder for Flutter
ALTER TABLE "DriverNotification" ADD COLUMN "vehicleId" TEXT;
ALTER TABLE "DriverNotification" ADD COLUMN "reminderId" TEXT;
ALTER TABLE "DriverNotification" ADD COLUMN "vehiclePlate" TEXT;

CREATE INDEX "DriverNotification_vehicleId_idx" ON "DriverNotification"("vehicleId");
CREATE INDEX "DriverNotification_reminderId_idx" ON "DriverNotification"("reminderId");

ALTER TABLE "DriverNotification" ADD CONSTRAINT "DriverNotification_vehicleId_fkey"
FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Reminder: preset vs custom, completion, health rollback fields
CREATE TYPE "MaintenancePresetCategory" AS ENUM (
  'OIL_CHANGE',
  'TIRE_ROTATION',
  'TIRE_INSPECTION',
  'BRAKE_INSPECTION',
  'BRAKE_SERVICE',
  'BATTERY_CHECK',
  'COOLANT',
  'TRANSMISSION_FLUID',
  'AIR_FILTER',
  'CABIN_FILTER',
  'ENGINE_DIAGNOSTIC',
  'BELTS_HOSES',
  'SPARK_PLUGS',
  'WIPERS_LIGHTS',
  'FLUIDS_CHECK',
  'OTHER'
);

ALTER TABLE "MaintenanceReminder" ADD COLUMN "presetCategory" "MaintenancePresetCategory";
ALTER TABLE "MaintenanceReminder" ADD COLUMN "customServiceName" TEXT;
ALTER TABLE "MaintenanceReminder" ADD COLUMN "completedAt" TIMESTAMP(3);
ALTER TABLE "MaintenanceReminder" ADD COLUMN "healthComponentKey" TEXT;
ALTER TABLE "MaintenanceReminder" ADD COLUMN "healthValueBefore" DOUBLE PRECISION;
ALTER TABLE "MaintenanceReminder" ADD COLUMN "healthReductionApplied" DOUBLE PRECISION;
ALTER TABLE "MaintenanceReminder" ADD COLUMN "customSlotId" TEXT;

CREATE INDEX "MaintenanceReminder_vehicleId_scheduledDate_idx" ON "MaintenanceReminder"("vehicleId", "scheduledDate");

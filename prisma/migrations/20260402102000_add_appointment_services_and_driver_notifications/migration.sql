-- Add driver in-app notifications for maintenance reminders
CREATE TABLE "DriverNotification" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DriverNotification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DriverNotification_driverId_idx" ON "DriverNotification"("driverId");

ALTER TABLE "DriverNotification" ADD CONSTRAINT "DriverNotification_driverId_fkey"
FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Track reminder delivery to avoid duplicate notifications
ALTER TABLE "MaintenanceReminder"
ADD COLUMN "notified_at" TIMESTAMP(3);

-- Support booking multiple services in one appointment
CREATE TABLE "AppointmentService" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "garageServiceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppointmentService_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AppointmentService_appointmentId_garageServiceId_key"
ON "AppointmentService"("appointmentId", "garageServiceId");
CREATE INDEX "AppointmentService_appointmentId_idx" ON "AppointmentService"("appointmentId");
CREATE INDEX "AppointmentService_garageServiceId_idx" ON "AppointmentService"("garageServiceId");

ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_appointmentId_fkey"
FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_garageServiceId_fkey"
FOREIGN KEY ("garageServiceId") REFERENCES "GarageService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "Appointment_driverId_scheduledAt_idx" ON "Appointment"("driverId", "scheduledAt");
CREATE INDEX "Appointment_garageId_scheduledAt_idx" ON "Appointment"("garageId", "scheduledAt");

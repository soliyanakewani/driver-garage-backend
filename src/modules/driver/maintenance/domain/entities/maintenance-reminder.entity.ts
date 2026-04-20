import type { ReminderDisplayStatus } from '../maintenance-health.types';

export interface MaintenanceReminder {
  id: string;
  driverId: string;
  vehicleId: string | null;
  serviceName: string;
  presetCategory: string | null;
  customServiceName: string | null;
  scheduledDate: Date;
  estimatedCostMin: number | null;
  estimatedCostMax: number | null;
  reminderSet: boolean;
  notifiedAt: Date | null;
  notes: string | null;
  completedAt: Date | null;
  healthComponentKey: string | null;
  healthValueBefore: number | null;
  healthReductionApplied: number | null;
  customSlotId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Enriched for API / Flutter */
export interface MaintenanceReminderView extends MaintenanceReminder {
  displayStatus: ReminderDisplayStatus;
  daysUntilDue: number;
  overdueDays: number;
  vehiclePlate: string | null;
  vehicleLabel: string | null;
}

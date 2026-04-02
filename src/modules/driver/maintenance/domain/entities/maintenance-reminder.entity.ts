export interface MaintenanceReminder {
  id: string;
  driverId: string;
  vehicleId: string | null;
  serviceName: string;
  scheduledDate: Date;
  estimatedCostMin: number | null;
  estimatedCostMax: number | null;
  reminderSet: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

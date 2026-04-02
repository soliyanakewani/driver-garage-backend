export interface MaintenanceRecord {
  id: string;
  driverId: string;
  vehicleId: string | null;
  serviceName: string;
  garageName: string | null;
  serviceDate: Date;
  cost: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

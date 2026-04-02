export interface CreateRecordDto {
  vehicleId?: string;
  serviceName: string;
  garageName?: string;
  serviceDate: string; // ISO date string from client
  cost?: number;
  notes?: string;
}

export interface UpdateRecordDto {
  vehicleId?: string | null;
  serviceName?: string;
  garageName?: string | null;
  serviceDate?: string;
  cost?: number | null;
  notes?: string | null;
}

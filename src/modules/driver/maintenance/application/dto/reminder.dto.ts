export interface CreateReminderDto {
  vehicleId?: string;
  serviceName: string;
  scheduledDate: string; // ISO date string from client
  estimatedCostMin?: number;
  estimatedCostMax?: number;
  notes?: string;
}

export interface UpdateReminderDto {
  vehicleId?: string | null;
  serviceName?: string;
  scheduledDate?: string;
  estimatedCostMin?: number | null;
  estimatedCostMax?: number | null;
  notes?: string | null;
}

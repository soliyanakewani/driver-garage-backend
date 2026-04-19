export interface CreateReminderDto {
  /** Required — which car this maintenance is for */
  vehicleId: string;
  /** One of MAINTENANCE_CATALOG ids (e.g. OIL_CHANGE) or OTHER */
  presetCategory: string;
  /** Required when presetCategory is OTHER */
  customServiceName?: string;
  scheduledDate: string;
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

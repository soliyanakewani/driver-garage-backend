import { MaintenanceReminder, MaintenanceReminderView } from '../entities/maintenance-reminder.entity';
import { MaintenanceRecord } from '../entities/maintenance-record.entity';
import type { VehicleHealthState } from '../maintenance-health.types';

export interface CreateReminderData {
  driverId: string;
  vehicleId: string;
  presetCategory: string;
  customServiceName: string | null;
  scheduledDate: Date;
  estimatedCostMin?: number | null;
  estimatedCostMax?: number | null;
  notes?: string | null;
}

export interface UpdateReminderData {
  serviceName?: string;
  scheduledDate?: Date;
  estimatedCostMin?: number | null;
  estimatedCostMax?: number | null;
  notes?: string | null;
  vehicleId?: string | null;
}

export interface CreateRecordData {
  driverId: string;
  vehicleId?: string | null;
  serviceName: string;
  garageName?: string | null;
  serviceDate: Date;
  cost?: number | null;
  notes?: string | null;
}

export interface UpdateRecordData {
  serviceName?: string;
  garageName?: string | null;
  serviceDate?: Date;
  cost?: number | null;
  notes?: string | null;
  vehicleId?: string | null;
}

export interface VehicleHealthSnapshot {
  vehicleId: string;
  health: VehicleHealthState;
  overallHealth: number;
}

export interface IMaintenanceRepository {
  createReminder(data: CreateReminderData): Promise<MaintenanceReminder>;
  findAllReminders(
    driverId: string,
    options?: { vehicleId?: string; includeCompleted?: boolean }
  ): Promise<MaintenanceReminderView[]>;
  findReminderById(driverId: string, id: string): Promise<MaintenanceReminder | null>;
  updateReminder(driverId: string, id: string, data: UpdateReminderData): Promise<MaintenanceReminder>;
  toggleReminderSet(driverId: string, id: string): Promise<MaintenanceReminder>;
  deleteReminder(driverId: string, id: string): Promise<void>;
  markReminderDone(driverId: string, id: string, now: Date): Promise<MaintenanceReminderView>;

  getVehicleHealth(driverId: string, vehicleId: string): Promise<VehicleHealthSnapshot>;

  // Records (history)
  createRecord(data: CreateRecordData): Promise<MaintenanceRecord>;
  findAllRecords(driverId: string): Promise<MaintenanceRecord[]>;
  findRecordById(driverId: string, id: string): Promise<MaintenanceRecord | null>;
  updateRecord(driverId: string, id: string, data: UpdateRecordData): Promise<MaintenanceRecord>;
  deleteRecord(driverId: string, id: string): Promise<void>;

  // Notifications
  listDriverNotifications(driverId: string): Promise<
    Array<{
      id: string;
      title: string;
      body: string;
      read: boolean;
      createdAt: Date;
      vehicleId: string | null;
      reminderId: string | null;
      vehiclePlate: string | null;
    }>
  >;
  markDriverNotificationRead(driverId: string, notificationId: string): Promise<void>;
  dispatchDueReminderNotifications(now: Date): Promise<number>;
}

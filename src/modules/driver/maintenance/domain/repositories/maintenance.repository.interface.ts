import { MaintenanceReminder } from '../entities/maintenance-reminder.entity';
import { MaintenanceRecord } from '../entities/maintenance-record.entity';

export interface CreateReminderData {
  driverId: string;
  vehicleId?: string | null;
  serviceName: string;
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

export interface IMaintenanceRepository {
  // Reminders
  createReminder(data: CreateReminderData): Promise<MaintenanceReminder>;
  findAllReminders(driverId: string): Promise<MaintenanceReminder[]>;
  findReminderById(driverId: string, id: string): Promise<MaintenanceReminder | null>;
  updateReminder(driverId: string, id: string, data: UpdateReminderData): Promise<MaintenanceReminder>;
  toggleReminderSet(driverId: string, id: string): Promise<MaintenanceReminder>;
  deleteReminder(driverId: string, id: string): Promise<void>;

  // Records (history)
  createRecord(data: CreateRecordData): Promise<MaintenanceRecord>;
  findAllRecords(driverId: string): Promise<MaintenanceRecord[]>;
  findRecordById(driverId: string, id: string): Promise<MaintenanceRecord | null>;
  updateRecord(driverId: string, id: string, data: UpdateRecordData): Promise<MaintenanceRecord>;
  deleteRecord(driverId: string, id: string): Promise<void>;

  // Notifications
  listDriverNotifications(driverId: string): Promise<Array<{
    id: string;
    title: string;
    body: string;
    read: boolean;
    createdAt: Date;
  }>>;
  markDriverNotificationRead(driverId: string, notificationId: string): Promise<void>;
  dispatchDueReminderNotifications(now: Date): Promise<number>;
}

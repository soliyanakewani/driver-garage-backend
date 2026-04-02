import { prisma } from '../../../../../infrastructure/prisma/prisma.client';
import {
  IMaintenanceRepository,
  CreateReminderData,
  UpdateReminderData,
  CreateRecordData,
  UpdateRecordData,
} from '../../domain/repositories/maintenance.repository.interface';
import { MaintenanceReminder } from '../../domain/entities/maintenance-reminder.entity';
import { MaintenanceRecord } from '../../domain/entities/maintenance-record.entity';

function toReminder(raw: any): MaintenanceReminder {
  return {
    id: raw.id,
    driverId: raw.driverId,
    vehicleId: raw.vehicleId,
    serviceName: raw.serviceName,
    scheduledDate: raw.scheduledDate,
    estimatedCostMin: raw.estimatedCostMin,
    estimatedCostMax: raw.estimatedCostMax,
    reminderSet: raw.reminderSet,
    notes: raw.notes,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function toRecord(raw: any): MaintenanceRecord {
  return {
    id: raw.id,
    driverId: raw.driverId,
    vehicleId: raw.vehicleId,
    serviceName: raw.serviceName,
    garageName: raw.garageName,
    serviceDate: raw.serviceDate,
    cost: raw.cost,
    notes: raw.notes,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export class MaintenanceRepository implements IMaintenanceRepository {
  // ── Reminders ────────────────────────────────────────────────────────────

  async createReminder(data: CreateReminderData): Promise<MaintenanceReminder> {
    if (data.vehicleId) {
      const vehicle = await prisma.vehicle.findFirst({
        where: { id: data.vehicleId, driverId: data.driverId },
        select: { id: true },
      });
      if (!vehicle) throw new Error('Vehicle not found or does not belong to you');
    }

    const raw = await prisma.maintenanceReminder.create({
      data: {
        driverId: data.driverId,
        vehicleId: data.vehicleId ?? null,
        serviceName: data.serviceName,
        scheduledDate: data.scheduledDate,
        estimatedCostMin: data.estimatedCostMin ?? null,
        estimatedCostMax: data.estimatedCostMax ?? null,
        notes: data.notes ?? null,
      },
    });
    return toReminder(raw);
  }

  async findAllReminders(driverId: string): Promise<MaintenanceReminder[]> {
    const list = await prisma.maintenanceReminder.findMany({
      where: { driverId },
      orderBy: { scheduledDate: 'asc' },
    });
    return list.map(toReminder);
  }

  async findReminderById(driverId: string, id: string): Promise<MaintenanceReminder | null> {
    const raw = await prisma.maintenanceReminder.findFirst({ where: { id, driverId } });
    return raw ? toReminder(raw) : null;
  }

  async updateReminder(driverId: string, id: string, data: UpdateReminderData): Promise<MaintenanceReminder> {
    const existing = await prisma.maintenanceReminder.findFirst({ where: { id, driverId } });
    if (!existing) throw new Error('Maintenance reminder not found');
    if (data.vehicleId) {
      const vehicle = await prisma.vehicle.findFirst({
        where: { id: data.vehicleId, driverId },
        select: { id: true },
      });
      if (!vehicle) throw new Error('Vehicle not found or does not belong to you');
    }

    const raw = await prisma.maintenanceReminder.update({
      where: { id },
      data: {
        ...(data.serviceName !== undefined && { serviceName: data.serviceName }),
        ...(data.scheduledDate !== undefined && { scheduledDate: data.scheduledDate, notifiedAt: null }),
        ...(data.estimatedCostMin !== undefined && { estimatedCostMin: data.estimatedCostMin }),
        ...(data.estimatedCostMax !== undefined && { estimatedCostMax: data.estimatedCostMax }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.vehicleId !== undefined && { vehicleId: data.vehicleId }),
      },
    });
    return toReminder(raw);
  }

  async toggleReminderSet(driverId: string, id: string): Promise<MaintenanceReminder> {
    const existing = await prisma.maintenanceReminder.findFirst({ where: { id, driverId } });
    if (!existing) throw new Error('Maintenance reminder not found');
    const raw = await prisma.maintenanceReminder.update({
      where: { id },
      data: {
        reminderSet: !existing.reminderSet,
        ...(!existing.reminderSet && { notifiedAt: null }),
      },
    });
    return toReminder(raw);
  }

  async deleteReminder(driverId: string, id: string): Promise<void> {
    const existing = await prisma.maintenanceReminder.findFirst({ where: { id, driverId } });
    if (!existing) throw new Error('Maintenance reminder not found');
    await prisma.maintenanceReminder.delete({ where: { id } });
  }

  // ── Records (history) ────────────────────────────────────────────────────

  async createRecord(data: CreateRecordData): Promise<MaintenanceRecord> {
    if (data.vehicleId) {
      const vehicle = await prisma.vehicle.findFirst({
        where: { id: data.vehicleId, driverId: data.driverId },
        select: { id: true },
      });
      if (!vehicle) throw new Error('Vehicle not found or does not belong to you');
    }

    const raw = await prisma.maintenanceRecord.create({
      data: {
        driverId: data.driverId,
        vehicleId: data.vehicleId ?? null,
        serviceName: data.serviceName,
        garageName: data.garageName ?? null,
        serviceDate: data.serviceDate,
        cost: data.cost ?? null,
        notes: data.notes ?? null,
      },
    });
    return toRecord(raw);
  }

  async findAllRecords(driverId: string): Promise<MaintenanceRecord[]> {
    const list = await prisma.maintenanceRecord.findMany({
      where: { driverId },
      orderBy: { serviceDate: 'desc' },
    });
    return list.map(toRecord);
  }

  async findRecordById(driverId: string, id: string): Promise<MaintenanceRecord | null> {
    const raw = await prisma.maintenanceRecord.findFirst({ where: { id, driverId } });
    return raw ? toRecord(raw) : null;
  }

  async updateRecord(driverId: string, id: string, data: UpdateRecordData): Promise<MaintenanceRecord> {
    const existing = await prisma.maintenanceRecord.findFirst({ where: { id, driverId } });
    if (!existing) throw new Error('Maintenance record not found');
    if (data.vehicleId) {
      const vehicle = await prisma.vehicle.findFirst({
        where: { id: data.vehicleId, driverId },
        select: { id: true },
      });
      if (!vehicle) throw new Error('Vehicle not found or does not belong to you');
    }
    const raw = await prisma.maintenanceRecord.update({
      where: { id },
      data: {
        ...(data.serviceName !== undefined && { serviceName: data.serviceName }),
        ...(data.garageName !== undefined && { garageName: data.garageName }),
        ...(data.serviceDate !== undefined && { serviceDate: data.serviceDate }),
        ...(data.cost !== undefined && { cost: data.cost }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.vehicleId !== undefined && { vehicleId: data.vehicleId }),
      },
    });
    return toRecord(raw);
  }

  async deleteRecord(driverId: string, id: string): Promise<void> {
    const existing = await prisma.maintenanceRecord.findFirst({ where: { id, driverId } });
    if (!existing) throw new Error('Maintenance record not found');
    await prisma.maintenanceRecord.delete({ where: { id } });
  }

  async listDriverNotifications(driverId: string): Promise<Array<{
    id: string;
    title: string;
    body: string;
    read: boolean;
    createdAt: Date;
  }>> {
    const notifications = await prisma.driverNotification.findMany({
      where: { driverId },
      orderBy: { createdAt: 'desc' },
    });

    return notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      body: notification.body,
      read: notification.read,
      createdAt: notification.createdAt,
    }));
  }

  async markDriverNotificationRead(driverId: string, notificationId: string): Promise<void> {
    const existing = await prisma.driverNotification.findFirst({
      where: { id: notificationId, driverId },
      select: { id: true },
    });
    if (!existing) throw new Error('Notification not found');

    await prisma.driverNotification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  async dispatchDueReminderNotifications(now: Date): Promise<number> {
    const reminders = await prisma.maintenanceReminder.findMany({
      where: {
        reminderSet: true,
        notifiedAt: null,
        scheduledDate: { lte: now },
      },
      select: {
        id: true,
        driverId: true,
        serviceName: true,
        scheduledDate: true,
      },
    });

    if (!reminders.length) {
      return 0;
    }

    await prisma.$transaction(
      reminders.map((reminder) =>
        prisma.maintenanceReminder.update({
          where: { id: reminder.id },
          data: {
            notifiedAt: now,
            driver: {
              update: {
                notifications: {
                  create: {
                    title: 'Maintenance reminder',
                    body: `Your scheduled maintenance "${reminder.serviceName}" is due now.`,
                  },
                },
              },
            },
          },
        })
      )
    );

    return reminders.length;
  }
}

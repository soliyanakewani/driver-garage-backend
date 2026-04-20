import type { Prisma } from '@prisma/client';
import { prisma } from '../../../../../infrastructure/prisma/prisma.client';
import {
  IMaintenanceRepository,
  CreateReminderData,
  UpdateReminderData,
  CreateRecordData,
  UpdateRecordData,
  VehicleHealthSnapshot,
} from '../../domain/repositories/maintenance.repository.interface';
import { MaintenanceReminder, MaintenanceReminderView } from '../../domain/entities/maintenance-reminder.entity';
import { MaintenanceRecord } from '../../domain/entities/maintenance-record.entity';
import { getCatalogItem } from '../../domain/maintenance-catalog';
import type { FixedHealthKey, VehicleHealthState } from '../../domain/maintenance-health.types';
import {
  applyReductionForCustom,
  applyReductionForFixed,
  computeOverallHealth,
  computeReminderDisplayStatus,
  defaultVehicleHealth,
  parseVehicleHealth,
  restoreCustomSlot,
  restoreFixed,
  serializeVehicleHealth,
} from '../../domain/maintenance-health.helpers';
import { MAINTENANCE_HEALTH_REDUCTION_PERCENT } from '../../domain/maintenance.constants';

/** Delegates `vehicleMaintenanceHealth` / `driverNotification` exist after `prisma generate`; widen for IDEs lagging behind. */
const prismaX = prisma as typeof prisma & {
  vehicleMaintenanceHealth: {
    findUnique(args: { where: { vehicleId: string } }): Promise<{ health: Prisma.JsonValue; vehicleId: string } | null>;
    create(args: { data: { vehicleId: string; health: object } }): Promise<{ health: Prisma.JsonValue; vehicleId: string }>;
    upsert(args: unknown): Promise<unknown>;
    update(args: unknown): Promise<unknown>;
  };
  driverNotification: {
    findMany(args: unknown): Promise<
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
    findFirst(args: unknown): Promise<{ id: string } | null>;
    update(args: unknown): Promise<unknown>;
    create(args: unknown): Promise<unknown>;
  };
};

type PrismaTransactionLike = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];
const txHealth = (tx: PrismaTransactionLike) => (tx as typeof prismaX).vehicleMaintenanceHealth;
const txNotify = (tx: PrismaTransactionLike) => (tx as typeof prismaX).driverNotification;

const FIXED: FixedHealthKey[] = [
  'ENGINE',
  'BRAKES',
  'TIRES',
  'BATTERY',
  'COOLANT',
  'TRANSMISSION',
  'AIR_FILTER',
  'WIPERS_LIGHTS',
];

function isFixedKey(s: string): s is FixedHealthKey {
  return (FIXED as string[]).includes(s);
}

function toReminder(raw: any): MaintenanceReminder {
  return {
    id: raw.id,
    driverId: raw.driverId,
    vehicleId: raw.vehicleId,
    serviceName: raw.serviceName,
    presetCategory: raw.presetCategory ?? null,
    customServiceName: raw.customServiceName ?? null,
    scheduledDate: raw.scheduledDate,
    estimatedCostMin: raw.estimatedCostMin,
    estimatedCostMax: raw.estimatedCostMax,
    reminderSet: raw.reminderSet,
    notifiedAt: raw.notifiedAt,
    notes: raw.notes,
    completedAt: raw.completedAt ?? null,
    healthComponentKey: raw.healthComponentKey ?? null,
    healthValueBefore: raw.healthValueBefore ?? null,
    healthReductionApplied: raw.healthReductionApplied ?? null,
    customSlotId: raw.customSlotId ?? null,
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

async function ensureHealthRow(vehicleId: string): Promise<VehicleHealthSnapshot> {
  let row = await prismaX.vehicleMaintenanceHealth.findUnique({ where: { vehicleId } });
  if (!row) {
    row = await prismaX.vehicleMaintenanceHealth.create({
      data: {
        vehicleId,
        health: serializeVehicleHealth(defaultVehicleHealth()) as object,
      },
    });
  }
  const health = parseVehicleHealth(row.health);
  return { vehicleId, health, overallHealth: computeOverallHealth(health) };
}

function restoreStateFromReminder(state: VehicleHealthState, reminder: MaintenanceReminder): VehicleHealthState {
  if (
    reminder.healthValueBefore == null ||
    reminder.healthReductionApplied == null ||
    !reminder.healthComponentKey
  ) {
    return state;
  }
  if (reminder.healthComponentKey === 'CUSTOM' && reminder.customSlotId) {
    return restoreCustomSlot(state, reminder.customSlotId, reminder.healthValueBefore);
  }
  if (isFixedKey(reminder.healthComponentKey)) {
    return restoreFixed(state, reminder.healthComponentKey, reminder.healthValueBefore);
  }
  return state;
}

export class MaintenanceRepository implements IMaintenanceRepository {
  async getVehicleHealth(driverId: string, vehicleId: string): Promise<VehicleHealthSnapshot> {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, driverId },
      select: { id: true },
    });
    if (!vehicle) throw new Error('Vehicle not found or does not belong to you');
    return ensureHealthRow(vehicleId);
  }

  async createReminder(data: CreateReminderData): Promise<MaintenanceReminder> {
    if (!data.vehicleId?.trim()) throw new Error('vehicleId is required — select which vehicle this maintenance is for');

    const vehicle = await prisma.vehicle.findFirst({
      where: { id: data.vehicleId, driverId: data.driverId },
      select: { id: true, plateNumber: true },
    });
    if (!vehicle) throw new Error('Vehicle not found or does not belong to you');

    const catalogItem = getCatalogItem(data.presetCategory);
    if (!catalogItem) throw new Error('Invalid presetCategory — use GET /driver/maintenance/catalog');

    const isOther = catalogItem.id === 'OTHER';
    const customName = data.customServiceName?.trim() ?? '';
    if (isOther && !customName) throw new Error('customServiceName is required when presetCategory is OTHER');

    const serviceName = isOther ? customName : catalogItem.label;

    const snapshot = await ensureHealthRow(data.vehicleId);
    let health = snapshot.health;

    let healthComponentKey: string;
    let healthValueBefore: number;
    let healthReductionApplied: number;
    let customSlotId: string | null = null;

    if (catalogItem.healthComponent === 'CUSTOM') {
      const applied = applyReductionForCustom(health, customName, MAINTENANCE_HEALTH_REDUCTION_PERCENT);
      health = applied.state;
      healthComponentKey = 'CUSTOM';
      healthValueBefore = applied.valueBefore;
      healthReductionApplied = applied.reductionApplied;
      customSlotId = applied.slotId;
    } else {
      const applied = applyReductionForFixed(
        health,
        catalogItem.healthComponent as FixedHealthKey,
        MAINTENANCE_HEALTH_REDUCTION_PERCENT
      );
      health = applied.state;
      healthComponentKey = applied.key;
      healthValueBefore = applied.valueBefore;
      healthReductionApplied = applied.reductionApplied;
    }

    const raw = await prisma.$transaction(async (tx) => {
      await txHealth(tx).upsert({
        where: { vehicleId: data.vehicleId },
        create: {
          vehicleId: data.vehicleId,
          health: serializeVehicleHealth(health) as object,
        },
        update: { health: serializeVehicleHealth(health) as object },
      });

      const createData: Prisma.MaintenanceReminderUncheckedCreateInput = {
        driverId: data.driverId,
        vehicleId: data.vehicleId,
        serviceName,
        presetCategory: data.presetCategory as Prisma.MaintenanceReminderUncheckedCreateInput['presetCategory'],
        customServiceName: isOther ? customName : null,
        scheduledDate: data.scheduledDate,
        estimatedCostMin: data.estimatedCostMin ?? null,
        estimatedCostMax: data.estimatedCostMax ?? null,
        notes: data.notes ?? null,
        healthComponentKey,
        healthValueBefore,
        healthReductionApplied,
        customSlotId,
      };
      return tx.maintenanceReminder.create({ data: createData });
    });

    return toReminder(raw);
  }

  async findAllReminders(
    driverId: string,
    options?: { vehicleId?: string; includeCompleted?: boolean }
  ): Promise<MaintenanceReminderView[]> {
    const includeCompleted = options?.includeCompleted ?? false;
    const where: {
      driverId: string;
      vehicleId?: string;
      completedAt?: null | { not: null };
    } = { driverId };
    if (options?.vehicleId) where.vehicleId = options.vehicleId;
    if (!includeCompleted) where.completedAt = null;

    const list = await prisma.maintenanceReminder.findMany({
      where,
      orderBy: { scheduledDate: 'asc' },
      include: {
        vehicle: { select: { plateNumber: true, make: true, model: true, year: true } },
      },
    });

    const now = new Date();
    return list.map((row) => {
      const base = toReminder(row);
      const { status, daysUntilDue, overdueDays } = computeReminderDisplayStatus(
        base.scheduledDate,
        base.completedAt,
        now
      );
      const v = row.vehicle;
      const vehicleLabel = v ? `${v.make} ${v.model} ${v.year}` : null;
      return {
        ...base,
        displayStatus: status,
        daysUntilDue,
        overdueDays,
        vehiclePlate: v?.plateNumber ?? null,
        vehicleLabel,
      };
    });
  }

  async findReminderById(driverId: string, id: string): Promise<MaintenanceReminder | null> {
    const raw = await prisma.maintenanceReminder.findFirst({ where: { id, driverId } });
    return raw ? toReminder(raw) : null;
  }

  async updateReminder(driverId: string, id: string, data: UpdateReminderData): Promise<MaintenanceReminder> {
    const existing = await prisma.maintenanceReminder.findFirst({ where: { id, driverId } });
    if (!existing) throw new Error('Maintenance reminder not found');
    if (toReminder(existing).completedAt) throw new Error('Cannot update a completed reminder');

    if (data.vehicleId !== undefined) {
      if (data.vehicleId !== existing.vehicleId) {
        throw new Error('Cannot change vehicle — delete this reminder and create a new one');
      }
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

    const reminder = toReminder(existing);

    await prisma.$transaction(async (tx) => {
      if (
        existing.vehicleId &&
        !reminder.completedAt &&
        reminder.healthComponentKey &&
        reminder.healthValueBefore != null
      ) {
        const row = await txHealth(tx).findUnique({
          where: { vehicleId: existing.vehicleId },
        });
        if (row) {
          let state = parseVehicleHealth(row.health);
          state = restoreStateFromReminder(state, reminder);
          await txHealth(tx).update({
            where: { vehicleId: existing.vehicleId },
            data: { health: serializeVehicleHealth(state) as object },
          });
        }
      }
      await tx.maintenanceReminder.delete({ where: { id } });
    });
  }

  async markReminderDone(driverId: string, id: string, now: Date): Promise<MaintenanceReminderView> {
    const existing = await prisma.maintenanceReminder.findFirst({
      where: { id, driverId },
      include: { vehicle: { select: { plateNumber: true, make: true, model: true, year: true } } },
    });
    if (!existing) throw new Error('Maintenance reminder not found');

    const reminder = toReminder(existing);
    if (reminder.completedAt) throw new Error('Reminder is already marked as done');
    if (now.getTime() < reminder.scheduledDate.getTime()) {
      throw new Error('You can only mark as done after the scheduled date and time has passed');
    }

    const vehicleIdForHealth = existing.vehicleId;

    await prisma.$transaction(async (tx) => {
      if (
        vehicleIdForHealth &&
        reminder.healthComponentKey &&
        reminder.healthValueBefore != null
      ) {
        const row = await txHealth(tx).findUnique({
          where: { vehicleId: vehicleIdForHealth },
        });
        if (row) {
          let state = parseVehicleHealth(row.health);
          state = restoreStateFromReminder(state, reminder);
          await txHealth(tx).update({
            where: { vehicleId: vehicleIdForHealth },
            data: { health: serializeVehicleHealth(state) as object },
          });
        }
      }

      const donePatch: Prisma.MaintenanceReminderUpdateInput = { completedAt: now };
      await tx.maintenanceReminder.update({
        where: { id },
        data: donePatch,
      });
    });

    const updated = await prisma.maintenanceReminder.findFirst({
      where: { id, driverId },
      include: { vehicle: { select: { plateNumber: true, make: true, model: true, year: true } } },
    });
    const base = toReminder(updated!);
    const { status, daysUntilDue, overdueDays } = computeReminderDisplayStatus(base.scheduledDate, base.completedAt, now);
    const v = updated!.vehicle;
    return {
      ...base,
      displayStatus: status,
      daysUntilDue,
      overdueDays,
      vehiclePlate: v?.plateNumber ?? null,
      vehicleLabel: v ? `${v.make} ${v.model} ${v.year}` : null,
    };
  }

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

  async listDriverNotifications(driverId: string): Promise<
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
  > {
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
      vehicleId: notification.vehicleId,
      reminderId: notification.reminderId,
      vehiclePlate: notification.vehiclePlate,
    }));
  }

  async markDriverNotificationRead(driverId: string, notificationId: string): Promise<void> {
    const existing = await prismaX.driverNotification.findFirst({
      where: { id: notificationId, driverId },
      select: { id: true },
    });
    if (!existing) throw new Error('Notification not found');

    await prismaX.driverNotification.update({
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
        completedAt: null,
      },
      include: {
        vehicle: { select: { plateNumber: true } },
      },
    });

    if (!reminders.length) {
      return 0;
    }

    await prisma.$transaction(async (tx) => {
      for (const reminder of reminders) {
        const plate = reminder.vehicle?.plateNumber;
        const platePart = plate ? ` (${plate})` : '';
        await txNotify(tx).create({
          data: {
            driverId: reminder.driverId,
            title: 'Maintenance reminder',
            body: `Your scheduled maintenance "${reminder.serviceName}"${platePart} is due now.`,
            vehicleId: reminder.vehicleId,
            reminderId: reminder.id,
            vehiclePlate: plate ?? null,
          },
        });
        const notifyPatch: Prisma.MaintenanceReminderUpdateInput = { notifiedAt: now };
        await tx.maintenanceReminder.update({
          where: { id: reminder.id },
          data: notifyPatch,
        });
      }
    });

    return reminders.length;
  }
}

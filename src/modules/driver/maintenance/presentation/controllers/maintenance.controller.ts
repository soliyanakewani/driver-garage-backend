import { Request, Response } from 'express';
import { MaintenanceRepository } from '../../infrastructure/repositories/maintenance.repository';
import { CreateReminderUseCase } from '../../application/usecases/create-reminder.usecase';
import { ListRemindersUseCase } from '../../application/usecases/list-reminders.usecase';
import { UpdateReminderUseCase } from '../../application/usecases/update-reminder.usecase';
import { ToggleReminderUseCase } from '../../application/usecases/toggle-reminder.usecase';
import { DeleteReminderUseCase } from '../../application/usecases/delete-reminder.usecase';
import { MarkReminderDoneUseCase } from '../../application/usecases/mark-reminder-done.usecase';
import { CreateRecordUseCase } from '../../application/usecases/create-record.usecase';
import { ListRecordsUseCase } from '../../application/usecases/list-records.usecase';
import { UpdateRecordUseCase } from '../../application/usecases/update-record.usecase';
import { DeleteRecordUseCase } from '../../application/usecases/delete-record.usecase';
import { JwtPayload } from '../../../../../core/middleware/auth/jwt.middleware';
import { MAINTENANCE_CATALOG } from '../../domain/maintenance-catalog';
import {
  MAINTENANCE_HEALTH_REDUCTION_PERCENT,
  MAINTENANCE_SOON_DAYS,
} from '../../domain/maintenance.constants';

const repository = new MaintenanceRepository();

const createReminderUseCase = new CreateReminderUseCase(repository);
const listRemindersUseCase = new ListRemindersUseCase(repository);
const updateReminderUseCase = new UpdateReminderUseCase(repository);
const toggleReminderUseCase = new ToggleReminderUseCase(repository);
const deleteReminderUseCase = new DeleteReminderUseCase(repository);
const markReminderDoneUseCase = new MarkReminderDoneUseCase(repository);

const createRecordUseCase = new CreateRecordUseCase(repository);
const listRecordsUseCase = new ListRecordsUseCase(repository);
const updateRecordUseCase = new UpdateRecordUseCase(repository);
const deleteRecordUseCase = new DeleteRecordUseCase(repository);

function driverId(req: Request): string {
  return (req as Request & { user: JwtPayload }).user.id;
}

function paramId(req: Request): string {
  const value = req.params.id;
  return Array.isArray(value) ? value[0] ?? '' : (value ?? '');
}

/** Preset list + tuning constants for Flutter */
export const getMaintenanceCatalog = async (_req: Request, res: Response) => {
  res.json({
    presets: MAINTENANCE_CATALOG,
    rules: {
      soonDays: MAINTENANCE_SOON_DAYS,
      healthReductionPercent: MAINTENANCE_HEALTH_REDUCTION_PERCENT,
      displayStatusHelp:
        'DONE = completed; URGENT = past due; SOON = due within soonDays; GOOD = later. Only applies when completedAt is null.',
    },
  });
};

export const getVehicleHealth = async (req: Request, res: Response) => {
  try {
    const vehicleId = String(req.params.vehicleId ?? '').trim();
    if (!vehicleId) {
      res.status(400).json({ error: 'vehicleId is required' });
      return;
    }
    const snapshot = await repository.getVehicleHealth(driverId(req), vehicleId);
    res.json({
      vehicleId: snapshot.vehicleId,
      health: snapshot.health,
      overallHealth: snapshot.overallHealth,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load vehicle health';
    const status = message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: message });
  }
};

// ── Upcoming Reminders ────────────────────────────────────────────────────────

export const createReminder = async (req: Request, res: Response) => {
  try {
    const reminder = await createReminderUseCase.execute(driverId(req), req.body);
    res.status(201).json(reminder);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create reminder';
    res.status(400).json({ error: message });
  }
};

export const listReminders = async (req: Request, res: Response) => {
  try {
    const vehicleIdRaw = req.query.vehicleId;
    const includeRaw = req.query.includeCompleted;
    const vehicleId =
      typeof vehicleIdRaw === 'string' && vehicleIdRaw.trim() ? vehicleIdRaw.trim() : undefined;
    const includeCompleted =
      typeof includeRaw === 'string' && includeRaw.toLowerCase() === 'true';

    const reminders = await listRemindersUseCase.execute(driverId(req), {
      vehicleId,
      includeCompleted,
    });
    res.json(reminders);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch reminders';
    res.status(500).json({ error: message });
  }
};

export const updateReminder = async (req: Request, res: Response) => {
  try {
    const reminder = await updateReminderUseCase.execute(driverId(req), paramId(req), req.body);
    res.json(reminder);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update reminder';
    const status = message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: message });
  }
};

export const toggleReminder = async (req: Request, res: Response) => {
  try {
    const reminder = await toggleReminderUseCase.execute(driverId(req), paramId(req));
    res.json(reminder);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to toggle reminder';
    const status = message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: message });
  }
};

export const deleteReminder = async (req: Request, res: Response) => {
  try {
    await deleteReminderUseCase.execute(driverId(req), paramId(req));
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete reminder';
    const status = message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: message });
  }
};

export const markReminderDone = async (req: Request, res: Response) => {
  try {
    const view = await markReminderDoneUseCase.execute(driverId(req), paramId(req));
    res.json(view);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to mark reminder as done';
    let status = 400;
    if (message.includes('not found')) status = 404;
    res.status(status).json({ error: message });
  }
};

// ── Maintenance History Records ───────────────────────────────────────────────

export const createRecord = async (req: Request, res: Response) => {
  try {
    const record = await createRecordUseCase.execute(driverId(req), req.body);
    res.status(201).json(record);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create maintenance record';
    res.status(400).json({ error: message });
  }
};

export const listRecords = async (req: Request, res: Response) => {
  try {
    const records = await listRecordsUseCase.execute(driverId(req));
    res.json(records);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch maintenance history';
    res.status(500).json({ error: message });
  }
};

export const updateRecord = async (req: Request, res: Response) => {
  try {
    const record = await updateRecordUseCase.execute(driverId(req), paramId(req), req.body);
    res.json(record);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update maintenance record';
    const status = message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: message });
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  try {
    await deleteRecordUseCase.execute(driverId(req), paramId(req));
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete maintenance record';
    const status = message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: message });
  }
};

export const listNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await repository.listDriverNotifications(driverId(req));
    res.json(notifications);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch notifications';
    res.status(500).json({ error: message });
  }
};

export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    await repository.markDriverNotificationRead(driverId(req), paramId(req));
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to mark notification as read';
    const status = message.includes('not found') ? 404 : 400;
    res.status(status).json({ error: message });
  }
};

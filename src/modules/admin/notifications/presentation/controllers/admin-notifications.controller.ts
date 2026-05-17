import { Request, Response } from 'express';
import { PrismaAdminNotificationRepository } from '../../infrastructure/repositories/prisma-admin-notification.repository';
import { ListAdminNotificationsUseCase } from '../../application/usecases/list-notifications.usecase';
import { MarkAdminNotificationReadUseCase } from '../../application/usecases/mark-notification-read.usecase';
import { MarkAllAdminNotificationsReadUseCase } from '../../application/usecases/mark-all-notifications-read.usecase';
import { BroadcastNotificationsUseCase } from '../../application/usecases/broadcast-notifications.usecase';
import type { BroadcastTarget } from '../../domain/repositories/admin-notification.repository.interface';

const repository = new PrismaAdminNotificationRepository();
const listUseCase = new ListAdminNotificationsUseCase(repository);
const markReadUseCase = new MarkAdminNotificationReadUseCase(repository);
const markAllUseCase = new MarkAllAdminNotificationsReadUseCase(repository);
const broadcastUseCase = new BroadcastNotificationsUseCase(repository);

function normalizeTarget(value: unknown): BroadcastTarget {
  const target = String(value ?? '').trim().toUpperCase();
  if (target === 'DRIVERS' || target === 'GARAGES' || target === 'ALL') return target;
  throw new Error('target must be one of: DRIVERS, GARAGES, ALL');
}

export const listAdminNotifications = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).admin?.id as string | undefined;
    if (!adminId) return res.status(401).json({ error: 'Unauthorized' });

    const notifications = await listUseCase.execute(adminId);
    res.json(notifications);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

export const markAdminNotificationRead = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).admin?.id as string | undefined;
    if (!adminId) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const notification = await markReadUseCase.execute(adminId, String(id));
    res.json(notification);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(message === 'Notification not found' ? 404 : 400).json({ error: message });
  }
};

export const markAllAdminNotificationsRead = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).admin?.id as string | undefined;
    if (!adminId) return res.status(401).json({ error: 'Unauthorized' });

    const result = await markAllUseCase.execute(adminId);
    res.json({
      message: `${result.count} notification(s) marked as read`,
      count: result.count,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

export const broadcastAdminNotifications = async (req: Request, res: Response) => {
  try {
    const title = String(req.body.title ?? '');
    const body = String(req.body.body ?? '');
    const target = normalizeTarget(req.body.target);

    const sent = await broadcastUseCase.execute(title, body, target);

    res.status(201).json({
      message: 'Broadcast sent',
      target,
      title: title.trim(),
      sent,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

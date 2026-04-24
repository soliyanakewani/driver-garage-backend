import { Request, Response } from 'express';
import { PrismaDriverNotificationRepository } from '../../infrastructure/repositories/prisma-driver-notification.repository';
import { ListDriverNotificationsUseCase } from '../../application/usecases/list-notifications.usecase';
import { MarkDriverNotificationReadUseCase } from '../../application/usecases/mark-notification-read.usecase';
import { MarkAllDriverNotificationsReadUseCase } from '../../application/usecases/mark-all-notifications-read.usecase';

const repository = new PrismaDriverNotificationRepository();
const listUseCase = new ListDriverNotificationsUseCase(repository);
const markReadUseCase = new MarkDriverNotificationReadUseCase(repository);
const markAllUseCase = new MarkAllDriverNotificationsReadUseCase(repository);

export const listDriverNotifications = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user?.id as string;
    if (!driverId) return res.status(401).json({ error: 'Unauthorized' });
    const notifications = await listUseCase.execute(driverId);
    res.json(notifications);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

export const markDriverNotificationRead = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user?.id as string;
    if (!driverId) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params as any;
    const notification = await markReadUseCase.execute(driverId, String(id));
    res.json(notification);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(message === 'Notification not found' ? 404 : 400).json({ error: message });
  }
};

export const markAllDriverNotificationsRead = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user?.id as string;
    if (!driverId) return res.status(401).json({ error: 'Unauthorized' });
    const result = await markAllUseCase.execute(driverId);
    res.json({ message: `${result.count} notification(s) marked as read`, count: result.count });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

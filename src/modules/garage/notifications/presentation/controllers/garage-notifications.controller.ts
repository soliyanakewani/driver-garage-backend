import { Request, Response } from 'express';
import { PrismaGarageNotificationRepository } from '../../infrastructure/repositories/prisma-garage-notification.repository';
import { ListNotificationsUseCase } from '../../application/usecases/list-notifications.usecase';
import { MarkNotificationReadUseCase } from '../../application/usecases/mark-notification-read.usecase';
import { MarkAllNotificationsReadUseCase } from '../../application/usecases/mark-all-notifications-read.usecase';

const repository = new PrismaGarageNotificationRepository();
const listUseCase = new ListNotificationsUseCase(repository);
const markReadUseCase = new MarkNotificationReadUseCase(repository);
const markAllReadUseCase = new MarkAllNotificationsReadUseCase(repository);

export const listNotifications = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user?.id as string;
    if (!garageId) return res.status(401).json({ error: 'Unauthorized' });
    const notifications = await listUseCase.execute(garageId);
    res.json(notifications);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

export const markNotificationRead = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user?.id as string;
    if (!garageId) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params as any;
    const notification = await markReadUseCase.execute(garageId, String(id));
    res.json(notification);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(message === 'Notification not found' ? 404 : 400).json({ error: message });
  }
};

export const markAllNotificationsRead = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user?.id as string;
    if (!garageId) return res.status(401).json({ error: 'Unauthorized' });
    const result = await markAllReadUseCase.execute(garageId);
    res.json({ message: `${result.count} notification(s) marked as read`, count: result.count });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

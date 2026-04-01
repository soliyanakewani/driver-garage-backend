import { prisma } from '../../../../../infrastructure/prisma/prisma.client';
import type { IGarageNotificationRepository } from '../../domain/repositories/garage-notification.repository.interface';

export class PrismaGarageNotificationRepository implements IGarageNotificationRepository {
  async listByGarageId(garageId: string): Promise<unknown[]> {
    return prisma.garageNotification.findMany({
      where: { garageId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(garageId: string, notificationId: string): Promise<unknown> {
    const notification = await prisma.garageNotification.findFirst({
      where: { id: notificationId, garageId },
    });
    if (!notification) throw new Error('Notification not found');

    return prisma.garageNotification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  async markAllAsRead(garageId: string): Promise<{ count: number }> {
    const result = await prisma.garageNotification.updateMany({
      where: { garageId, read: false },
      data: { read: true },
    });
    return { count: result.count };
  }
}

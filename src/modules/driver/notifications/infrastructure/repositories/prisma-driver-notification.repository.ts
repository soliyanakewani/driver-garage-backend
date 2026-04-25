import { prisma } from '../../../../../infrastructure/prisma/prisma.client';
import type { IDriverNotificationRepository } from '../../domain/repositories/driver-notification.repository.interface';

export class PrismaDriverNotificationRepository implements IDriverNotificationRepository {
  async listByDriverId(driverId: string): Promise<unknown[]> {
    return prisma.driverNotification.findMany({
      where: { driverId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(driverId: string, notificationId: string): Promise<unknown> {
    const notification = await prisma.driverNotification.findFirst({
      where: { id: notificationId, driverId },
    });
    if (!notification) throw new Error('Notification not found');

    return prisma.driverNotification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  async markAllAsRead(driverId: string): Promise<{ count: number }> {
    const result = await prisma.driverNotification.updateMany({
      where: { driverId, read: false },
      data: { read: true },
    });
    return { count: result.count };
  }
}

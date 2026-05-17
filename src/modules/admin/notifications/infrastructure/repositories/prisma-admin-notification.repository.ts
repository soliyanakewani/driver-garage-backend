import { prisma } from '../../../../../infrastructure/prisma/prisma.client';
import type {
  BroadcastTarget,
  IAdminNotificationRepository,
  IBroadcastNotificationRepository,
} from '../../domain/repositories/admin-notification.repository.interface';

export class PrismaAdminNotificationRepository
  implements IAdminNotificationRepository, IBroadcastNotificationRepository
{
  async listByAdminId(adminId: string): Promise<unknown[]> {
    return prisma.adminNotification.findMany({
      where: { adminId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(adminId: string, notificationId: string): Promise<unknown> {
    const notification = await prisma.adminNotification.findFirst({
      where: { id: notificationId, adminId },
    });
    if (!notification) throw new Error('Notification not found');

    return prisma.adminNotification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  async markAllAsRead(adminId: string): Promise<{ count: number }> {
    const result = await prisma.adminNotification.updateMany({
      where: { adminId, read: false },
      data: { read: true },
    });
    return { count: result.count };
  }

  async notifyAllAdmins(title: string, body: string): Promise<number> {
    const normalizedTitle = title.trim();
    const normalizedBody = body.trim();
    if (!normalizedTitle || !normalizedBody) return 0;

    const admins = await prisma.admin.findMany({ select: { id: true } });
    if (admins.length === 0) return 0;

    const created = await prisma.adminNotification.createMany({
      data: admins.map((admin) => ({
        adminId: admin.id,
        title: normalizedTitle,
        body: normalizedBody,
      })),
    });

    return created.count;
  }

  async broadcast(
    title: string,
    body: string,
    target: BroadcastTarget
  ): Promise<{ drivers: number; garages: number; total: number }> {
    let driversCount = 0;
    let garagesCount = 0;

    if (target === 'DRIVERS' || target === 'ALL') {
      const drivers = await prisma.driver.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true },
      });
      if (drivers.length > 0) {
        const result = await prisma.driverNotification.createMany({
          data: drivers.map((driver) => ({
            driverId: driver.id,
            title,
            body,
          })),
        });
        driversCount = result.count;
      }
    }

    if (target === 'GARAGES' || target === 'ALL') {
      const garages = await prisma.garage.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true },
      });
      if (garages.length > 0) {
        const result = await prisma.garageNotification.createMany({
          data: garages.map((garage) => ({
            garageId: garage.id,
            title,
            body,
          })),
        });
        garagesCount = result.count;
      }
    }

    return {
      drivers: driversCount,
      garages: garagesCount,
      total: driversCount + garagesCount,
    };
  }
}

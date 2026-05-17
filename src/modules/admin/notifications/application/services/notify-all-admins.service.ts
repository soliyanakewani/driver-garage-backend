import { PrismaAdminNotificationRepository } from '../../infrastructure/repositories/prisma-admin-notification.repository';

const repository = new PrismaAdminNotificationRepository();

export async function notifyAllAdmins(title: string, body: string): Promise<number> {
  return repository.notifyAllAdmins(title, body);
}

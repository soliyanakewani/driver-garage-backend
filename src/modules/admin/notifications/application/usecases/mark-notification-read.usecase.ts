import type { IAdminNotificationRepository } from '../../domain/repositories/admin-notification.repository.interface';

export class MarkAdminNotificationReadUseCase {
  constructor(private readonly repository: IAdminNotificationRepository) {}

  async execute(adminId: string, notificationId: string): Promise<unknown> {
    return this.repository.markAsRead(adminId, notificationId);
  }
}

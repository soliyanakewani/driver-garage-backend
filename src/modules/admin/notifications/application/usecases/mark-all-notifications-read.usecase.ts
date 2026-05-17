import type { IAdminNotificationRepository } from '../../domain/repositories/admin-notification.repository.interface';

export class MarkAllAdminNotificationsReadUseCase {
  constructor(private readonly repository: IAdminNotificationRepository) {}

  async execute(adminId: string): Promise<{ count: number }> {
    return this.repository.markAllAsRead(adminId);
  }
}

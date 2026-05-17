import type { IAdminNotificationRepository } from '../../domain/repositories/admin-notification.repository.interface';

export class ListAdminNotificationsUseCase {
  constructor(private readonly repository: IAdminNotificationRepository) {}

  async execute(adminId: string): Promise<unknown[]> {
    return this.repository.listByAdminId(adminId);
  }
}

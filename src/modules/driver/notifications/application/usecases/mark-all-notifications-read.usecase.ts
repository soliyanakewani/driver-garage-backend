import type { IDriverNotificationRepository } from '../../domain/repositories/driver-notification.repository.interface';

export class MarkAllDriverNotificationsReadUseCase {
  constructor(private readonly repository: IDriverNotificationRepository) {}

  async execute(driverId: string): Promise<{ count: number }> {
    return this.repository.markAllAsRead(driverId);
  }
}

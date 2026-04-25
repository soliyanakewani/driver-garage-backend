import type { IDriverNotificationRepository } from '../../domain/repositories/driver-notification.repository.interface';

export class MarkDriverNotificationReadUseCase {
  constructor(private readonly repository: IDriverNotificationRepository) {}

  async execute(driverId: string, notificationId: string): Promise<unknown> {
    return this.repository.markAsRead(driverId, notificationId);
  }
}

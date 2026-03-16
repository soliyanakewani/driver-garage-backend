import type { IGarageNotificationRepository } from '../../domain/repositories/garage-notification.repository.interface';

export class MarkAllNotificationsReadUseCase {
  constructor(private readonly repository: IGarageNotificationRepository) {}

  async execute(garageId: string): Promise<{ count: number }> {
    return this.repository.markAllAsRead(garageId);
  }
}

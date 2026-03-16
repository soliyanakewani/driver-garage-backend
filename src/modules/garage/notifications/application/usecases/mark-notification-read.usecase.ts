import type { IGarageNotificationRepository } from '../../domain/repositories/garage-notification.repository.interface';

export class MarkNotificationReadUseCase {
  constructor(private readonly repository: IGarageNotificationRepository) {}

  async execute(garageId: string, notificationId: string): Promise<unknown> {
    return this.repository.markAsRead(garageId, notificationId);
  }
}

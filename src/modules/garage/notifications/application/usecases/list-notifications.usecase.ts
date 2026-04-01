import type { IGarageNotificationRepository } from '../../domain/repositories/garage-notification.repository.interface';

export class ListNotificationsUseCase {
  constructor(private readonly repository: IGarageNotificationRepository) {}

  async execute(garageId: string): Promise<unknown[]> {
    return this.repository.listByGarageId(garageId);
  }
}

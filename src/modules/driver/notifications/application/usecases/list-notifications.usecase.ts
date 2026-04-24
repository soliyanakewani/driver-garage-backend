import type { IDriverNotificationRepository } from '../../domain/repositories/driver-notification.repository.interface';

export class ListDriverNotificationsUseCase {
  constructor(private readonly repository: IDriverNotificationRepository) {}

  async execute(driverId: string): Promise<unknown[]> {
    return this.repository.listByDriverId(driverId);
  }
}

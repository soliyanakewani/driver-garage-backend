import type {
  BroadcastTarget,
  IBroadcastNotificationRepository,
} from '../../domain/repositories/admin-notification.repository.interface';

export class BroadcastNotificationsUseCase {
  constructor(private readonly repository: IBroadcastNotificationRepository) {}

  async execute(
    title: string,
    body: string,
    target: BroadcastTarget
  ): Promise<{ drivers: number; garages: number; total: number }> {
    const normalizedTitle = title.trim();
    const normalizedBody = body.trim();
    if (!normalizedTitle || !normalizedBody) {
      throw new Error('title and body are required');
    }

    return this.repository.broadcast(normalizedTitle, normalizedBody, target);
  }
}

export interface IGarageNotificationRepository {
  listByGarageId(garageId: string): Promise<unknown[]>;
  markAsRead(garageId: string, notificationId: string): Promise<unknown>;
  markAllAsRead(garageId: string): Promise<{ count: number }>;
}

export interface IDriverNotificationRepository {
  listByDriverId(driverId: string): Promise<unknown[]>;
  markAsRead(driverId: string, notificationId: string): Promise<unknown>;
  markAllAsRead(driverId: string): Promise<{ count: number }>;
}

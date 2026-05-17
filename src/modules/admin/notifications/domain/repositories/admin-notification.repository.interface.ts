export interface IAdminNotificationRepository {
  listByAdminId(adminId: string): Promise<unknown[]>;
  markAsRead(adminId: string, notificationId: string): Promise<unknown>;
  markAllAsRead(adminId: string): Promise<{ count: number }>;
  notifyAllAdmins(title: string, body: string): Promise<number>;
}

export type BroadcastTarget = 'DRIVERS' | 'GARAGES' | 'ALL';

export interface IBroadcastNotificationRepository {
  broadcast(title: string, body: string, target: BroadcastTarget): Promise<{
    drivers: number;
    garages: number;
    total: number;
  }>;
}

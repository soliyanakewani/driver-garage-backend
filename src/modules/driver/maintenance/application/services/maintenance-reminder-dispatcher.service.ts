import { IMaintenanceRepository } from '../../domain/repositories/maintenance.repository.interface';

const DEFAULT_INTERVAL_MS = 60_000;

export function startMaintenanceReminderDispatcher(
  repository: IMaintenanceRepository,
  intervalMs: number = DEFAULT_INTERVAL_MS
): NodeJS.Timeout {
  const dispatch = async () => {
    try {
      await repository.dispatchDueReminderNotifications(new Date());
    } catch (error) {
      console.error('Failed to dispatch maintenance reminder notifications', error);
    }
  };

  void dispatch();
  return setInterval(() => {
    void dispatch();
  }, intervalMs);
}

import { IMaintenanceRepository } from '../../domain/repositories/maintenance.repository.interface';
import { MaintenanceReminderView } from '../../domain/entities/maintenance-reminder.entity';

export class MarkReminderDoneUseCase {
  constructor(private readonly repository: IMaintenanceRepository) {}

  async execute(driverId: string, reminderId: string): Promise<MaintenanceReminderView> {
    return this.repository.markReminderDone(driverId, reminderId, new Date());
  }
}

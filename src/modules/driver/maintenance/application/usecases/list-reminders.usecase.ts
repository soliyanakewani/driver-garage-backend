import { IMaintenanceRepository } from '../../domain/repositories/maintenance.repository.interface';
import { MaintenanceReminder } from '../../domain/entities/maintenance-reminder.entity';

export class ListRemindersUseCase {
  constructor(private readonly repository: IMaintenanceRepository) {}

  async execute(driverId: string): Promise<MaintenanceReminder[]> {
    return this.repository.findAllReminders(driverId);
  }
}

import { IMaintenanceRepository } from '../../domain/repositories/maintenance.repository.interface';
import { MaintenanceReminder } from '../../domain/entities/maintenance-reminder.entity';

export class ToggleReminderUseCase {
  constructor(private readonly repository: IMaintenanceRepository) {}

  async execute(driverId: string, id: string): Promise<MaintenanceReminder> {
    const existing = await this.repository.findReminderById(driverId, id);
    if (!existing) throw new Error('Maintenance reminder not found');
    return this.repository.toggleReminderSet(driverId, id);
  }
}

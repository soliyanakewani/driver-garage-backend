import { IMaintenanceRepository } from '../../domain/repositories/maintenance.repository.interface';

export class DeleteReminderUseCase {
  constructor(private readonly repository: IMaintenanceRepository) {}

  async execute(driverId: string, id: string): Promise<void> {
    const existing = await this.repository.findReminderById(driverId, id);
    if (!existing) throw new Error('Maintenance reminder not found');
    return this.repository.deleteReminder(driverId, id);
  }
}

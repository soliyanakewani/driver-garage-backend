import { IMaintenanceRepository } from '../../domain/repositories/maintenance.repository.interface';

export class DeleteRecordUseCase {
  constructor(private readonly repository: IMaintenanceRepository) {}

  async execute(driverId: string, id: string): Promise<void> {
    const existing = await this.repository.findRecordById(driverId, id);
    if (!existing) throw new Error('Maintenance record not found');
    return this.repository.deleteRecord(driverId, id);
  }
}

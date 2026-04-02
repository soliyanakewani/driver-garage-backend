import { IMaintenanceRepository } from '../../domain/repositories/maintenance.repository.interface';
import { MaintenanceRecord } from '../../domain/entities/maintenance-record.entity';

export class ListRecordsUseCase {
  constructor(private readonly repository: IMaintenanceRepository) {}

  async execute(driverId: string): Promise<MaintenanceRecord[]> {
    return this.repository.findAllRecords(driverId);
  }
}

import { IMaintenanceRepository, CreateRecordData } from '../../domain/repositories/maintenance.repository.interface';
import { MaintenanceRecord } from '../../domain/entities/maintenance-record.entity';
import { CreateRecordDto } from '../dto/record.dto';

export class CreateRecordUseCase {
  constructor(private readonly repository: IMaintenanceRepository) {}

  async execute(driverId: string, dto: CreateRecordDto): Promise<MaintenanceRecord> {
    if (!dto.serviceName?.trim()) throw new Error('Service name is required');
    if (!dto.serviceDate) throw new Error('Service date is required');

    const serviceDate = new Date(dto.serviceDate);
    if (isNaN(serviceDate.getTime())) throw new Error('Invalid service date');

    if (dto.cost != null && dto.cost < 0) throw new Error('Cost cannot be negative');

    const data: CreateRecordData = {
      driverId,
      vehicleId: dto.vehicleId ?? null,
      serviceName: dto.serviceName.trim(),
      garageName: dto.garageName?.trim() ?? null,
      serviceDate,
      cost: dto.cost ?? null,
      notes: dto.notes?.trim() ?? null,
    };

    return this.repository.createRecord(data);
  }
}

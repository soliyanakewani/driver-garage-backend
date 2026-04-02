import { IMaintenanceRepository } from '../../domain/repositories/maintenance.repository.interface';
import { MaintenanceRecord } from '../../domain/entities/maintenance-record.entity';
import { UpdateRecordDto } from '../dto/record.dto';

export class UpdateRecordUseCase {
  constructor(private readonly repository: IMaintenanceRepository) {}

  async execute(driverId: string, id: string, dto: UpdateRecordDto): Promise<MaintenanceRecord> {
    const existing = await this.repository.findRecordById(driverId, id);
    if (!existing) throw new Error('Maintenance record not found');

    if (dto.cost != null && dto.cost < 0) throw new Error('Cost cannot be negative');

    const serviceDate = dto.serviceDate ? new Date(dto.serviceDate) : undefined;
    if (serviceDate && isNaN(serviceDate.getTime())) throw new Error('Invalid service date');

    return this.repository.updateRecord(driverId, id, {
      ...(dto.serviceName !== undefined && { serviceName: dto.serviceName.trim() }),
      ...(dto.garageName !== undefined && { garageName: dto.garageName }),
      ...(serviceDate !== undefined && { serviceDate }),
      ...(dto.cost !== undefined && { cost: dto.cost }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
      ...(dto.vehicleId !== undefined && { vehicleId: dto.vehicleId }),
    });
  }
}

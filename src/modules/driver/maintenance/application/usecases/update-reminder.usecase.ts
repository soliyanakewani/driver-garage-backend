import { IMaintenanceRepository } from '../../domain/repositories/maintenance.repository.interface';
import { MaintenanceReminder } from '../../domain/entities/maintenance-reminder.entity';
import { UpdateReminderDto } from '../dto/reminder.dto';

export class UpdateReminderUseCase {
  constructor(private readonly repository: IMaintenanceRepository) {}

  async execute(driverId: string, id: string, dto: UpdateReminderDto): Promise<MaintenanceReminder> {
    const existing = await this.repository.findReminderById(driverId, id);
    if (!existing) throw new Error('Maintenance reminder not found');

    if (dto.estimatedCostMin != null && dto.estimatedCostMax != null) {
      if (dto.estimatedCostMin > dto.estimatedCostMax) {
        throw new Error('estimatedCostMin cannot be greater than estimatedCostMax');
      }
    }

    const scheduledDate = dto.scheduledDate ? new Date(dto.scheduledDate) : undefined;
    if (scheduledDate && isNaN(scheduledDate.getTime())) throw new Error('Invalid scheduled date');

    return this.repository.updateReminder(driverId, id, {
      ...(dto.serviceName !== undefined && { serviceName: dto.serviceName.trim() }),
      ...(scheduledDate !== undefined && { scheduledDate }),
      ...(dto.estimatedCostMin !== undefined && { estimatedCostMin: dto.estimatedCostMin }),
      ...(dto.estimatedCostMax !== undefined && { estimatedCostMax: dto.estimatedCostMax }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
      ...(dto.vehicleId !== undefined && { vehicleId: dto.vehicleId }),
    });
  }
}

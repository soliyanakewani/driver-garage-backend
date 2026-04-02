import { IMaintenanceRepository, CreateReminderData } from '../../domain/repositories/maintenance.repository.interface';
import { MaintenanceReminder } from '../../domain/entities/maintenance-reminder.entity';
import { CreateReminderDto } from '../dto/reminder.dto';

export class CreateReminderUseCase {
  constructor(private readonly repository: IMaintenanceRepository) {}

  async execute(driverId: string, dto: CreateReminderDto): Promise<MaintenanceReminder> {
    if (!dto.serviceName?.trim()) throw new Error('Service name is required');
    if (!dto.scheduledDate) throw new Error('Scheduled date is required');

    const scheduledDate = new Date(dto.scheduledDate);
    if (isNaN(scheduledDate.getTime())) throw new Error('Invalid scheduled date');

    if (dto.estimatedCostMin != null && dto.estimatedCostMax != null) {
      if (dto.estimatedCostMin > dto.estimatedCostMax) {
        throw new Error('estimatedCostMin cannot be greater than estimatedCostMax');
      }
    }

    const data: CreateReminderData = {
      driverId,
      vehicleId: dto.vehicleId ?? null,
      serviceName: dto.serviceName.trim(),
      scheduledDate,
      estimatedCostMin: dto.estimatedCostMin ?? null,
      estimatedCostMax: dto.estimatedCostMax ?? null,
      notes: dto.notes?.trim() ?? null,
    };

    return this.repository.createReminder(data);
  }
}

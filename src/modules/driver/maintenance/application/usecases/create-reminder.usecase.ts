import { IMaintenanceRepository, CreateReminderData } from '../../domain/repositories/maintenance.repository.interface';
import { MaintenanceReminder } from '../../domain/entities/maintenance-reminder.entity';
import { CreateReminderDto } from '../dto/reminder.dto';

export class CreateReminderUseCase {
  constructor(private readonly repository: IMaintenanceRepository) {}

  async execute(driverId: string, dto: CreateReminderDto): Promise<MaintenanceReminder> {
    if (!dto.vehicleId?.trim()) throw new Error('vehicleId is required');
    if (!dto.presetCategory?.trim()) throw new Error('presetCategory is required — use GET /driver/maintenance/catalog');
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
      vehicleId: dto.vehicleId.trim(),
      presetCategory: dto.presetCategory.trim(),
      customServiceName: dto.customServiceName?.trim() ?? null,
      scheduledDate,
      estimatedCostMin: dto.estimatedCostMin ?? null,
      estimatedCostMax: dto.estimatedCostMax ?? null,
      notes: dto.notes?.trim() ?? null,
    };

    return this.repository.createReminder(data);
  }
}

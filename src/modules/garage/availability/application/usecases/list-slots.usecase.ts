import { IGarageAvailabilityRepository } from '../../domain/repositories/availability.repository.interface';
import { AvailabilitySlot, DayOfWeek } from '../../domain/entities/availability-slot.entity';

export class ListAvailabilitySlotsUseCase {
  constructor(private readonly repository: IGarageAvailabilityRepository) {}

  async execute(input: { garageId: string; dayOfWeek?: DayOfWeek }): Promise<AvailabilitySlot[]> {
    return this.repository.listSlots(input.garageId, input.dayOfWeek);
  }
}


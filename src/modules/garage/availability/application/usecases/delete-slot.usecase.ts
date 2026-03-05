import { IGarageAvailabilityRepository } from '../../domain/repositories/availability.repository.interface';

export class DeleteAvailabilitySlotUseCase {
  constructor(private readonly repository: IGarageAvailabilityRepository) {}

  async execute(input: { garageId: string; slotId: string }): Promise<void> {
    return this.repository.deleteSlot(input.slotId, input.garageId);
  }
}


import { IGarageAvailabilityRepository } from '../../domain/repositories/availability.repository.interface';
import { AvailabilitySlot, DayOfWeek } from '../../domain/entities/availability-slot.entity';

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export class CreateAvailabilitySlotUseCase {
  constructor(private readonly repository: IGarageAvailabilityRepository) {}

  async execute(input: {
    garageId: string;
    dayOfWeek: DayOfWeek;
    startMinute: number;
    endMinute: number;
  }): Promise<AvailabilitySlot> {
    // Prevent overlaps
    const existing = await this.repository.listSlots(input.garageId, input.dayOfWeek);
    const conflict = existing.some((s) => overlaps(input.startMinute, input.endMinute, s.startMinute, s.endMinute));
    if (conflict) throw new Error('Time slot overlaps with an existing slot');

    return this.repository.createSlot(input);
  }
}


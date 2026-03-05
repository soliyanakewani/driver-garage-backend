import { IGarageAvailabilityRepository } from '../../domain/repositories/availability.repository.interface';
import { AvailabilitySlot, DayOfWeek } from '../../domain/entities/availability-slot.entity';

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export class UpdateAvailabilitySlotUseCase {
  constructor(private readonly repository: IGarageAvailabilityRepository) {}

  async execute(input: {
    garageId: string;
    slotId: string;
    updates: { dayOfWeek?: DayOfWeek; startMinute?: number; endMinute?: number };
  }): Promise<AvailabilitySlot> {
    const current = await this.repository.findSlotById(input.slotId, input.garageId);
    if (!current) throw new Error('Slot not found');

    const nextDay = input.updates.dayOfWeek ?? current.dayOfWeek;
    const nextStart = input.updates.startMinute ?? current.startMinute;
    const nextEnd = input.updates.endMinute ?? current.endMinute;
    if (nextStart >= nextEnd) throw new Error('start must be before end');

    const existing = await this.repository.listSlots(input.garageId, nextDay);
    const conflict = existing
      .filter((s) => s.id !== current.id)
      .some((s) => overlaps(nextStart, nextEnd, s.startMinute, s.endMinute));
    if (conflict) throw new Error('Time slot overlaps with an existing slot');

    return this.repository.updateSlot(input.slotId, input.garageId, input.updates);
  }
}


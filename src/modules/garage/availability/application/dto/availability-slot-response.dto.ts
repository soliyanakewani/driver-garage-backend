import { AvailabilitySlot } from '../../domain/entities/availability-slot.entity';
import { formatMinute } from './time-slot.dto';

export class AvailabilitySlotResponseDto {
  constructor(
    public readonly id: string,
    public readonly garageId: string,
    public readonly dayOfWeek: string,
    public readonly startMinute: number,
    public readonly endMinute: number,
    public readonly startTime: string,
    public readonly endTime: string,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  static from(slot: AvailabilitySlot): AvailabilitySlotResponseDto {
    const s = slot.toJSON();
    return new AvailabilitySlotResponseDto(
      s.id,
      s.garageId,
      s.dayOfWeek,
      s.startMinute,
      s.endMinute,
      formatMinute(s.startMinute),
      formatMinute(s.endMinute),
      s.createdAt.toISOString(),
      s.updatedAt.toISOString()
    );
  }
}


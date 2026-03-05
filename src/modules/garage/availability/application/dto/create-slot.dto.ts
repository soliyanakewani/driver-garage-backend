import { DayOfWeek } from '../../domain/entities/availability-slot.entity';
import { parseDayOfWeek, parseTimeToMinute } from './time-slot.dto';

export class CreateAvailabilitySlotRequestDto {
  constructor(
    public readonly dayOfWeek: DayOfWeek,
    public readonly startMinute: number,
    public readonly endMinute: number
  ) {}

  static from(body: unknown): CreateAvailabilitySlotRequestDto {
    if (!body || typeof body !== 'object') throw new Error('Invalid request body');
    const b = body as any;

    const dayOfWeek = parseDayOfWeek(b.dayOfWeek);
    const startMinute = typeof b.startMinute === 'number' ? b.startMinute : parseTimeToMinute(b.startTime);
    const endMinute = typeof b.endMinute === 'number' ? b.endMinute : parseTimeToMinute(b.endTime);

    if (!Number.isInteger(startMinute) || !Number.isInteger(endMinute)) {
      throw new Error('startMinute and endMinute must be integers');
    }
    if (startMinute < 0 || startMinute > 1439) throw new Error('startMinute must be between 0 and 1439');
    if (endMinute < 1 || endMinute > 1440) throw new Error('endMinute must be between 1 and 1440');
    if (startMinute >= endMinute) throw new Error('start must be before end');

    return new CreateAvailabilitySlotRequestDto(dayOfWeek, startMinute, endMinute);
  }
}


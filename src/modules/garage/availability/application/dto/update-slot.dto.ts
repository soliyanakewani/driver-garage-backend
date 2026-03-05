import { DayOfWeek } from '../../domain/entities/availability-slot.entity';
import { parseDayOfWeek, parseTimeToMinute } from './time-slot.dto';

export class UpdateAvailabilitySlotRequestDto {
  constructor(
    public readonly dayOfWeek?: DayOfWeek,
    public readonly startMinute?: number,
    public readonly endMinute?: number
  ) {}

  static from(body: unknown): UpdateAvailabilitySlotRequestDto {
    if (!body || typeof body !== 'object') throw new Error('Invalid request body');
    const b = body as any;

    const hasDay = b.dayOfWeek !== undefined;
    const hasStartMinute = b.startMinute !== undefined || b.startTime !== undefined;
    const hasEndMinute = b.endMinute !== undefined || b.endTime !== undefined;

    if (!hasDay && !hasStartMinute && !hasEndMinute) {
      throw new Error('No updates provided');
    }

    const dayOfWeek = hasDay ? parseDayOfWeek(b.dayOfWeek) : undefined;
    const startMinute = hasStartMinute
      ? typeof b.startMinute === 'number'
        ? b.startMinute
        : parseTimeToMinute(b.startTime)
      : undefined;
    const endMinute = hasEndMinute
      ? typeof b.endMinute === 'number'
        ? b.endMinute
        : parseTimeToMinute(b.endTime)
      : undefined;

    if (typeof startMinute === 'number' && (!Number.isInteger(startMinute) || startMinute < 0 || startMinute > 1439)) {
      throw new Error('startMinute must be between 0 and 1439');
    }
    if (typeof endMinute === 'number' && (!Number.isInteger(endMinute) || endMinute < 1 || endMinute > 1440)) {
      throw new Error('endMinute must be between 1 and 1440');
    }

    if (typeof startMinute === 'number' && typeof endMinute === 'number' && startMinute >= endMinute) {
      throw new Error('start must be before end');
    }

    return new UpdateAvailabilitySlotRequestDto(dayOfWeek, startMinute, endMinute);
  }
}


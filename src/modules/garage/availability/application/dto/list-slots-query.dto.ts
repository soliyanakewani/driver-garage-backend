import { DayOfWeek } from '../../domain/entities/availability-slot.entity';
import { parseDayOfWeek } from './time-slot.dto';

export class ListSlotsQueryDto {
  constructor(public readonly dayOfWeek?: DayOfWeek) {}

  static from(query: unknown): ListSlotsQueryDto {
    if (!query || typeof query !== 'object') return new ListSlotsQueryDto(undefined);
    const q = query as any;
    if (!q.dayOfWeek) return new ListSlotsQueryDto(undefined);
    return new ListSlotsQueryDto(parseDayOfWeek(q.dayOfWeek));
  }
}


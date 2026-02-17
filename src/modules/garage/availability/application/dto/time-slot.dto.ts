import { DayOfWeek } from '../../domain/entities/availability-slot.entity';

export function parseTimeToMinute(time: string): number {
  const trimmed = String(time ?? '').trim();
  const match = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (!match) throw new Error('time must be in HH:MM format');
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) throw new Error('time must be in HH:MM format');
  if (hours < 0 || hours > 23) throw new Error('time hours must be 0-23');
  if (minutes < 0 || minutes > 59) throw new Error('time minutes must be 0-59');
  return hours * 60 + minutes;
}

export function formatMinute(minute: number): string {
  const h = Math.floor(minute / 60);
  const m = minute % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function parseDayOfWeek(value: unknown): DayOfWeek {
  const day = String(value ?? '').trim().toUpperCase();
  const allowed: string[] = [
    DayOfWeek.Monday,
    DayOfWeek.Tuesday,
    DayOfWeek.Wednesday,
    DayOfWeek.Thursday,
    DayOfWeek.Friday,
    DayOfWeek.Saturday,
    DayOfWeek.Sunday,
  ];
  if (!allowed.includes(day)) {
    throw new Error(`dayOfWeek must be one of: ${allowed.join(', ')}`);
  }
  return day as DayOfWeek;
}


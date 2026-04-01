import type { DayOfWeek } from '@prisma/client';
import { prisma } from '../../../../infrastructure/prisma/prisma.client';

/** Prisma DayOfWeek for JS Date#getUTCDay() (0 = Sunday … 6 = Saturday). */
const UTC_JS_DAY_TO_PRISMA: DayOfWeek[] = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

export function prismaDayOfWeekFromUtcDate(d: Date): DayOfWeek {
  return UTC_JS_DAY_TO_PRISMA[d.getUTCDay()] as DayOfWeek;
}

/** Minute of day 0–1439 in UTC (slots are compared the same way as stored start/end minutes). */
export function minuteOfDayUtc(d: Date): number {
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

/**
 * Ensures scheduled time falls inside at least one availability slot for that calendar day (UTC).
 * Does not check for overlapping appointments (double booking allowed).
 */
export async function assertAppointmentWithinGarageAvailability(
  garageId: string,
  scheduledAt: Date
): Promise<void> {
  const dayOfWeek = prismaDayOfWeekFromUtcDate(scheduledAt);
  const slots = await prisma.garageAvailabilitySlot.findMany({
    where: { garageId, dayOfWeek },
  });

  if (slots.length === 0) {
    throw new Error(
      'This garage has no availability on the selected day. Pick another date or check the garage schedule.'
    );
  }

  const minute = minuteOfDayUtc(scheduledAt);
  const fits = slots.some((s) => minute >= s.startMinute && minute < s.endMinute);
  if (!fits) {
    throw new Error(
      'Requested time is outside the garage opening hours. Choose a time within an available slot.'
    );
  }
}

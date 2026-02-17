import { AvailabilitySlot, DayOfWeek } from '../entities/availability-slot.entity';

export interface IGarageAvailabilityRepository {
  listSlots(garageId: string, dayOfWeek?: DayOfWeek): Promise<AvailabilitySlot[]>;

  createSlot(input: {
    garageId: string;
    dayOfWeek: DayOfWeek;
    startMinute: number;
    endMinute: number;
  }): Promise<AvailabilitySlot>;

  updateSlot(
    slotId: string,
    garageId: string,
    updates: { dayOfWeek?: DayOfWeek; startMinute?: number; endMinute?: number }
  ): Promise<AvailabilitySlot>;

  deleteSlot(slotId: string, garageId: string): Promise<void>;

  findSlotById(slotId: string, garageId: string): Promise<AvailabilitySlot | null>;

  // Used by booking validation
  isTimeWithinAnySlot(garageId: string, dayOfWeek: DayOfWeek, minuteOfDay: number): Promise<boolean>;
}


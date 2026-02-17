import { prisma } from '../../../../../infrastructure/prisma/prisma.client';
import { AvailabilitySlot, DayOfWeek } from '../../domain/entities/availability-slot.entity';
import { IGarageAvailabilityRepository } from '../../domain/repositories/availability.repository.interface';

type PrismaDayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

interface PrismaSlot {
  id: string;
  garageId: string;
  dayOfWeek: PrismaDayOfWeek;
  startMinute: number;
  endMinute: number;
  createdAt: Date;
  updatedAt: Date;
}

function mapFromPrisma(slot: PrismaSlot): AvailabilitySlot {
  return AvailabilitySlot.create({
    id: slot.id,
    garageId: slot.garageId,
    dayOfWeek: slot.dayOfWeek as DayOfWeek,
    startMinute: slot.startMinute,
    endMinute: slot.endMinute,
    createdAt: slot.createdAt,
    updatedAt: slot.updatedAt,
  });
}

export class PrismaGarageAvailabilityRepository implements IGarageAvailabilityRepository {
  async listSlots(garageId: string, dayOfWeek?: DayOfWeek): Promise<AvailabilitySlot[]> {
    const where: any = { garageId };
    if (dayOfWeek) where.dayOfWeek = dayOfWeek;

    const slots = (await prisma.garageAvailabilitySlot.findMany({
      where,
      orderBy: [{ dayOfWeek: 'asc' }, { startMinute: 'asc' }],
    })) as any[];

    return slots.map(mapFromPrisma);
  }

  async findSlotById(slotId: string, garageId: string): Promise<AvailabilitySlot | null> {
    const slot = (await prisma.garageAvailabilitySlot.findFirst({
      where: { id: slotId, garageId },
    })) as any;
    return slot ? mapFromPrisma(slot) : null;
  }

  async createSlot(input: {
    garageId: string;
    dayOfWeek: DayOfWeek;
    startMinute: number;
    endMinute: number;
  }): Promise<AvailabilitySlot> {
    const created = (await prisma.garageAvailabilitySlot.create({
      data: {
        garageId: input.garageId,
        dayOfWeek: input.dayOfWeek as any,
        startMinute: input.startMinute,
        endMinute: input.endMinute,
      },
    })) as any;
    return mapFromPrisma(created);
  }

  async updateSlot(
    slotId: string,
    garageId: string,
    updates: { dayOfWeek?: DayOfWeek; startMinute?: number; endMinute?: number }
  ): Promise<AvailabilitySlot> {
    const updated = (await prisma.garageAvailabilitySlot.update({
      where: { id: slotId },
      data: {
        ...(updates.dayOfWeek ? { dayOfWeek: updates.dayOfWeek as any } : {}),
        ...(typeof updates.startMinute === 'number' ? { startMinute: updates.startMinute } : {}),
        ...(typeof updates.endMinute === 'number' ? { endMinute: updates.endMinute } : {}),
      },
    })) as any;
    // Ensure it belongs to that garage
    if (updated.garageId !== garageId) throw new Error('Slot not found');
    return mapFromPrisma(updated);
  }

  async deleteSlot(slotId: string, garageId: string): Promise<void> {
    const slot = await this.findSlotById(slotId, garageId);
    if (!slot) throw new Error('Slot not found');
    await prisma.garageAvailabilitySlot.delete({ where: { id: slotId } });
  }

  async isTimeWithinAnySlot(garageId: string, dayOfWeek: DayOfWeek, minuteOfDay: number): Promise<boolean> {
    const count = await prisma.garageAvailabilitySlot.count({
      where: {
        garageId,
        dayOfWeek: dayOfWeek as any,
        startMinute: { lte: minuteOfDay },
        endMinute: { gt: minuteOfDay },
      },
    });
    return count > 0;
  }
}


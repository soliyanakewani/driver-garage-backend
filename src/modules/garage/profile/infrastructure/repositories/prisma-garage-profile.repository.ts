import { prisma } from '../../../../../infrastructure/prisma/prisma.client';
import bcrypt from 'bcrypt';
import type { IGarageProfileRepository, GarageProfileUpdateData } from '../../domain/repositories/garage-profile.repository.interface';

const profileSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  status: true,
  address: true,
  latitude: true,
  longitude: true,
  businessDocumentUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class PrismaGarageProfileRepository implements IGarageProfileRepository {
  async getByGarageId(garageId: string): Promise<unknown> {
    const garage = await prisma.garage.findUnique({
      where: { id: garageId },
      select: {
        ...profileSelect,
        services: { select: { id: true, garageId: true, name: true, createdAt: true, updatedAt: true } },
        availabilitySlots: {
          select: { id: true, garageId: true, dayOfWeek: true, startMinute: true, endMinute: true, createdAt: true, updatedAt: true },
        },
      },
    });
    if (!garage) throw new Error('Garage not found');
    return garage;
  }

  async update(garageId: string, data: GarageProfileUpdateData): Promise<unknown> {
    const existing = await prisma.garage.findUnique({ where: { id: garageId } });
    if (!existing) throw new Error('Garage not found');

    const updateData: Record<string, unknown> = {};
    if (data.name != null) updateData.name = data.name;
    if (data.address != null) updateData.address = data.address;
    if (data.latitude != null) updateData.latitude = Number(data.latitude);
    if (data.longitude != null) updateData.longitude = Number(data.longitude);
    if (data.businessDocumentUrl !== undefined) {
      updateData.businessDocumentUrl =
        data.businessDocumentUrl === null || data.businessDocumentUrl === ''
          ? null
          : String(data.businessDocumentUrl);
    }

    if (data.email != null) {
      const taken = await prisma.garage.findFirst({
        where: { email: data.email, NOT: { id: garageId } },
      });
      if (taken) throw new Error('Email already in use');
      updateData.email = data.email;
    }
    if (data.phone != null) {
      const taken = await prisma.garage.findFirst({
        where: { phone: data.phone, NOT: { id: garageId } },
      });
      if (taken) throw new Error('Phone already in use');
      updateData.phone = data.phone;
    }
    if (data.password != null && data.password.length > 0) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await prisma.garage.update({
      where: { id: garageId },
      data: updateData,
      select: {
        ...profileSelect,
        services: { select: { id: true, garageId: true, name: true, createdAt: true, updatedAt: true } },
        availabilitySlots: {
          select: { id: true, garageId: true, dayOfWeek: true, startMinute: true, endMinute: true, createdAt: true, updatedAt: true },
        },
      },
    });
    return updated;
  }
}

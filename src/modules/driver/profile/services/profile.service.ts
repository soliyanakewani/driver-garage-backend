import { prisma } from '../../../../infrastructure/prisma/prisma.client';
import bcrypt from 'bcrypt';
import type { DriverProfileDTO } from '../dtos/profile.dto';

const profileSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class DriverProfileService {
  async getByDriverId(driverId: string) {
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      select: profileSelect,
    });
    if (!driver) throw new Error('Driver not found');
    return driver;
  }

  async create(driverId: string, data: DriverProfileDTO) {
    const existing = await prisma.driver.findUnique({ where: { id: driverId } });
    if (!existing) throw new Error('Driver not found');
    // Profile is the driver record; "create" is idempotent - return current profile
    return this.getByDriverId(driverId);
  }

  async update(driverId: string, data: DriverProfileDTO) {
    const existing = await prisma.driver.findUnique({ where: { id: driverId } });
    if (!existing) throw new Error('Driver not found');

    const updateData: Record<string, unknown> = {};
    if (data.firstName != null) updateData.firstName = data.firstName;
    if (data.lastName != null) updateData.lastName = data.lastName;
    if (data.email != null) {
      const taken = await prisma.driver.findFirst({
        where: { email: data.email, NOT: { id: driverId } },
      });
      if (taken) throw new Error('Email already in use');
      updateData.email = data.email;
    }
    if (data.phone != null) {
      const taken = await prisma.driver.findFirst({
        where: { phone: data.phone, NOT: { id: driverId } },
      });
      if (taken) throw new Error('Phone already in use');
      updateData.phone = data.phone;
    }
    if (data.password != null && data.password.length > 0) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const driver = await prisma.driver.update({
      where: { id: driverId },
      data: updateData,
      select: profileSelect,
    });
    return driver;
  }
}

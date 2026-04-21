import { prisma } from '../../../../../infrastructure/prisma/prisma.client';
import bcrypt from 'bcrypt';

export class ChangeDriverPasswordUseCase {
  async execute(driverId: string, currentPassword: string, newPassword: string): Promise<void> {
    const driver = await prisma.driver.findUnique({ where: { id: driverId } });
    if (!driver) throw new Error('Driver not found');

    const valid = await bcrypt.compare(currentPassword, driver.password);
    if (!valid) throw new Error('Current password is incorrect');

    if (newPassword.length < 6) throw new Error('New password must be at least 6 characters');

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.driver.update({ where: { id: driverId }, data: { password: hashed } });
  }
}

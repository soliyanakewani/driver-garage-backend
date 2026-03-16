import { prisma } from '../../../../../infrastructure/prisma/prisma.client';
import bcrypt from 'bcrypt';

export class ChangePasswordUseCase {
  async execute(garageId: string, currentPassword: string, newPassword: string): Promise<void> {
    const garage = await prisma.garage.findUnique({ where: { id: garageId } });
    if (!garage) throw new Error('Garage not found');

    const valid = await bcrypt.compare(currentPassword, garage.password);
    if (!valid) throw new Error('Current password is incorrect');

    if (newPassword.length < 6) throw new Error('New password must be at least 6 characters');

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.garage.update({ where: { id: garageId }, data: { password: hashed } });
  }
}

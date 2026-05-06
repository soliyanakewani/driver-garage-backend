import { prisma } from '../../../../infrastructure/prisma/prisma.client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AdminAuthService {
  async login(email: string, password: string) {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new Error('Invalid credentials');

    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return { token, admin };
  }

  async changePassword(adminId: string, currentPassword: string, newPassword: string): Promise<void> {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) throw new Error('Admin not found');

    const valid = await bcrypt.compare(currentPassword, admin.password);
    if (!valid) throw new Error('Current password is incorrect');

    if (newPassword.length < 6) throw new Error('New password must be at least 6 characters');

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({ where: { id: adminId }, data: { password: hashed } });
  }
}
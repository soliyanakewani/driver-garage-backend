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
}
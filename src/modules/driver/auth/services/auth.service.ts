import { prisma } from '../../../../infrastructure/prisma/prisma.client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class DriverAuthService {
  async signup(firstName: string, lastName: string, email: string, phone: string, password: string) {
    const existing = await prisma.driver.findUnique({ where: { email } });
    if (existing) throw new Error('Email already registered');

    const hashed = await bcrypt.hash(password, 10);
    return prisma.driver.create({
      data: { firstName, lastName, email, phone, password: hashed },
    });
  }

  async login(phone: string, password: string) {
    const driver = await prisma.driver.findUnique({ where: { phone } });
    if (!driver) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, driver.password);
    if (!valid) throw new Error('Invalid credentials');

    const token = jwt.sign(
      { id: driver.id, role: 'DRIVER' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return { token, driver };
  }
}
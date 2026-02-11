import { prisma } from '../../../../infrastructure/prisma/prisma.client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class GarageAuthService {
  async signup(name: string, email: string, phone: string, password: string) {
    const existing = await prisma.garage.findUnique({ where: { email } });
    if (existing) throw new Error('Email already registered');

    const hashed = await bcrypt.hash(password, 10);
    return prisma.garage.create({
      data: { name, email, phone, password: hashed },
    });
  }

  async login(email: string, password: string) {
    const garage = await prisma.garage.findUnique({ where: { email } });
    if (!garage) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, garage.password);
    if (!valid) throw new Error('Invalid credentials');

    const token = jwt.sign(
      { id: garage.id, role: 'GARAGE' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return { token, garage };
  }
}
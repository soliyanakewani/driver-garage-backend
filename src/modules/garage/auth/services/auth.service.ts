import { prisma } from '../../../../infrastructure/prisma/prisma.client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class GarageAuthService {
  async signup(
    name: string,
    email: string,
    phone: string,
    password: string,
    services?: string[],
    location?: { address?: string; latitude?: number; longitude?: number },
    businessDocumentUrl?: string | null
  ) {
    const [existingByEmail, existingByPhone] = await Promise.all([
      prisma.garage.findUnique({ where: { email } }),
      prisma.garage.findUnique({ where: { phone } }),
    ]);
    if (existingByEmail) throw new Error('Email already registered');
    if (existingByPhone) throw new Error('Phone number already registered');

    const hashed = await bcrypt.hash(password, 10);
    const garage = await prisma.garage.create({
      data: {
        name,
        email,
        phone,
        password: hashed,
        address: location?.address ?? null,
        latitude: location?.latitude != null ? Number(location.latitude) : null,
        longitude: location?.longitude != null ? Number(location.longitude) : null,
        businessDocumentUrl: businessDocumentUrl?.trim() || null,
      },
    });

    const names = Array.isArray(services)
      ? services.map((s) => (typeof s === 'string' ? s.trim() : '')).filter(Boolean)
      : [];
    if (names.length > 0) {
      await prisma.garageService.createMany({
        data: names.map((serviceName) => ({ garageId: garage.id, name: serviceName })),
      });
    }

    return garage;
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

  private static otpStore = new Map<string, { code: string; expiresAt: number }>();
  private static OTP_TTL_MS = 10 * 60 * 1000;

  async sendOtp(email: string) {
    const garage = await prisma.garage.findUnique({ where: { email } });
    if (!garage) throw new Error('No garage found with this email');
    const code = String(Math.floor(100000 + Math.random() * 900000));
    GarageAuthService.otpStore.set(email, {
      code,
      expiresAt: Date.now() + GarageAuthService.OTP_TTL_MS,
    });
    return { message: 'OTP sent', expiresInMinutes: 10 };
  }

  async verifyOtp(email: string, code: string) {
    const entry = GarageAuthService.otpStore.get(email);
    if (!entry) throw new Error('Invalid or expired OTP');
    if (Date.now() > entry.expiresAt) {
      GarageAuthService.otpStore.delete(email);
      throw new Error('OTP expired');
    }
    if (entry.code !== code) throw new Error('Invalid OTP');
    GarageAuthService.otpStore.delete(email);
    const garage = await prisma.garage.findUnique({ where: { email } });
    if (!garage) throw new Error('Invalid credentials');
    const token = jwt.sign(
      { id: garage.id, role: 'GARAGE' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
    const { password: _, ...garageWithoutPassword } = garage;
    return { token, garage: garageWithoutPassword };
  }
}

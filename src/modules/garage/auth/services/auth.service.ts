import { prisma, type AppPrismaClient } from '../../../../infrastructure/prisma/prisma.client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendGarageSignupOtpEmail } from '../../../../infrastructure/email/send-otp-email';

const OTP_TTL_MS = 10 * 60 * 1000;
const VERIFIED_SIGNUP_WINDOW_MS = 24 * 60 * 60 * 1000;

function normalizeGarageEmail(email: string): string {
  return email.trim().toLowerCase();
}

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
    const emailNorm = normalizeGarageEmail(email);

    const pending = await prisma.garageSignupOtp.findUnique({
      where: { email: emailNorm },
    });
    if (!pending?.verifiedAt) {
      throw new Error('Email not verified. Request an OTP and verify it before signup.');
    }
    if (Date.now() - pending.verifiedAt.getTime() > VERIFIED_SIGNUP_WINDOW_MS) {
      throw new Error('Email verification expired. Request a new OTP.');
    }

    const [existingByEmail, existingByPhone] = await Promise.all([
      prisma.garage.findUnique({ where: { email: emailNorm } }),
      prisma.garage.findUnique({ where: { phone } }),
    ]);
    if (existingByEmail) throw new Error('Email already registered');
    if (existingByPhone) throw new Error('Phone number already registered');

    const hashed = await bcrypt.hash(password, 10);

    const garage = await prisma.$transaction(async (rawTx) => {
      const tx = rawTx as unknown as AppPrismaClient;
      const g = await tx.garage.create({
        data: {
          name,
          email: emailNorm,
          phone,
          password: hashed,
          isEmailVerified: true,
          isPhoneVerified: false,
          address: location?.address ?? null,
          latitude: location?.latitude != null ? Number(location.latitude) : null,
          longitude: location?.longitude != null ? Number(location.longitude) : null,
          businessDocumentUrl: businessDocumentUrl?.trim() || null,
        } as never,
      });

      const names = Array.isArray(services)
        ? services.map((s) => (typeof s === 'string' ? s.trim() : '')).filter(Boolean)
        : [];
      if (names.length > 0) {
        await tx.garageService.createMany({
          data: names.map((serviceName) => ({ garageId: g.id, name: serviceName })),
        });
      }

      await tx.garageSignupOtp.delete({ where: { email: emailNorm } });

      return tx.garage.findUniqueOrThrow({
        where: { id: g.id },
        include: { services: true },
      });
    });

    const token = jwt.sign({ id: garage.id, role: 'GARAGE' }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return { token, garage };
  }

  async login(email: string, password: string) {
    const garage = await prisma.garage.findUnique({ where: { email: normalizeGarageEmail(email) } });
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

  async sendOtp(email: string) {
    const emailNorm = normalizeGarageEmail(email);
    const existingGarage = await prisma.garage.findUnique({ where: { email: emailNorm } });
    if (existingGarage) {
      throw new Error('Email already registered');
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await prisma.garageSignupOtp.upsert({
      where: { email: emailNorm },
      create: {
        email: emailNorm,
        codeHash,
        expiresAt,
        verifiedAt: null,
      },
      update: {
        codeHash,
        expiresAt,
        verifiedAt: null,
      },
    });

    await sendGarageSignupOtpEmail(emailNorm, code);

    return { message: 'OTP sent', expiresInMinutes: 10 };
  }

  async verifyOtp(email: string, code: string) {
    const emailNorm = normalizeGarageEmail(email);
    const pending = await prisma.garageSignupOtp.findUnique({ where: { email: emailNorm } });
    if (!pending) {
      throw new Error('Invalid or expired OTP');
    }

    if (pending.verifiedAt && Date.now() - pending.verifiedAt.getTime() < VERIFIED_SIGNUP_WINDOW_MS) {
      return { verified: true, email: emailNorm };
    }

    if (new Date() > pending.expiresAt) {
      throw new Error('OTP expired');
    }

    const ok = await bcrypt.compare(code, pending.codeHash);
    if (!ok) {
      throw new Error('Invalid OTP');
    }

    await prisma.garageSignupOtp.update({
      where: { email: emailNorm },
      data: { verifiedAt: new Date() },
    });

    return { verified: true, email: emailNorm };
  }
}

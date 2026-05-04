import { prisma } from '../../../../infrastructure/prisma/prisma.client';
import type { Driver } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { verifyFirebaseIdToken } from '../../../../core/firebase/firebase-admin.app';
import { normalizePhoneDigits } from '../utils/phone-normalize';

export class DriverAuthService {
  async signup(firstName: string, lastName: string, email: string, phone: string, password: string) {
    const existingByEmail = await prisma.driver.findUnique({ where: { email } });
    if (existingByEmail) throw new Error('Email already registered');

    const existingByPhone = await prisma.driver.findUnique({ where: { phone } });
    if (existingByPhone) throw new Error('Phone already registered');

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

  /**
   * Verify Firebase phone ID token, then issue the same JWT shape as password login.
   * Creates a driver when none exists for that phone; marks phone verified.
   */
  async firebaseSignIn(input: {
    idToken: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
  }): Promise<{ token: string; driver: Omit<Driver, 'password'> }> {
    const decoded = await verifyFirebaseIdToken(input.idToken);
    const firebasePhone = decoded.phone_number;
    if (!firebasePhone || typeof firebasePhone !== 'string') {
      throw new Error('Phone number not found on Firebase token');
    }
    const tokenDigits = normalizePhoneDigits(firebasePhone);
    const phoneCandidates = [
      firebasePhone,
      firebasePhone.replace(/^\+/, ''),
      tokenDigits,
      tokenDigits ? `+${tokenDigits}` : '',
    ].filter(Boolean);
    const uniquePhones = [...new Set(phoneCandidates)];

    const driverByPhone = await prisma.driver.findFirst({
      where: { phone: { in: uniquePhones } },
    });

    const sameNumber = (stored: string) => normalizePhoneDigits(stored) === tokenDigits;
    const email = input.email.trim().toLowerCase();

    if (driverByPhone) {
      if (!sameNumber(driverByPhone.phone)) {
        throw new Error('Invalid credentials');
      }
      if (driverByPhone.email.toLowerCase() !== email) {
        throw new Error('Email does not match this phone account');
      }
      const updated = await prisma.driver.update({
        where: { id: driverByPhone.id },
        data: { isPhoneVerified: true },
      });
      const token = jwt.sign(
        { id: updated.id, role: 'DRIVER' },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );
      const { password: _pw, ...driver } = updated;
      return { token, driver };
    }

    const existingByEmail = await prisma.driver.findUnique({ where: { email } });
    if (existingByEmail) {
      throw new Error('Email already registered');
    }

    const plainPassword = input.password ?? crypto.randomBytes(24).toString('base64url');
    const hashed = await bcrypt.hash(plainPassword, 10);

    const created = await prisma.driver.create({
      data: {
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email,
        phone: firebasePhone,
        password: hashed,
        isPhoneVerified: true,
        isEmailVerified: false,
      },
    });

    const token = jwt.sign(
      { id: created.id, role: 'DRIVER' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
    const { password: _pw, ...driver } = created;
    return { token, driver };
  }
}
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

/**
 * Shape of `GarageSignupOtp` rows used by garage auth (keeps typings valid even if
 * the IDE's Prisma cache lags behind `schema.prisma` — run `npx prisma generate`).
 */
export type GarageSignupOtpRow = {
  id: string;
  email: string;
  codeHash: string;
  expiresAt: Date;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type GarageSignupOtpDelegate = {
  findUnique(args: { where: { email: string } }): Promise<GarageSignupOtpRow | null>;
  upsert(args: {
    where: { email: string };
    create: {
      email: string;
      codeHash: string;
      expiresAt: Date;
      verifiedAt: Date | null;
    };
    update: { codeHash: string; expiresAt: Date; verifiedAt: Date | null };
  }): Promise<GarageSignupOtpRow>;
  update(args: {
    where: { email: string };
    data: { verifiedAt: Date };
  }): Promise<GarageSignupOtpRow>;
  delete(args: { where: { email: string } }): Promise<GarageSignupOtpRow>;
};

/** Prisma client with explicit OTP delegate (avoids TS2339 when generated types are stale). */
export type AppPrismaClient = PrismaClient & { garageSignupOtp: GarageSignupOtpDelegate };

const base = new PrismaClient();
export const prisma: AppPrismaClient = base as unknown as AppPrismaClient;

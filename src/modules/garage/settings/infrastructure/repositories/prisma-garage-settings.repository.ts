import { prisma } from '../../../../../infrastructure/prisma/prisma.client';
import type { IGarageSettingsRepository } from '../../domain/repositories/garage-settings.repository.interface';

export class PrismaGarageSettingsRepository implements IGarageSettingsRepository {
  async getByGarageId(garageId: string): Promise<unknown> {
    const setting = await prisma.garageSetting.findUnique({
      where: { garageId },
    });
    return setting?.data ?? {};
  }

  async update(garageId: string, data: Record<string, unknown>): Promise<unknown> {
    const existing = (await this.getByGarageId(garageId)) as Record<string, unknown> | null ?? {};
    const merged = { ...existing, ...data };
    await prisma.garageSetting.upsert({
      where: { garageId },
      create: { garageId, data: merged as object },
      update: { data: merged as object },
    });
    return this.getByGarageId(garageId);
  }
}

import { prisma } from '../../../../../infrastructure/prisma/prisma.client';
import type { IGarageRatingRepository } from '../../domain/repositories/garage-rating.repository.interface';

export class PrismaGarageRatingRepository implements IGarageRatingRepository {
  async listByGarageId(garageId: string): Promise<unknown[]> {
    return (prisma as any).garageRating.findMany({
      where: { garageId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(garageId: string, ratingId: string): Promise<unknown> {
    const rating = await (prisma as any).garageRating.findFirst({
      where: { id: ratingId, garageId },
    });
    if (!rating) throw new Error('Rating not found');
    return rating;
  }
}

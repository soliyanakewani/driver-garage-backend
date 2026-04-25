import { prisma } from '../../../../../infrastructure/prisma/prisma.client';
import type {
  GarageRatingsAndReviews,
  GarageRatingSummary,
  IGarageRatingRepository,
} from '../../domain/repositories/garage-rating.repository.interface';

export class PrismaGarageRatingRepository implements IGarageRatingRepository {
  async getSummary(garageId: string): Promise<GarageRatingSummary> {
    const [aggregate, totalRatings] = await Promise.all([
      prisma.garageRating.aggregate({
        where: { garageId },
        _avg: { rating: true },
      }),
      prisma.garageRating.count({ where: { garageId } }),
    ]);

    const raw = aggregate._avg.rating;
    const averageRating =
      raw != null && totalRatings > 0 ? Math.round(raw * 10) / 10 : null;

    return { averageRating, totalRatings };
  }

  async getRatingsAndReviews(garageId: string): Promise<GarageRatingsAndReviews> {
    const [summary, reviews] = await Promise.all([
      this.getSummary(garageId),
      prisma.garageRating.findMany({
        where: { garageId },
        orderBy: { createdAt: 'desc' },
        include: {
          driver: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
    ]);

    return {
      ...summary,
      reviews: reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        driver: review.driver,
      })),
    };
  }
}

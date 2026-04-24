import type { GarageRatingsAndReviews, IGarageRatingRepository } from '../../domain/repositories/garage-rating.repository.interface';

export class GetGarageRatingsAndReviewsUseCase {
  constructor(private readonly repository: IGarageRatingRepository) {}

  async execute(garageId: string): Promise<GarageRatingsAndReviews> {
    return this.repository.getRatingsAndReviews(garageId);
  }
}

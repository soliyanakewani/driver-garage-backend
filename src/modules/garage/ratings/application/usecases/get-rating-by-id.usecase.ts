import type { IGarageRatingRepository } from '../../domain/repositories/garage-rating.repository.interface';

export class GetRatingByIdUseCase {
  constructor(private readonly repository: IGarageRatingRepository) {}

  async execute(garageId: string, ratingId: string): Promise<unknown> {
    return this.repository.getById(garageId, ratingId);
  }
}

import type { GarageRatingSummary } from '../../domain/repositories/garage-rating.repository.interface';
import type { IGarageRatingRepository } from '../../domain/repositories/garage-rating.repository.interface';

export class GetGarageRatingSummaryUseCase {
  constructor(private readonly repository: IGarageRatingRepository) {}

  async execute(garageId: string): Promise<GarageRatingSummary> {
    return this.repository.getSummary(garageId);
  }
}

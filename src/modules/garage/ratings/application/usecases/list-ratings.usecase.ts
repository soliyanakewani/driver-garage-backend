import type { IGarageRatingRepository } from '../../domain/repositories/garage-rating.repository.interface';

export class ListRatingsUseCase {
  constructor(private readonly repository: IGarageRatingRepository) {}

  async execute(garageId: string): Promise<unknown[]> {
    return this.repository.listByGarageId(garageId);
  }
}

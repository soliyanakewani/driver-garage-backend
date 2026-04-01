import type { IGarageProfileRepository } from '../../domain/repositories/garage-profile.repository.interface';

export class GetProfileUseCase {
  constructor(private readonly repository: IGarageProfileRepository) {}

  async execute(garageId: string): Promise<unknown> {
    return this.repository.getByGarageId(garageId);
  }
}

import type { IGarageProfileRepository, GarageProfileUpdateData } from '../../domain/repositories/garage-profile.repository.interface';

export class UpdateProfileUseCase {
  constructor(private readonly repository: IGarageProfileRepository) {}

  async execute(garageId: string, data: GarageProfileUpdateData): Promise<unknown> {
    return this.repository.update(garageId, data);
  }
}

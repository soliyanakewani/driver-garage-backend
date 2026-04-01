import type { IGarageSettingsRepository } from '../../domain/repositories/garage-settings.repository.interface';

export class GetSettingsUseCase {
  constructor(private readonly repository: IGarageSettingsRepository) {}

  async execute(garageId: string): Promise<unknown> {
    return this.repository.getByGarageId(garageId);
  }
}

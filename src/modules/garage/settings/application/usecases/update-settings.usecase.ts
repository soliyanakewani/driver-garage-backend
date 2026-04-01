import type { IGarageSettingsRepository } from '../../domain/repositories/garage-settings.repository.interface';

export class UpdateSettingsUseCase {
  constructor(private readonly repository: IGarageSettingsRepository) {}

  async execute(garageId: string, data: Record<string, unknown>): Promise<unknown> {
    return this.repository.update(garageId, data);
  }
}

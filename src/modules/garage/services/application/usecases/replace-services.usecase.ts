import { IGarageServiceRepository } from '../../domain/repositories/garage-service.repository.interface';
import { GarageService } from '../../domain/entities/garage-service.entity';

export class ReplaceGarageServicesUseCase {
  constructor(private readonly repository: IGarageServiceRepository) {}

  async execute(input: { garageId: string; services: string[] }): Promise<GarageService[]> {
    return this.repository.replaceAllForGarage(input.garageId, input.services);
  }
}

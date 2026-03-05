import { IGarageServiceRepository } from '../../domain/repositories/garage-service.repository.interface';
import { GarageService } from '../../domain/entities/garage-service.entity';

export class ListGarageServicesUseCase {
  constructor(private readonly repository: IGarageServiceRepository) {}

  async execute(input: { garageId: string }): Promise<GarageService[]> {
    return this.repository.listByGarageId(input.garageId);
  }
}

import { IGarageServiceRepository } from '../../domain/repositories/garage-service.repository.interface';
import { GarageService } from '../../domain/entities/garage-service.entity';

export class CreateGarageServiceUseCase {
  constructor(private readonly repository: IGarageServiceRepository) {}

  async execute(input: { garageId: string; name: string }): Promise<GarageService> {
    return this.repository.create({ garageId: input.garageId, name: input.name.trim() });
  }
}

import { IGarageServiceRepository } from '../../domain/repositories/garage-service.repository.interface';
import { GarageService } from '../../domain/entities/garage-service.entity';

export class UpdateGarageServiceUseCase {
  constructor(private readonly repository: IGarageServiceRepository) {}

  async execute(input: {
    garageId: string;
    serviceId: string;
    updates: { name?: string };
  }): Promise<GarageService> {
    const current = await this.repository.findById(input.serviceId, input.garageId);
    if (!current) throw new Error('Service not found');
    return this.repository.update(input.serviceId, input.garageId, input.updates);
  }
}

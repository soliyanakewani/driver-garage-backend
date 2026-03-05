import { IGarageServiceRepository } from '../../domain/repositories/garage-service.repository.interface';

export class DeleteGarageServiceUseCase {
  constructor(private readonly repository: IGarageServiceRepository) {}

  async execute(input: { garageId: string; serviceId: string }): Promise<void> {
    return this.repository.delete(input.serviceId, input.garageId);
  }
}

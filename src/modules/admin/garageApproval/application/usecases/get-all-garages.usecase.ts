import { Garage } from '../../domain/entities/garage-approval.entity';
import { GarageRepository } from '../../domain/repositories/garage-approval.repository.interface';

export class GetAllGaragesUseCase {
  constructor(private readonly garageRepo: GarageRepository) {}

  async execute(): Promise<Garage[]> {
    return this.garageRepo.findAll();
  }
}
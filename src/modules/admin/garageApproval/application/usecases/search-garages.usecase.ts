import { Garage } from '../../domain/entities/garage-approval.entity';
import { GarageRepository } from '../../domain/repositories/garage-approval.repository.interface';

export class SearchGaragesUseCase {
  constructor(private readonly garageRepo: GarageRepository) {}

  async execute(query: string): Promise<Garage[]> {
    return this.garageRepo.search(query);
  }
}
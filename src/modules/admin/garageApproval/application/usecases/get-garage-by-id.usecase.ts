import { Garage } from '../../domain/entities/garage-approval.entity';
import { GarageRepository } from '../../domain/repositories/garage-approval.repository.interface';

export class GetGarageByIdUseCase {
  constructor(private readonly garageRepo: GarageRepository) {}

  async execute(id: string): Promise<Garage | null> {
    return this.garageRepo.findById(id);
  }
}
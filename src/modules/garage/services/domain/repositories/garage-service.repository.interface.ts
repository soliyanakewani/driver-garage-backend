import { GarageService } from '../entities/garage-service.entity';

export interface IGarageServiceRepository {
  listByGarageId(garageId: string): Promise<GarageService[]>;

  create(input: { garageId: string; name: string }): Promise<GarageService>;

  update(serviceId: string, garageId: string, updates: { name?: string }): Promise<GarageService>;

  delete(serviceId: string, garageId: string): Promise<void>;

  findById(serviceId: string, garageId: string): Promise<GarageService | null>;
}

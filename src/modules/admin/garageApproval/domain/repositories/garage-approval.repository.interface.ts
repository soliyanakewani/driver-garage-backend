import { Garage } from '../entities/garage-approval.entity';

export interface GarageRepository {
  findAll(): Promise<Garage[]>;
  findById(id: string): Promise<Garage | null>;
  search(query: string): Promise<Garage[]>;
  approve(id: string): Promise<Garage>;
  reject(id: string): Promise<Garage>;
}
import { IVehicleRepository } from '../../domain/repositories/vehicle.repository.interface';
import { Vehicle } from '../../domain/entities/vehicle.entity';

export class GetVehicleByIdUseCase {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async execute(driverId: string, vehicleId: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne(driverId, vehicleId);
    if (!vehicle) throw new Error('Vehicle not found');
    return vehicle;
  }
}

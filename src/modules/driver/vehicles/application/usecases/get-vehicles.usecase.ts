import { IVehicleRepository } from '../../domain/repositories/vehicle.repository.interface';
import { Vehicle } from '../../domain/entities/vehicle.entity';

export class GetVehiclesUseCase {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async execute(driverId: string): Promise<Vehicle[]> {
    return this.vehicleRepository.findAllByDriverId(driverId);
  }
}

import { IVehicleRepository } from '../../domain/repositories/vehicle.repository.interface';

export class DeleteVehicleUseCase {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async execute(driverId: string, vehicleId: string): Promise<{ message: string }> {
    await this.vehicleRepository.findOne(driverId, vehicleId);
    await this.vehicleRepository.delete(vehicleId);
    return { message: 'Vehicle deleted successfully' };
  }
}

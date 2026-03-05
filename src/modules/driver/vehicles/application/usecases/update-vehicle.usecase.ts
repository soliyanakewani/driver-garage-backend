import { IVehicleRepository } from '../../domain/repositories/vehicle.repository.interface';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { UpdateVehicleDTO } from '../dto/update-vehicle.dto';

export class UpdateVehicleUseCase {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async execute(driverId: string, vehicleId: string, dto: UpdateVehicleDTO): Promise<Vehicle> {
    await this.vehicleRepository.findOne(driverId, vehicleId);

    if (
      dto.year !== undefined &&
      (typeof dto.year !== 'number' ||
        dto.year < 1900 ||
        dto.year > new Date().getFullYear() + 1)
    ) {
      throw new Error('Valid year is required');
    }
    if (dto.plateNumber !== undefined) {
      const all = await this.vehicleRepository.findAllByDriverId(driverId);
      const plate = dto.plateNumber.trim();
      const duplicate = all.find((v) => v.id !== vehicleId && v.plateNumber === plate);
      if (duplicate) throw new Error('Another vehicle with this plate number already exists');
    }

    return this.vehicleRepository.update(vehicleId, {
      ...(dto.plateNumber !== undefined && { plateNumber: dto.plateNumber.trim() }),
      ...(dto.make !== undefined && { make: dto.make.trim() }),
      ...(dto.model !== undefined && { model: dto.model.trim() }),
      ...(dto.type !== undefined && { type: dto.type?.trim() || null }),
      ...(dto.year !== undefined && { year: dto.year }),
      ...(dto.color !== undefined && { color: dto.color?.trim() || null }),
    });
  }
}

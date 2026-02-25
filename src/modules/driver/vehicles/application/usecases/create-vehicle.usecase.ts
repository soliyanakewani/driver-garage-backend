import { IVehicleRepository } from '../../domain/repositories/vehicle.repository.interface';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { CreateVehicleDTO } from '../dto/create-vehicle.dto';

export class CreateVehicleUseCase {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async execute(driverId: string, dto: CreateVehicleDTO): Promise<Vehicle> {
    if (!dto.plateNumber?.trim()) throw new Error('Plate number is required');
    if (!dto.make?.trim()) throw new Error('Make is required');
    if (!dto.model?.trim()) throw new Error('Model is required');
    if (
      dto.year == null ||
      typeof dto.year !== 'number' ||
      dto.year < 1900 ||
      dto.year > new Date().getFullYear() + 1
    ) {
      throw new Error('Valid year is required');
    }

    const existing = await this.vehicleRepository.findAllByDriverId(driverId);
    const plate = dto.plateNumber.trim();
    const duplicate = existing.find((v) => v.plateNumber === plate);
    if (duplicate) throw new Error('A vehicle with this plate number is already registered');

    return this.vehicleRepository.create({
      driverId,
      plateNumber: dto.plateNumber.trim(),
      make: dto.make.trim(),
      model: dto.model.trim(),
      type: dto.type?.trim() || null,
      year: dto.year,
      color: dto.color?.trim() || null,
    });
  }
}

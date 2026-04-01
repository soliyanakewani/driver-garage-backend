import { IVehicleRepository } from '../../domain/repositories/vehicle.repository.interface';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { CreateVehicleDTO } from '../dto/create-vehicle.dto';

function parseDate(value: string | Date | undefined): Date | null {
  if (value == null) return null;
  if (value instanceof Date) return value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseNumber(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string') {
    const n = parseInt(value, 10);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

export class CreateVehicleUseCase {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async execute(driverId: string, dto: CreateVehicleDTO): Promise<Vehicle> {
    if (!dto.plateNumber?.trim()) throw new Error('Plate number is required');
    if (!dto.make?.trim()) throw new Error('Make is required');
    if (!dto.model?.trim()) throw new Error('Model is required');
    const yearNum = typeof dto.year === 'number' ? dto.year : parseNumber(dto.year);
    if (yearNum == null || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      throw new Error('Valid year is required');
    }
    const year = yearNum;

    const vin = dto.vin?.trim() || null;
    if (vin != null && vin.length !== 17) {
      throw new Error('VIN must be 17 characters');
    }

    const mileage =
      dto.mileage != null
        ? typeof dto.mileage === 'number'
          ? dto.mileage
          : parseNumber(dto.mileage)
        : null;
    if (mileage != null && (mileage < 0 || mileage > 9999999)) {
      throw new Error('Mileage must be between 0 and 9999999');
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
      year,
      color: dto.color?.trim() || null,
      vin: vin || null,
      mileage: mileage ?? null,
      fuelType: dto.fuelType?.trim() || null,
      imageUrl: dto.imageUrl?.trim() || null,
      insuranceDocumentUrl: dto.insuranceDocumentUrl?.trim() || null,
      insuranceExpiresAt: parseDate(dto.insuranceExpiresAt),
      registrationDocumentUrl: dto.registrationDocumentUrl?.trim() || null,
      registrationExpiresAt: parseDate(dto.registrationExpiresAt),
    });
  }
}

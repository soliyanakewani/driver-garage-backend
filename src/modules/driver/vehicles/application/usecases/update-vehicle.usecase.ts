import { IVehicleRepository } from '../../domain/repositories/vehicle.repository.interface';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { UpdateVehicleDTO } from '../dto/update-vehicle.dto';

function parseDate(value: string | Date | undefined): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value == null) return null;
  if (value instanceof Date) return value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function parseNumber(value: unknown): number | null | undefined {
  if (value === undefined) return undefined;
  if (value == null) return null;
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string') {
    const n = parseInt(value, 10);
    return Number.isNaN(n) ? undefined : n;
  }
  return undefined;
}

export class UpdateVehicleUseCase {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  async execute(driverId: string, vehicleId: string, dto: UpdateVehicleDTO): Promise<Vehicle> {
    await this.vehicleRepository.findOne(driverId, vehicleId);

    if (dto.year !== undefined) {
      const y = typeof dto.year === 'number' ? dto.year : parseNumber(dto.year);
      if (y == null || y < 1900 || y > new Date().getFullYear() + 1) {
        throw new Error('Valid year is required');
      }
    }
    if (dto.vin !== undefined && dto.vin !== null && dto.vin.trim().length > 0 && dto.vin.trim().length !== 17) {
      throw new Error('VIN must be 17 characters');
    }
    if (dto.mileage !== undefined && dto.mileage != null) {
      const m = typeof dto.mileage === 'number' ? dto.mileage : parseNumber(dto.mileage);
      if (m != null && (m < 0 || m > 9999999)) throw new Error('Mileage must be between 0 and 9999999');
    }
    if (dto.plateNumber !== undefined) {
      const all = await this.vehicleRepository.findAllByDriverId(driverId);
      const plate = dto.plateNumber.trim();
      const duplicate = all.find((v) => v.id !== vehicleId && v.plateNumber === plate);
      if (duplicate) throw new Error('Another vehicle with this plate number already exists');
    }

    const year =
      dto.year !== undefined
        ? (typeof dto.year === 'number' ? dto.year : parseNumber(dto.year)) ?? undefined
        : undefined;
    const mileage =
      dto.mileage !== undefined
        ? (typeof dto.mileage === 'number' ? dto.mileage : parseNumber(dto.mileage)) ?? undefined
        : undefined;

    return this.vehicleRepository.update(vehicleId, {
      ...(dto.plateNumber !== undefined && { plateNumber: dto.plateNumber.trim() }),
      ...(dto.make !== undefined && { make: dto.make.trim() }),
      ...(dto.model !== undefined && { model: dto.model.trim() }),
      ...(dto.type !== undefined && { type: dto.type?.trim() || null }),
      ...(year !== undefined && { year }),
      ...(dto.color !== undefined && { color: dto.color?.trim() || null }),
      ...(dto.vin !== undefined && { vin: dto.vin?.trim() || null }),
      ...(mileage !== undefined && { mileage }),
      ...(dto.fuelType !== undefined && { fuelType: dto.fuelType?.trim() || null }),
      ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl?.trim() || null }),
      ...(dto.insuranceDocumentUrl !== undefined && { insuranceDocumentUrl: dto.insuranceDocumentUrl?.trim() || null }),
      ...(dto.insuranceExpiresAt !== undefined && { insuranceExpiresAt: parseDate(dto.insuranceExpiresAt) }),
      ...(dto.registrationDocumentUrl !== undefined && { registrationDocumentUrl: dto.registrationDocumentUrl?.trim() || null }),
      ...(dto.registrationExpiresAt !== undefined && { registrationExpiresAt: parseDate(dto.registrationExpiresAt) }),
    });
  }
}

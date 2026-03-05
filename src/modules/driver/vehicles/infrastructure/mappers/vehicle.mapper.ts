import { Vehicle as PrismaVehicle } from '@prisma/client';
import { Vehicle } from '../../domain/entities/vehicle.entity';

export function toDomain(raw: PrismaVehicle): Vehicle {
  return {
    id: raw.id,
    driverId: raw.driverId,
    plateNumber: raw.plateNumber,
    make: raw.make,
    model: raw.model,
    type: raw.type,
    year: raw.year,
    color: raw.color,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

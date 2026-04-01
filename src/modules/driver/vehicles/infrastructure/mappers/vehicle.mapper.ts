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
    vin: raw.vin,
    mileage: raw.mileage,
    fuelType: raw.fuelType,
    imageUrl: raw.imageUrl,
    insuranceDocumentUrl: raw.insuranceDocumentUrl,
    insuranceExpiresAt: raw.insuranceExpiresAt,
    registrationDocumentUrl: raw.registrationDocumentUrl,
    registrationExpiresAt: raw.registrationExpiresAt,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

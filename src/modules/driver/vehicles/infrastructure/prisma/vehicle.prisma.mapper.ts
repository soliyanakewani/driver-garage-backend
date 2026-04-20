import {
  CreateVehicleData,
  UpdateVehicleData,
} from '../../domain/repositories/vehicle.repository.interface';

export function toPrismaCreateData(data: CreateVehicleData) {
  return {
    driverId: data.driverId,
    plateNumber: data.plateNumber,
    make: data.make,
    model: data.model,
    type: data.type,
    year: data.year,
    color: data.color,
    ...(data.vin != null && { vin: data.vin }),
    ...(data.mileage != null && { mileage: data.mileage }),
    ...(data.fuelType != null && { fuelType: data.fuelType }),
    ...(data.imageUrl != null && { imageUrl: data.imageUrl }),
    ...(data.insuranceDocumentUrl != null && { insuranceDocumentUrl: data.insuranceDocumentUrl }),
    ...(data.insuranceExpiresAt != null && { insuranceExpiresAt: data.insuranceExpiresAt }),
    ...(data.registrationDocumentUrl != null && { registrationDocumentUrl: data.registrationDocumentUrl }),
    ...(data.registrationExpiresAt != null && { registrationExpiresAt: data.registrationExpiresAt }),
  };
}

export function toPrismaUpdateData(data: UpdateVehicleData) {
  return {
    ...(data.plateNumber !== undefined && { plateNumber: data.plateNumber }),
    ...(data.make !== undefined && { make: data.make }),
    ...(data.model !== undefined && { model: data.model }),
    ...(data.type !== undefined && { type: data.type }),
    ...(data.year !== undefined && { year: data.year }),
    ...(data.color !== undefined && { color: data.color }),
    ...(data.vin !== undefined && { vin: data.vin }),
    ...(data.mileage !== undefined && { mileage: data.mileage }),
    ...(data.fuelType !== undefined && { fuelType: data.fuelType }),
    ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
    ...(data.insuranceDocumentUrl !== undefined && { insuranceDocumentUrl: data.insuranceDocumentUrl }),
    ...(data.insuranceExpiresAt !== undefined && { insuranceExpiresAt: data.insuranceExpiresAt }),
    ...(data.registrationDocumentUrl !== undefined && { registrationDocumentUrl: data.registrationDocumentUrl }),
    ...(data.registrationExpiresAt !== undefined && { registrationExpiresAt: data.registrationExpiresAt }),
  };
}

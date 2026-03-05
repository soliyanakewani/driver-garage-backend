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
  };
}

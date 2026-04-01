import { Vehicle } from '../entities/vehicle.entity';

export interface CreateVehicleData {
  driverId: string;
  plateNumber: string;
  make: string;
  model: string;
  type: string | null;
  year: number;
  color: string | null;
  vin: string | null;
  mileage: number | null;
  fuelType: string | null;
  imageUrl: string | null;
  insuranceDocumentUrl: string | null;
  insuranceExpiresAt: Date | null;
  registrationDocumentUrl: string | null;
  registrationExpiresAt: Date | null;
}

export interface UpdateVehicleData {
  plateNumber?: string;
  make?: string;
  model?: string;
  type?: string | null;
  year?: number;
  color?: string | null;
  vin?: string | null;
  mileage?: number | null;
  fuelType?: string | null;
  imageUrl?: string | null;
  insuranceDocumentUrl?: string | null;
  insuranceExpiresAt?: Date | null;
  registrationDocumentUrl?: string | null;
  registrationExpiresAt?: Date | null;
}

export interface IVehicleRepository {
  create(data: CreateVehicleData): Promise<Vehicle>;
  findAllByDriverId(driverId: string): Promise<Vehicle[]>;
  findOne(driverId: string, vehicleId: string): Promise<Vehicle | null>;
  update(vehicleId: string, data: UpdateVehicleData): Promise<Vehicle>;
  delete(vehicleId: string): Promise<void>;
}

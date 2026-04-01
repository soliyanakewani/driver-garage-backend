export interface UpdateVehicleDTO {
  plateNumber?: string;
  make?: string;
  model?: string;
  type?: string;
  year?: number;
  color?: string;
  vin?: string;
  mileage?: number;
  fuelType?: string;
  imageUrl?: string;
  insuranceDocumentUrl?: string;
  insuranceExpiresAt?: string | Date;
  registrationDocumentUrl?: string;
  registrationExpiresAt?: string | Date;
}

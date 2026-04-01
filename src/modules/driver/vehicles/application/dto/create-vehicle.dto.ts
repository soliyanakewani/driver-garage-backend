export interface CreateVehicleDTO {
  plateNumber: string;
  make: string;
  model: string;
  type?: string;
  year: number;
  color?: string;
  /** 17-character VIN */
  vin?: string;
  /** Current mileage in miles */
  mileage?: number;
  fuelType?: string;
  imageUrl?: string;
  /** URL/path after upload; or set when using multipart */
  insuranceDocumentUrl?: string;
  insuranceExpiresAt?: string | Date;
  registrationDocumentUrl?: string;
  registrationExpiresAt?: string | Date;
}

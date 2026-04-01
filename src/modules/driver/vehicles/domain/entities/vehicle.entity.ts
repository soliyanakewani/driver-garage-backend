export interface Vehicle {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}

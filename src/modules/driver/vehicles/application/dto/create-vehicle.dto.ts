export interface CreateVehicleDTO {
  plateNumber: string;
  make: string;
  model: string;
  type?: string;
  year: number;
  color?: string;
}

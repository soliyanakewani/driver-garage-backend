export interface Vehicle {
  id: string;
  driverId: string;
  plateNumber: string;
  make: string;
  model: string;
  type: string | null;
  year: number;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

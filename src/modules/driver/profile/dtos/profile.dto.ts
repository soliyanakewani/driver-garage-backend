export interface DriverProfileDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface DriverProfileResponseDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

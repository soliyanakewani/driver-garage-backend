/** Body for PUT /garage/profile */
export interface GarageProfileDTO {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface GarageProfileServiceItem {
  id: string;
  garageId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GarageProfileAvailabilitySlot {
  id: string;
  garageId: string;
  dayOfWeek: string;
  startMinute: number;
  endMinute: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GarageProfileResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  businessDocumentUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  services: GarageProfileServiceItem[];
  availabilitySlots: GarageProfileAvailabilitySlot[];
}

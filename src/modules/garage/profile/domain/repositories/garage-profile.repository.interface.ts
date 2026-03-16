export interface GarageProfileUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface IGarageProfileRepository {
  getByGarageId(garageId: string): Promise<unknown>;
  update(garageId: string, data: GarageProfileUpdateData): Promise<unknown>;
}

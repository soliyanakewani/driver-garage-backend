import { Garage } from '../../domain/entities/garage-approval.entity';

export class GarageMapper {
  static toResponse(garage: Garage) {
    return {
      id: garage.id,
      name: garage.name,
      email: garage.email,
      phone: garage.phone,
      status: garage.status,
      createdAt: garage.createdAt,
    };
  }

  static toResponseList(garages: Garage[]) {
    return garages.map(this.toResponse);
  }
}
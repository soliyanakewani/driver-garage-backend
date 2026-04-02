import { Garage } from '../../domain/entities/garage-approval.entity';

export class GarageMapper {
  static toResponse(garage: Garage) {
    return {
      id: garage.id,
      name: garage.name,
      email: garage.email,
      phone: garage.phone,
      status: garage.status,
      address: garage.address,
      latitude: garage.latitude,
      longitude: garage.longitude,
      businessDocumentUrl: garage.businessDocumentUrl,
      createdAt: garage.createdAt,
    };
  }

  static toResponseList(garages: Garage[]) {
    return garages.map(this.toResponse);
  }
}
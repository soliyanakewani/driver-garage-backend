import { Garage as PrismaGarage } from '@prisma/client';
import { Garage } from '../../domain/entities/garage-approval.entity';

export class GaragePrismaMapper {
  static toDomain(raw: PrismaGarage): Garage {
    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      status: raw.status,
      address: raw.address,
      latitude: raw.latitude,
      longitude: raw.longitude,
      businessDocumentUrl: raw.businessDocumentUrl,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
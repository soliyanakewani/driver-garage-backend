import { prisma } from '../../../../../infrastructure/prisma/prisma.client';
import { GarageService } from '../../domain/entities/garage-service.entity';
import { IGarageServiceRepository } from '../../domain/repositories/garage-service.repository.interface';

interface PrismaServiceRow {
  id: string;
  garageId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

function mapFromPrisma(row: PrismaServiceRow): GarageService {
  return GarageService.create({
    id: row.id,
    garageId: row.garageId,
    name: row.name,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export class PrismaGarageServiceRepository implements IGarageServiceRepository {
  async listByGarageId(garageId: string): Promise<GarageService[]> {
    const rows = await prisma.garageService.findMany({
      where: { garageId },
      orderBy: { name: 'asc' },
    });
    return (rows as PrismaServiceRow[]).map(mapFromPrisma);
  }

  async findById(serviceId: string, garageId: string): Promise<GarageService | null> {
    const row = await prisma.garageService.findFirst({
      where: { id: serviceId, garageId },
    });
    return row ? mapFromPrisma(row as PrismaServiceRow) : null;
  }

  async create(input: { garageId: string; name: string }): Promise<GarageService> {
    const row = await prisma.garageService.create({
      data: { garageId: input.garageId, name: input.name },
    });
    return mapFromPrisma(row as PrismaServiceRow);
  }

  async update(
    serviceId: string,
    garageId: string,
    updates: { name?: string }
  ): Promise<GarageService> {
    const row = await prisma.garageService.update({
      where: { id: serviceId },
      data: { ...(updates.name !== undefined && { name: updates.name }) },
    });
    if (row.garageId !== garageId) throw new Error('Service not found');
    return mapFromPrisma(row as PrismaServiceRow);
  }

  async delete(serviceId: string, garageId: string): Promise<void> {
    const existing = await this.findById(serviceId, garageId);
    if (!existing) throw new Error('Service not found');
    await prisma.garageService.delete({ where: { id: serviceId } });
  }
}

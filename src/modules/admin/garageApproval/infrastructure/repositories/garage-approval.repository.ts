import { prisma } from '../../../../../infrastructure/prisma/prisma.client';
import { GarageRepository } from '../../domain/repositories/garage-approval.repository.interface';
import { Garage } from '../../domain/entities/garage-approval.entity';
import { GaragePrismaMapper } from '../prisma/garage-approval.prisma.mapper';


export class GarageRepositoryImpl implements GarageRepository {

  async findAll(): Promise<Garage[]> {
    const garages = await prisma.garage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return garages.map(GaragePrismaMapper.toDomain);
  }

  async findById(id: string): Promise<Garage | null> {
    const garage = await prisma.garage.findUnique({
      where: { id },
    });

    return garage ? GaragePrismaMapper.toDomain(garage) : null;
  }

  async search(query: string): Promise<Garage[]> {
    const allowedStatuses = ['PENDING', 'ACTIVE', 'REJECTED', 'BLOCKED', 'WARNED'];

    const statusFilter = allowedStatuses.includes(query.toUpperCase())
      ? { status: query.toUpperCase() as any }
      : undefined;

    const garages = await prisma.garage.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          ...(statusFilter ? [statusFilter] : []),
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return garages.map(GaragePrismaMapper.toDomain);
  }

  async approve(id: string): Promise<Garage> {
    const garage = await prisma.garage.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });

    return GaragePrismaMapper.toDomain(garage);
  }

  async reject(id: string): Promise<Garage> {
    const garage = await prisma.garage.update({
      where: { id },
      data: { status: 'REJECTED' },
    });

    return GaragePrismaMapper.toDomain(garage);
  }
}
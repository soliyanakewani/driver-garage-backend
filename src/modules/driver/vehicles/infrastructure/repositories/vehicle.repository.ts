import { prisma } from '../../../../../infrastructure/prisma/prisma.client';
import {
  IVehicleRepository,
  CreateVehicleData,
  UpdateVehicleData,
} from '../../domain/repositories/vehicle.repository.interface';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { toDomain } from '../mappers/vehicle.mapper';
import { toPrismaCreateData, toPrismaUpdateData } from '../prisma/vehicle.prisma.mapper';

export class VehicleRepository implements IVehicleRepository {
  async create(data: CreateVehicleData): Promise<Vehicle> {
    const raw = await prisma.vehicle.create({
      data: toPrismaCreateData(data),
    });
    return toDomain(raw);
  }

  async findAllByDriverId(driverId: string): Promise<Vehicle[]> {
    const list = await prisma.vehicle.findMany({
      where: { driverId },
      orderBy: { createdAt: 'desc' },
    });
    return list.map(toDomain);
  }

  async findOne(driverId: string, vehicleId: string): Promise<Vehicle | null> {
    const raw = await prisma.vehicle.findFirst({
      where: { id: vehicleId, driverId },
    });
    return raw ? toDomain(raw) : null;
  }

  async update(vehicleId: string, data: UpdateVehicleData): Promise<Vehicle> {
    const raw = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: toPrismaUpdateData(data),
    });
    return toDomain(raw);
  }

  async delete(vehicleId: string): Promise<void> {
    await prisma.vehicle.delete({ where: { id: vehicleId } });
  }
}

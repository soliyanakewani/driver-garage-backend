import { PrismaClient, AccountStatus, Role } from "@prisma/client";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/types/User";

const prisma = new PrismaClient();

export class PrismaUserRepository implements UserRepository {
  async findAll(search?: string, 
    page: number = 1, 
    limit: number = 10
): Promise<User[]> {
    const drivers = await prisma.driver.findMany({
        where: search
        ? {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },  
            ],
        } 
        : undefined,
        skip: (page - 1) * limit,
        take: limit,
        select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        createdAt: true,
      },
    });

    const garages = await prisma.garage.findMany({
        where: search 
         ? {
            OR: [
               { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
            ],
         }
         : undefined,
         skip: (page - 1) * limit,
         take: limit,
        select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
      },
    });

    const formattedDrivers: User[] = drivers.map((d) => ({
      id: d.id,
      name: `${d.firstName} ${d.lastName}`,
      email: d.email,
      role: Role.DRIVER,
      status: d.status,
      createdAt: d.createdAt,
    }));

    const formattedGarages: User[] = garages.map((g) => ({
      id: g.id,
      name: g.name,
      email: g.email,
      role: Role.GARAGE,
      status: g.status,
      createdAt: g.createdAt,
    }));

    return [...formattedDrivers, ...formattedGarages];
  }

  async updateStatus(
    userId: string,
    role: string,
    status: AccountStatus
  ): Promise<void> {
    if (role === Role.DRIVER) {
      await prisma.driver.update({
        where: { id: userId },
        data: { status },
      });
    } else if (role === Role.GARAGE) {
      await prisma.garage.update({
        where: { id: userId },
        data: { status },
      });
    } else {
      throw new Error("Invalid role for status update");
    }
  }

  async delete(userId: string, role: string): Promise<void> {
    if (role === Role.DRIVER) {
      await prisma.driver.delete({
        where: { id: userId },
      });
    } else if (role === Role.GARAGE) {
      await prisma.garage.delete({
        where: { id: userId },
      });
    } else {
      throw new Error("Invalid role for delete");
    }
  }

  async getStats() {
  const drivers = await prisma.driver.findMany({
    select: { status: true },
  });

  const garages = await prisma.garage.findMany({
    select: { status: true },
  });

  const all = [...drivers, ...garages];

  return {
    total: all.length,
    active: all.filter(u => u.status === "ACTIVE").length,
    warned: all.filter(u => u.status === "WARNED").length,
    blocked: all.filter(u => u.status === "BLOCKED").length,
  };
}
}

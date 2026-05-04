import { prisma } from '../../../../../infrastructure/prisma/prisma.client';
import { EducationContentRepository } from '../../domain/repositories/educational-content.repository.interface';
import { EducationCategory, EducationContent } from '../../domain/entities/educational-content.entity';
import { EducationContentPrismaMapper } from '../prisma/educational-content.prisma.mapper';

export class EducationContentRepositoryImpl
  implements EducationContentRepository
{
  async create(
    data: Omit<EducationContent, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<EducationContent> {
    const created = await prisma.educationContent.create({
      data: EducationContentPrismaMapper.toPrisma(data),
    });

    const activeDrivers = await prisma.driver.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true },
    });
    const activeGarages = await prisma.garage.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true },
    });

    if (activeDrivers.length > 0) {
      await prisma.driverNotification.createMany({
        data: activeDrivers.map((driver) => ({
          driverId: driver.id,
          title: `New education content: ${created.title}`,
          body: `A new ${created.category} education article has been published.`,
        })),
      });
    }
    if (activeGarages.length > 0) {
      await prisma.garageNotification.createMany({
        data: activeGarages.map((garage) => ({
          garageId: garage.id,
          title: `New education content: ${created.title}`,
          body: `A new ${created.category} education article was published for platform users.`,
        })),
      });
    }

    return EducationContentPrismaMapper.toDomain(created);
  }

  async findById(id: string): Promise<EducationContent | null> {
    const record = await prisma.educationContent.findUnique({
      where: { id },
    });

    return record ? EducationContentPrismaMapper.toDomain(record) : null;
  }

  async findAll(category?: EducationCategory): Promise<EducationContent[]> {
    const orderBy =
      category === EducationCategory.MANUALS
        ? ({ title: 'asc' } as const)
        : ({ createdAt: 'desc' } as const);

    const records = await prisma.educationContent.findMany({
      where: category ? { category } : undefined,
      orderBy,
    });

    return records.map(EducationContentPrismaMapper.toDomain);
  }

  async update(
    id: string,
    data: Partial<Omit<EducationContent, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<EducationContent> {
    const updated = await prisma.educationContent.update({
      where: { id },
      data: EducationContentPrismaMapper.toPrismaUpdate(data),
    });

    return EducationContentPrismaMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.educationContent.delete({
      where: { id },
    });
  }

  async search(query: string): Promise<EducationContent[]> {
    if (!query?.trim()) return [];

    const category = Object.values(EducationCategory).find(
      (cat) => cat.toLowerCase() === query.toLowerCase()
    );

    const records = await prisma.educationContent.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          ...(category ? [{ category }] : []),
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return records.map(EducationContentPrismaMapper.toDomain);
  }
}
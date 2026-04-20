import { Prisma } from '@prisma/client';
import { EducationContent, EducationCategory } from '../../domain/entities/educational-content.entity';

export class EducationContentPrismaMapper {
  static toDomain(raw: any): EducationContent {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      category: raw.category as EducationCategory,
      image: raw.imageUrl,
      pdf: raw.pdfUrl ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  static toPrisma(
    entity: Omit<EducationContent, 'id' | 'createdAt' | 'updatedAt'>
  ): Prisma.EducationContentCreateInput {
    return {
      title: entity.title,
      description: entity.description,
      category: entity.category,
      imageUrl: entity.image ?? null,
      pdfUrl: entity.pdf ?? null,
    };
  }

  static toPrismaUpdate(
    data: Partial<Omit<EducationContent, 'id' | 'createdAt' | 'updatedAt'>>
  ): Prisma.EducationContentUpdateInput {
    const out: Prisma.EducationContentUpdateInput = {};
    if (data.title !== undefined) out.title = data.title;
    if (data.description !== undefined) out.description = data.description;
    if (data.category !== undefined) out.category = data.category;
    if (data.image !== undefined) out.imageUrl = data.image;
    if (data.pdf !== undefined) out.pdfUrl = data.pdf;
    return out;
  }
}

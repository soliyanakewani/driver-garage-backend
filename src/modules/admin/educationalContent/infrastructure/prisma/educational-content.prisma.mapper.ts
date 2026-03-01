import { EducationContent, EducationCategory } from '../../domain/entities/educational-content.entity';
export class EducationContentPrismaMapper {
  static toDomain(raw: any): EducationContent {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      category: raw.category as EducationCategory,
      image: raw.imageUrl,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  static toPrisma(
    entity: Omit<EducationContent, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    return {
      title: entity.title,
      description: entity.description,
      category: entity.category,
      imageUrl: entity.image ?? null,
    };
  }
}
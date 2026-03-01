import { EducationContent, EducationCategory } from '../../domain/entities/educational-content.entity';
import { EducationContent as PrismaEducationContent } from '@prisma/client';

export class EducationContentMapper {
  static toDomain(raw: PrismaEducationContent): EducationContent {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      category: (raw.category as EducationCategory) ?? EducationCategory.ALL,
      image: raw.imageUrl,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  static toDomainList(rawList: PrismaEducationContent[]): EducationContent[] {
    return rawList.map(this.toDomain);
  }

  static toPersistence(entity: Partial<EducationContent>) {
    return {
      title: entity.title,
      description: entity.description,
      category: entity.category,
      imageUrl: entity.image,
    };
  }

  static toResponse(entity: EducationContent) {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      category: entity.category,
      image: entity.image,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toResponseList(contents: EducationContent[]) {
      return contents.map(this.toResponse);
    }
}
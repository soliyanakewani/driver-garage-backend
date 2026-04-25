import { EducationContent, EducationCategory } from '../../domain/entities/educational-content.entity';
import { EducationContent as PrismaEducationContent } from '@prisma/client';

function normalizePublicUrl(value: string | null | undefined, kind: 'image' | 'pdf'): string | null {
  if (!value) return null;
  const raw = value.trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;

  const configuredBase =
    process.env.PUBLIC_BASE_URL?.trim() ||
    process.env.RENDER_EXTERNAL_URL?.trim() ||
    '';

  if (raw.startsWith('/uploads/')) {
    return configuredBase ? `${configuredBase.replace(/\/$/, '')}${raw}` : raw;
  }

  // Backward compatibility for rows that accidentally stored only filenames.
  const prefix = kind === 'pdf' ? '/uploads/education-manuals/' : '/uploads/education-images/';
  const normalized = `${prefix}${raw.replace(/^\/+/, '')}`;
  return configuredBase ? `${configuredBase.replace(/\/$/, '')}${normalized}` : normalized;
}

export class EducationContentMapper {
  static toDomain(raw: PrismaEducationContent & { pdfUrl?: string | null }): EducationContent {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      category: (raw.category as EducationCategory) ?? EducationCategory.ALL,
      image: raw.imageUrl,
      pdf: raw.pdfUrl ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  static toDomainList(rawList: Array<PrismaEducationContent & { pdfUrl?: string | null }>): EducationContent[] {
    return rawList.map(this.toDomain);
  }

  static toPersistence(entity: Partial<EducationContent>) {
    return {
      title: entity.title,
      description: entity.description,
      category: entity.category,
      imageUrl: entity.image,
      pdfUrl: entity.pdf,
    };
  }

  static toResponse(entity: EducationContent) {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      category: entity.category,
      image: normalizePublicUrl(entity.image, 'image'),
      pdf: normalizePublicUrl(entity.pdf, 'pdf'),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toResponseList(contents: EducationContent[]) {
      return contents.map(this.toResponse);
    }
}
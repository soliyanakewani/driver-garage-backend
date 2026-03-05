import { EducationContent, EducationCategory } from '../entities/educational-content.entity';

export interface EducationContentRepository {
  create(
    data: Omit<EducationContent, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<EducationContent>;

  findById(id: string): Promise<EducationContent | null>;

  findAll(): Promise<EducationContent[]>;

  update(
    id: string,
    data: Partial<Omit<EducationContent, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<EducationContent>;

  delete(id: string): Promise<void>;

  search(query: string): Promise<EducationContent[]>;

}
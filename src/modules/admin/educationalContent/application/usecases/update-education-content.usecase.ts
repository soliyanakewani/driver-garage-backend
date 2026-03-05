import { EducationContent } from "../../domain/entities/educational-content.entity";
import { EducationContentRepository } from "../../domain/repositories/educational-content.repository.interface";

export class UpdateEducationContentUseCase {
  constructor(
    private readonly repository: EducationContentRepository
  ) {}

  async execute(
    id: string,
    data: Partial<Omit<EducationContent, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<EducationContent> {
    return this.repository.update(id, data);
  }
}
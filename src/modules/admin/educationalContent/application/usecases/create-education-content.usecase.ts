import { EducationContent } from "../../domain/entities/educational-content.entity";
import { EducationContentRepository } from "../../domain/repositories/educational-content.repository.interface";

export class CreateEducationContentUseCase {
  constructor(
    private readonly repository: EducationContentRepository
  ) {}

  async execute(
    data: Omit<EducationContent, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<EducationContent> {
    return this.repository.create(data);
  }
}
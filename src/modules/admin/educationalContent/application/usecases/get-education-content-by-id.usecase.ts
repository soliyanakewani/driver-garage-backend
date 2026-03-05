import { EducationContent } from "../../domain/entities/educational-content.entity";
import { EducationContentRepository } from "../../domain/repositories/educational-content.repository.interface";

export class GetEducationContentByIdUseCase {
  constructor(
    private readonly repository: EducationContentRepository
  ) {}

  async execute(id: string): Promise<EducationContent> {
    const content = await this.repository.findById(id);

    if (!content) {
      throw new Error('Educational content not found');
    }

    return content;
  }
}
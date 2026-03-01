import { EducationContent } from "../../domain/entities/educational-content.entity";
import { EducationContentRepository } from "../../domain/repositories/educational-content.repository.interface";

export class SearchEducationContentUseCase {
  constructor(
    private readonly repository: EducationContentRepository
  ) {}

  async execute(query: string): Promise<EducationContent[]> {
    if (!query?.trim()) return [];

    return this.repository.search(query);
  }
}
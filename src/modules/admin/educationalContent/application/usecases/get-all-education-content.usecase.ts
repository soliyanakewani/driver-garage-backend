import { EducationContent } from "../../domain/entities/educational-content.entity";
import { EducationContentRepository } from "../../domain/repositories/educational-content.repository.interface";

export class GetAllEducationContentUseCase {
  constructor(
    private readonly repository: EducationContentRepository
  ) {}

  async execute(): Promise<EducationContent[]> {
    return this.repository.findAll();
  }
}
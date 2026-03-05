import { EducationContentRepository } from "../../domain/repositories/educational-content.repository.interface";

export class DeleteEducationContentUseCase {
  constructor(
    private readonly repository: EducationContentRepository
  ) {}

  async execute(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
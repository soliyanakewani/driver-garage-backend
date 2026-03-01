import { EducationCategory } from "../../domain/entities/educational-content.entity";

export interface CreateEducationContentDto {
  title: string;
  description: string;
  category: EducationCategory;
  image?: string | null;
}
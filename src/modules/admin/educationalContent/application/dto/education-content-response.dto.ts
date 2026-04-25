import { EducationCategory } from "../../domain/entities/educational-content.entity";

export interface EducationContentResponseDto {
  id: string;
  title: string;
  description: string;
  category: EducationCategory;
  image?: string | null;
  pdf?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
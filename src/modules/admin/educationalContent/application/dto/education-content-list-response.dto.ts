import { EducationContentResponseDto } from "./education-content-response.dto";

export interface EducationContentListResponseDto {
  contents: EducationContentResponseDto[];
  total: number;
}
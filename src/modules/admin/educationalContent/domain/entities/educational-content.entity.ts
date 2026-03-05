export enum EducationCategory {
  ALL = 'ALL',
  SAFETY = 'SAFETY',
  MAINTENANCE = 'MAINTENANCE',
  REPAIRS = 'REPAIRS',
  TIPS = 'TIPS',
}

export interface EducationContent {
  id: string;
  title: string;
  description: string;
  category: EducationCategory;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
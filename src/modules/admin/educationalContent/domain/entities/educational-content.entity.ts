export enum EducationCategory {
  ALL = 'ALL',
  SAFETY = 'SAFETY',
  MAINTENANCE = 'MAINTENANCE',
  REPAIRS = 'REPAIRS',
  TIPS = 'TIPS',
  /** Vehicle / app manuals uploaded as PDF by admins */
  MANUALS = 'MANUALS',
}

export interface EducationContent {
  id: string;
  title: string;
  description: string;
  category: EducationCategory;
  image?: string | null;
  /** Public URL of the PDF when category is MANUALS */
  pdf?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
-- Add new enum value used by existing education content rows.
ALTER TYPE "EducationCategory" ADD VALUE IF NOT EXISTS 'MANUALS';

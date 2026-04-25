-- Add MANUALS category and optional PDF URL for education content (manuals)
ALTER TYPE "EducationCategory" ADD VALUE 'MANUALS';

ALTER TABLE "EducationContent" ADD COLUMN "pdf_url" TEXT;

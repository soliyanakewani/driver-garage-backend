import { body, param, query } from "express-validator";
import { Request } from "express";
import { EducationCategory } from "../../domain/entities/educational-content.entity";

export const createEducationContentValidator = [
  body("title").isString().notEmpty().withMessage("Title is required"),
  body("description").isString().notEmpty().withMessage("Description is required"),
  body("category")
    .isIn(Object.values(EducationCategory))
    .withMessage(`Category must be one of ${Object.values(EducationCategory).join(", ")}`),
  body("image").optional().isString().withMessage("Image must be a URL string"),
  body("pdfUrl").optional().isString().withMessage("pdfUrl must be a string"),
  body().custom((_value, { req }) => {
    const r = req as Request;
    const cat = String(r.body?.category ?? "");
    if (cat !== EducationCategory.MANUALS) return true;
    const files = r.files as Record<string, Express.Multer.File[]> | undefined;
    const hasPdfFile = !!files?.pdf?.length;
    const hasPdfUrl = !!(typeof r.body?.pdfUrl === "string" && r.body.pdfUrl.trim());
    if (!hasPdfFile && !hasPdfUrl) {
      throw new Error(
        "MANUALS requires a PDF: upload field `pdf` (multipart) or provide `pdfUrl` as a string"
      );
    }
    return true;
  }),
];

export const updateEducationContentValidator = [
  body("title").optional().isString(),
  body("description").optional().isString(),
  body("category").optional().isIn(Object.values(EducationCategory)),
  body("image").optional().isString(),
  body("pdfUrl").optional().isString(),
];

export const idParamValidator = [
  param("id").isUUID().withMessage("Invalid content ID"),
];

export const searchQueryValidator = [
  query("q").isString().notEmpty().withMessage("Search query is required"),
];

/** Optional filter: ?category=MANUALS (driver education list) */
export const optionalCategoryQueryValidator = [
  query("category")
    .optional()
    .isIn(Object.values(EducationCategory))
    .withMessage(`category must be one of ${Object.values(EducationCategory).join(", ")}`),
];
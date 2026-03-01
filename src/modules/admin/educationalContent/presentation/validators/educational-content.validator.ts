import { body, param, query } from "express-validator";
import { EducationCategory } from "../../domain/entities/educational-content.entity";

export const createEducationContentValidator = [
  body("title").isString().notEmpty().withMessage("Title is required"),
  body("description").isString().notEmpty().withMessage("Description is required"),
  body("category")
    .isIn(Object.values(EducationCategory))
    .withMessage(`Category must be one of ${Object.values(EducationCategory).join(", ")}`),
  body("image").optional().isString().withMessage("Image must be a URL string"),
];

export const updateEducationContentValidator = [
  body("title").optional().isString(),
  body("description").optional().isString(),
  body("category").optional().isIn(Object.values(EducationCategory)),
  body("image").optional().isString(),
];

export const idParamValidator = [
  param("id").isUUID().withMessage("Invalid content ID"),
];

export const searchQueryValidator = [
  query("q").isString().notEmpty().withMessage("Search query is required"),
];
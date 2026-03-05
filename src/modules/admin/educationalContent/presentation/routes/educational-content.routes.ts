import { Router } from "express";
import { EducationalContentController } from "../controller/educational-content.controller";
import { validate } from "../../../../../core/middleware/validate.middleware";
import { adminAuthGuard } from "../../../../../core/middleware/auth/admin-auth.middleware";
import {
  createEducationContentValidator,
  updateEducationContentValidator,
  idParamValidator,
  searchQueryValidator
} from "../validators/educational-content.validator";
import { EducationContentRepositoryImpl } from "../../infrastructure/repositories/educational-content.repository";
import { CreateEducationContentUseCase } from "../../application/usecases/create-education-content.usecase";
import { DeleteEducationContentUseCase } from "../../application/usecases/delete-education-content.usecase";
import { GetAllEducationContentUseCase } from "../../application/usecases/get-all-education-content.usecase";
import { GetEducationContentByIdUseCase } from "../../application/usecases/get-education-content-by-id.usecase";
import { SearchEducationContentUseCase } from "../../application/usecases/search-education-content.usecase";
import { UpdateEducationContentUseCase } from "../../application/usecases/update-education-content.usecase";

const educationalContentRepository = new EducationContentRepositoryImpl();

const getAllEducationalContentUseCase = new GetAllEducationContentUseCase(educationalContentRepository);
const searchEducationalContentUseCase = new SearchEducationContentUseCase(educationalContentRepository);
const getEducationContentByIdUseCase = new GetEducationContentByIdUseCase(educationalContentRepository);
const createEducationContentUseCase = new CreateEducationContentUseCase(educationalContentRepository);
const updateEducationContentUseCase = new UpdateEducationContentUseCase(educationalContentRepository);
const deleteEducationContentUseCase = new DeleteEducationContentUseCase(educationalContentRepository); 


const controller = new EducationalContentController(
    getAllEducationalContentUseCase,
    getEducationContentByIdUseCase,
    createEducationContentUseCase,
    updateEducationContentUseCase,
    deleteEducationContentUseCase,
    searchEducationalContentUseCase
);

const router = Router();
router.use(adminAuthGuard);

router.get("/", controller.getAll);
router.get("/search", searchQueryValidator, validate, controller.search);
router.get("/:id", idParamValidator, validate, controller.getById);
router.post("/", createEducationContentValidator, validate, controller.create);
router.put("/:id", idParamValidator, updateEducationContentValidator, validate, controller.update);
router.delete("/:id", idParamValidator, validate, controller.delete);

export default router;
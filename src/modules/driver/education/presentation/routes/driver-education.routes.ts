import { Router } from 'express';
import { verifyDriverJWT } from '../../../../../core/middleware/auth/jwt.middleware';
import { validate } from '../../../../../core/middleware/validate.middleware';
import {
  idParamValidator,
  searchQueryValidator,
} from '../../../../admin/educationalContent/presentation/validators/educational-content.validator';
import { EducationContentRepositoryImpl } from '../../../../admin/educationalContent/infrastructure/repositories/educational-content.repository';
import { GetAllEducationContentUseCase } from '../../../../admin/educationalContent/application/usecases/get-all-education-content.usecase';
import { GetEducationContentByIdUseCase } from '../../../../admin/educationalContent/application/usecases/get-education-content-by-id.usecase';
import { SearchEducationContentUseCase } from '../../../../admin/educationalContent/application/usecases/search-education-content.usecase';
import { DriverEducationController } from '../controllers/driver-education.controller';

const repository = new EducationContentRepositoryImpl();
const controller = new DriverEducationController(
  new GetAllEducationContentUseCase(repository),
  new GetEducationContentByIdUseCase(repository),
  new SearchEducationContentUseCase(repository)
);

const router = Router();
router.use(verifyDriverJWT);

router.get('/', controller.getAll);
router.get('/search', searchQueryValidator, validate, controller.search);
router.get('/:id', idParamValidator, validate, controller.getById);

export default router;

import { Router } from 'express';
import { GarageApprovalController } from '../controllers/garage-approval.controller';
import { GetAllGaragesUseCase } from '../../.../../application/usecases/get-all-garages.usecase';
import { SearchGaragesUseCase } from '../../.../../application/usecases/search-garages.usecase';
import { GetGarageByIdUseCase } from '../../.../../application/usecases/get-garage-by-id.usecase';
import { ApproveGarageUseCase } from '../../.../../application/usecases/approve-garage.usecase';
import { RejectGarageUseCase } from '../../.../../application/usecases/reject-garage.usecase';
import { GarageRepositoryImpl} from '../../infrastructure/repositories/garage-approval.repository';
import { adminAuthGuard } from '../../../../../core/middleware/auth/admin-auth.middleware';
import { garageIdParam, searchQueryValidator } from '../validators/garage-approval.validator';
import { validate } from '../../../../../core/middleware/validate.middleware';

const router = Router();

const garageRepository = new GarageRepositoryImpl();

const getAllGaragesUseCase = new GetAllGaragesUseCase(garageRepository);
const searchGaragesUseCase = new SearchGaragesUseCase(garageRepository);
const getGarageByIdUseCase = new GetGarageByIdUseCase(garageRepository);
const approveGarageUseCase = new ApproveGarageUseCase(garageRepository);
const rejectGarageUseCase = new RejectGarageUseCase(garageRepository);

const controller = new GarageApprovalController(
  getAllGaragesUseCase,
  searchGaragesUseCase,
  getGarageByIdUseCase,
  approveGarageUseCase,
  rejectGarageUseCase
);


router.use(adminAuthGuard); 

router.get('/', controller.getAll);
router.get('/search', searchQueryValidator, validate, controller.search);
router.get('/:id', garageIdParam, validate, controller.getById);
router.post('/:id/approve', garageIdParam, validate, controller.approve);
router.post('/:id/reject', garageIdParam, validate, controller.reject);

export default router;
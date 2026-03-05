import { Router } from 'express';
import { verifyGarageJWT, verifyDriverJWT } from '../../../../../core/middleware/auth/jwt.middleware';
import {
  listMyServices,
  createService,
  updateService,
  deleteService,
} from '../controllers/garage-services.controller';
import { listGarageServicesForDriver } from '../controllers/driver-view-services.controller';

const router = Router();

// Garage owner manages own services list (CRUD)
router.get('/me/services', verifyGarageJWT, listMyServices);
router.post('/me/services', verifyGarageJWT, createService);
router.patch('/me/services/:id', verifyGarageJWT, updateService);
router.delete('/me/services/:id', verifyGarageJWT, deleteService);

// Driver views a garage's services (FR-DR-26 View Service Details)
router.get('/:garageId/services', verifyDriverJWT, listGarageServicesForDriver);

export default router;

import { Router } from 'express';
import { verifyDriverJWT } from '../../../../../core/middleware/auth/jwt.middleware';
import { getNearbyGarages } from '../controllers/nearby-garages.controller';

const router = Router();

router.use(verifyDriverJWT);
router.get('/', getNearbyGarages);

export default router;

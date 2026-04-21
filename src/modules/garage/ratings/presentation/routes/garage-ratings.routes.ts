import { Router } from 'express';
import { verifyGarageJWT } from '../../../../../core/middleware/auth/jwt.middleware';
import { getRatingSummary } from '../controllers/garage-ratings.controller';

const router = Router();

router.use(verifyGarageJWT);
router.get('/', getRatingSummary);

export default router;

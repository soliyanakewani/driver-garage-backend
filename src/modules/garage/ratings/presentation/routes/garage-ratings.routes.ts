import { Router } from 'express';
import { verifyGarageJWT } from '../../../../../core/middleware/auth/jwt.middleware';
import { listRatings, getRatingById } from '../controllers/garage-ratings.controller';

const router = Router();

router.use(verifyGarageJWT);
router.get('/', listRatings);
router.get('/:ratingId', getRatingById);

export default router;

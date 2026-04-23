import { Router } from 'express';
import { verifyDriverJWT, verifyGarageJWT } from '../../../../../core/middleware/auth/jwt.middleware';
import { getRatingSummary, getRatingSummaryByGarageId } from '../controllers/garage-ratings.controller';

const router = Router();

// Driver-facing endpoint to fetch rating summary for any garage card/profile.
router.get('/:garageId/summary', verifyDriverJWT, getRatingSummaryByGarageId);
// Garage-facing endpoint to fetch own rating summary.
router.get('/', verifyGarageJWT, getRatingSummary);

export default router;

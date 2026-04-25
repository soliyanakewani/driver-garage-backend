import { Router } from 'express';
import { verifyDriverJWT, verifyGarageJWT } from '../../../../../core/middleware/auth/jwt.middleware';
import {
  getRatingSummary,
  getRatingSummaryByGarageId,
  getRatingsAndReviewsByGarageId,
  getRatingsAndReviewsForGarage,
} from '../controllers/garage-ratings.controller';

const router = Router();

// Driver-facing endpoint to fetch rating summary for any garage card/profile.
router.get('/:garageId/summary', verifyDriverJWT, getRatingSummaryByGarageId);
// Driver-facing endpoint to fetch profile-ready rating + reviews for any garage.
router.get('/:garageId/reviews', verifyDriverJWT, getRatingsAndReviewsByGarageId);
// Garage-facing endpoint to fetch own rating summary.
router.get('/', verifyGarageJWT, getRatingSummary);
// Garage-facing endpoint to fetch own profile-ready rating + reviews.
router.get('/reviews/me', verifyGarageJWT, getRatingsAndReviewsForGarage);

export default router;

import { Router } from 'express';
import { verifyGarageJWT } from '../../../../../core/middleware/auth/jwt.middleware';
import { getSettings, updateSettings } from '../controllers/garage-settings.controller';

const router = Router();

router.use(verifyGarageJWT);
router.get('/', getSettings);
router.put('/', updateSettings);

export default router;

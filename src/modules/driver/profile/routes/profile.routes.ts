import { Router } from 'express';
import { verifyDriverJWT } from '../../../../core/middleware/auth/jwt.middleware';
import { getProfile, createProfile, updateProfile } from '../controllers/profile.controller';

const router = Router();

router.use(verifyDriverJWT);

router.get('/profile', getProfile);
router.post('/profile', createProfile);
router.put('/profile', updateProfile);

export default router;

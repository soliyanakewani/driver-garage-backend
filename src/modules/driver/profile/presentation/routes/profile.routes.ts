import { Router } from 'express';
import { verifyDriverJWT } from '../../../../../core/middleware/auth/jwt.middleware';
import { getProfile, createProfile, updateProfile, changePassword } from '../controllers/profile.controller';

const router = Router();

router.use(verifyDriverJWT);

router.get('/profile', getProfile);
router.post('/profile', createProfile);
router.put('/profile', updateProfile);
router.put('/profile/change-password', changePassword);

export default router;

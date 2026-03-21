import { Router } from 'express';
import { verifyGarageJWT } from '../../../../../core/middleware/auth/jwt.middleware';
import { garageDocumentUpload } from '../../../../../core/middleware/upload.middleware';
import { getProfile, updateProfile, changePassword } from '../controllers/garage-profile.controller';

const router = Router();

router.use(verifyGarageJWT);

router.get('/profile', getProfile);
router.put('/profile', garageDocumentUpload, updateProfile);
router.put('/profile/change-password', changePassword);

export default router;

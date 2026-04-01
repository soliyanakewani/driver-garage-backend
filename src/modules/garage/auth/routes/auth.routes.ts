import { Router } from 'express';
import { signup, login, sendOtp, verifyOtp } from '../controllers/auth.controller';
import { logout } from '../../../common/auth/logout.controller';
import { garageDocumentUpload } from '../../../../core/middleware/upload.middleware';

const router = Router();

/** Multipart (fields + optional document) or JSON; document fields: businessDocument, document, registrationDocument */
router.post('/signup', garageDocumentUpload, signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

export default router;
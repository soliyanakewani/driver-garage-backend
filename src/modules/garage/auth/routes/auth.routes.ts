import { Router } from 'express';
import { signup, login, sendOtp, verifyOtp } from '../controllers/auth.controller';
import { logout } from '../../../common/auth/logout.controller';
import { garageDocumentUpload } from '../../../../core/middleware/upload.middleware';
import { loginLimiter, otpLimiter } from '../../../../core/middleware/rate-limit.middleware';
import { validate } from '../../../../core/middleware/validate.middleware';
import { garageRequestOtpValidator, garageVerifyOtpValidator } from '../validators/garage-otp.validator';

const router = Router();

/** Multipart (fields + optional document) or JSON; document fields: businessDocument, document, registrationDocument */
router.post('/signup', garageDocumentUpload, signup);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.post('/request-otp', otpLimiter, garageRequestOtpValidator, validate, sendOtp);
/** @deprecated Use POST /request-otp */
router.post('/send-otp', otpLimiter, garageRequestOtpValidator, validate, sendOtp);
router.post('/verify-otp', otpLimiter, garageVerifyOtpValidator, validate, verifyOtp);

export default router;
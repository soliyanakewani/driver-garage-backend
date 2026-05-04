import { Router } from 'express';
import { signup, login, firebaseSignIn } from '../controllers/auth.controller';
import { logout } from '../../../common/auth/logout.controller';
import { firebaseAuthLimiter, loginLimiter } from '../../../../core/middleware/rate-limit.middleware';
import { validate } from '../../../../core/middleware/validate.middleware';
import { driverFirebaseAuthValidator } from '../validators/firebase-auth.validator';

const router = Router();

router.post('/signup', signup);
router.post('/login', loginLimiter, login);
router.post('/firebase', firebaseAuthLimiter, driverFirebaseAuthValidator, validate, firebaseSignIn);
router.post('/logout', logout);

export default router;
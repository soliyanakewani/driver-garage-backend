import { Router } from 'express';
import { signup, login } from '../controllers/auth.controller';
import { logout } from '../../../common/auth/logout.controller';
import { loginLimiter } from '../../../../core/middleware/rate-limit.middleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);

export default router;
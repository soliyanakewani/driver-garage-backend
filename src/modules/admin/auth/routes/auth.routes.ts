import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { logout } from '../../../common/auth/logout.controller';
import { loginLimiter } from '../../../../core/middleware/rate-limit.middleware';

const router = Router();

router.post("/login", loginLimiter, login);
router.post('/logout', logout);

export default router;
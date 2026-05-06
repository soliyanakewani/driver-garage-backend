import { Router } from 'express';
import { changePassword, login } from '../controllers/auth.controller';
import { logout } from '../../../common/auth/logout.controller';
import { loginLimiter } from '../../../../core/middleware/rate-limit.middleware';
import { adminAuthGuard } from '../../../../core/middleware/auth/admin-auth.middleware';

const router = Router();

router.post("/login", loginLimiter, login);
router.post('/logout', logout);
router.put('/change-password', adminAuthGuard, changePassword);

export default router;
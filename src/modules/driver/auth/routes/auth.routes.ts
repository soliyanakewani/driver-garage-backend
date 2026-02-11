import { Router } from 'express';
import { signup, login } from '../controllers/auth.controller';
import { logout } from '../../../common/auth/logout.controller';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;
import { Router } from 'express';
import { adminAuthGuard } from '../../../../../core/middleware/auth/admin-auth.middleware';
import { AdminNotificationsController } from '../controllers/admin-notifications.controller';

const router = Router();
router.use(adminAuthGuard);

router.post('/broadcast', AdminNotificationsController.broadcast);

export default router;

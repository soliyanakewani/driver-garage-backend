import { Router } from 'express';
import { adminAuthGuard } from '../../../../../core/middleware/auth/admin-auth.middleware';
import { AdminNotificationsController } from '../controllers/admin-notifications.controller';

const router = Router();
router.use(adminAuthGuard);

router.get('/', AdminNotificationsController.list);
router.patch('/:id/read', AdminNotificationsController.markRead);
router.patch('/read-all', AdminNotificationsController.markAllRead);
router.post('/broadcast', AdminNotificationsController.broadcast);

export default router;

import { Router } from 'express';
import { adminAuthGuard } from '../../../../../core/middleware/auth/admin-auth.middleware';
import {
  listAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  broadcastAdminNotifications,
} from '../controllers/admin-notifications.controller';

const router = Router();

router.use(adminAuthGuard);

router.get('/', listAdminNotifications);
router.post('/broadcast', broadcastAdminNotifications);
router.patch('/read-all', markAllAdminNotificationsRead);
router.patch('/:id/read', markAdminNotificationRead);

export default router;

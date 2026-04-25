import { Router } from 'express';
import { verifyDriverJWT } from '../../../../../core/middleware/auth/jwt.middleware';
import {
  listDriverNotifications,
  markDriverNotificationRead,
  markAllDriverNotificationsRead,
} from '../controllers/driver-notifications.controller';

const router = Router();

router.use(verifyDriverJWT);
router.get('/', listDriverNotifications);
router.patch('/read-all', markAllDriverNotificationsRead);
router.patch('/:id/read', markDriverNotificationRead);

export default router;

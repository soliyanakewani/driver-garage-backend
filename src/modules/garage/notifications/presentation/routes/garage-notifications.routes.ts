import { Router } from 'express';
import { verifyGarageJWT } from '../../../../../core/middleware/auth/jwt.middleware';
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../controllers/garage-notifications.controller';

const router = Router();

router.use(verifyGarageJWT);

router.get('/', listNotifications);
router.patch('/read-all', markAllNotificationsRead);
router.patch('/:id/read', markNotificationRead);

export default router;

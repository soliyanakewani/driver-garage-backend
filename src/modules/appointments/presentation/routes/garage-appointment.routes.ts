import { Router } from 'express';
import { verifyGarageJWT } from '../../../../core/middleware/auth/jwt.middleware';
import {
  listAppointments,
  getAppointment,
  approveAppointment,
  rejectAppointment,
  updateServiceStatus,
} from '../controllers/garage-appointment.controller';

const router = Router();

router.use(verifyGarageJWT);

router.get('/', listAppointments);
router.get('/:id', getAppointment);
router.patch('/:id/approve', approveAppointment);
router.patch('/:id/reject', rejectAppointment);
router.patch('/:id/status', updateServiceStatus);

export default router;


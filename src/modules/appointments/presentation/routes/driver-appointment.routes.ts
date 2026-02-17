import { Router } from 'express';
import { verifyDriverJWT } from '../../../../core/middleware/auth/jwt.middleware';
import {
  bookAppointment,
  listAppointments,
  getAppointment,
  rescheduleAppointment,
  cancelAppointment,
} from '../controllers/driver-appointment.controller';

const router = Router();

router.use(verifyDriverJWT);

router.post('/', bookAppointment);
router.get('/', listAppointments);
router.get('/:id', getAppointment);
router.patch('/:id/reschedule', rescheduleAppointment);
router.patch('/:id/cancel', cancelAppointment);

export default router;


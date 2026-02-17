import { Router } from 'express';
import adminAuthRoutes from '../modules/admin/auth/routes/auth.routes';
import driverAuthRoutes from '../modules/driver/auth/routes/auth.routes';
import garageAuthRoutes from '../modules/garage/auth/routes/auth.routes';
import driverAppointmentRoutes from '../modules/appointments/presentation/routes/driver-appointment.routes';
import garageAppointmentRoutes from '../modules/appointments/presentation/routes/garage-appointment.routes';
import garageAvailabilityRoutes from '../modules/garage/availability/presentation/routes/garage-availability.routes';

const rootRouter = Router();

rootRouter.use('/admin/auth', adminAuthRoutes);
rootRouter.use('/drivers/auth', driverAuthRoutes);
rootRouter.use('/garages/auth', garageAuthRoutes);
rootRouter.use('/drivers/appointments', driverAppointmentRoutes);
rootRouter.use('/garages/appointments', garageAppointmentRoutes);
rootRouter.use('/garages/availability', garageAvailabilityRoutes);

export default rootRouter;
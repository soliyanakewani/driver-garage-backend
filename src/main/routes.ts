import { Router } from 'express';
import { verifyDriverJWT } from '../core/middleware/auth/jwt.middleware';
import adminAuthRoutes from '../modules/admin/auth/routes/auth.routes';
import driverAuthRoutes from '../modules/driver/auth/routes/auth.routes';
import driverProfileRoutes from '../modules/driver/profile/routes/profile.routes';
import driverVehiclesRoutes from '../modules/driver/vehicles/presentation/routes/vehicles.routes';
import garageAuthRoutes from '../modules/garage/auth/routes/auth.routes';
import driverAppointmentRoutes from '../modules/driver/appointments/presentation/routes/driver-appointment.routes';
import garageAppointmentRoutes from '../modules/garage/appointments/presentation/routes/garage-appointment.routes';
import garageAvailabilityRoutes from '../modules/garage/availability/presentation/routes/garage-availability.routes';
import garageServicesRoutes from '../modules/garage/services/presentation/routes/garage-services.routes';
import garageProfileRoutes from '../modules/garage/profile/presentation/routes/garage-profile.routes';
import garageNotificationsRoutes from '../modules/garage/notifications/presentation/routes/garage-notifications.routes';
import garageSettingsRoutes from '../modules/garage/settings/presentation/routes/garage-settings.routes';
import garageRatingsRoutes from '../modules/garage/ratings/presentation/routes/garage-ratings.routes';
import adminGarageApprovalRoutes from '../modules/admin/garageApproval/presentation/routes/garage-approval.routes';
import userManagementRoutes from "../modules/admin/userManagement/presentation/routes/userManagementRoutes" ;
import educationalContentRoutes from '../modules/admin/educationalContent/presentation/routes/educational-content.routes';
import nearbyGaragesRoutes from '../modules/garage/nearby/presentation/routes/nearby-garages.routes';

const rootRouter = Router();

rootRouter.use('/admin/auth', adminAuthRoutes);
rootRouter.use('/drivers/auth', driverAuthRoutes);
rootRouter.use('/garages/auth', garageAuthRoutes);
rootRouter.use('/drivers/appointments', driverAppointmentRoutes);
rootRouter.use('/garages/appointments', garageAppointmentRoutes);
rootRouter.use('/garages/availability', garageAvailabilityRoutes);
rootRouter.use('/garages/notifications', garageNotificationsRoutes);
rootRouter.use('/garages/settings', garageSettingsRoutes);
rootRouter.use('/garages/ratings', garageRatingsRoutes);
rootRouter.use('/garages', garageServicesRoutes);
rootRouter.use('/driver', driverProfileRoutes);
rootRouter.use('/admin/garages-approval', adminGarageApprovalRoutes);
rootRouter.use("/admin", userManagementRoutes);
rootRouter.use('/admin/educational-content', educationalContentRoutes);

rootRouter.use('/garage', garageProfileRoutes);
rootRouter.use('/services/nearby', nearbyGaragesRoutes);


const driverRouter = Router();
driverRouter.use(verifyDriverJWT);
driverRouter.use('/vehicles', driverVehiclesRoutes);
rootRouter.use('/driver', driverRouter);

export default rootRouter;
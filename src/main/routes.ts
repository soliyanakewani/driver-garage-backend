import { Router } from 'express';
import { verifyDriverJWT } from '../core/middleware/auth/jwt.middleware';
import adminAuthRoutes from '../modules/admin/auth/routes/auth.routes';
import driverAuthRoutes from '../modules/driver/auth/routes/auth.routes';
import driverVehiclesRoutes from '../modules/driver/vehicles/presentation/routes/vehicles.routes';
import garageAuthRoutes from '../modules/garage/auth/routes/auth.routes';

const rootRouter = Router();

rootRouter.use('/admin/auth', adminAuthRoutes);
rootRouter.use('/drivers/auth', driverAuthRoutes);
rootRouter.use('/garages/auth', garageAuthRoutes);

const driverRouter = Router();
driverRouter.use(verifyDriverJWT);
driverRouter.use('/vehicles', driverVehiclesRoutes);
rootRouter.use('/driver', driverRouter);

export default rootRouter;
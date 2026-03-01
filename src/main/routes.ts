import { Router } from 'express';
import { verifyDriverJWT } from '../core/middleware/auth/jwt.middleware';
import adminAuthRoutes from '../modules/admin/auth/routes/auth.routes';
import driverAuthRoutes from '../modules/driver/auth/routes/auth.routes';
import driverVehiclesRoutes from '../modules/driver/vehicles/presentation/routes/vehicles.routes';
import garageAuthRoutes from '../modules/garage/auth/routes/auth.routes';
import adminGarageApprovalRoutes from '../modules/admin/garageApproval/presentation/routes/garage-approval.routes';
import userManagementRoutes from "../modules/admin/userManagement/presentation/routes/userManagementRoutes" ;
import educationalContentRoutes from '../modules/admin/educationalContent/presentation/routes/educational-content.routes';


const rootRouter = Router();

rootRouter.use('/admin/auth', adminAuthRoutes);
rootRouter.use('/drivers/auth', driverAuthRoutes);
rootRouter.use('/garages/auth', garageAuthRoutes); 
rootRouter.use('/admin/garages-approval', adminGarageApprovalRoutes);
rootRouter.use("/admin", userManagementRoutes);
rootRouter.use('/admin/educational-content', educationalContentRoutes);


const driverRouter = Router();
driverRouter.use(verifyDriverJWT);
driverRouter.use('/vehicles', driverVehiclesRoutes);
rootRouter.use('/driver', driverRouter);

export default rootRouter;
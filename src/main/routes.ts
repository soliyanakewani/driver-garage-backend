import { Router } from 'express';
import adminAuthRoutes from '../modules/admin/auth/routes/auth.routes';
import driverAuthRoutes from '../modules/driver/auth/routes/auth.routes';
import garageAuthRoutes from '../modules/garage/auth/routes/auth.routes';
import userManagementRoutes from "../modules/admin/userManagement/presentation/routes/userManagementRoutes" ;


const rootRouter = Router();

rootRouter.use('/admin/auth', adminAuthRoutes);
rootRouter.use('/drivers/auth', driverAuthRoutes);
rootRouter.use('/garages/auth', garageAuthRoutes); 
rootRouter.use("/admin", userManagementRoutes);



export default rootRouter;
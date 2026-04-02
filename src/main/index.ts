import 'dotenv/config';
import { createServer } from '../core/app/http/server';
import rootRouter from './routes'; 
import { MaintenanceRepository } from '../modules/driver/maintenance/infrastructure/repositories/maintenance.repository';
import { startMaintenanceReminderDispatcher } from '../modules/driver/maintenance/application/services/maintenance-reminder-dispatcher.service';

const app = createServer();

app.use(rootRouter);
startMaintenanceReminderDispatcher(new MaintenanceRepository());

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import 'dotenv/config';
import { createServer } from '../core/app/http/server';
import rootRouter from './routes';
import { MaintenanceRepository } from '../modules/driver/maintenance/infrastructure/repositories/maintenance.repository';
import { startMaintenanceReminderDispatcher } from '../modules/driver/maintenance/application/services/maintenance-reminder-dispatcher.service';
import { prisma } from '../infrastructure/prisma/prisma.client';


const app = createServer();

app.use(rootRouter);
console.log('Prisma models available:', {
  maintenanceReminder: !!(prisma as any).maintenanceReminder,
  maintenanceRecord: !!(prisma as any).maintenanceRecord,
  driverNotification: !!(prisma as any).driverNotification,
  vehicle: !!(prisma as any).vehicle,
});
// This job requires the maintenance-related Prisma models to exist in the generated client.
// Some branches/migration sets may not include them yet, so guard startup to avoid runtime crashes.
if ((prisma as any).maintenanceReminder && (prisma as any).driverNotification) {
  startMaintenanceReminderDispatcher(new MaintenanceRepository());
} else {
  console.warn(
    'Maintenance reminder dispatcher not started: missing Prisma models (maintenanceReminder/driverNotification).'
  );
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

import 'dotenv/config';
import { createServer } from '../core/app/http/server';
import rootRouter from './routes';
import { MaintenanceRepository } from '../modules/driver/maintenance/infrastructure/repositories/maintenance.repository';
import { startMaintenanceReminderDispatcher } from '../modules/driver/maintenance/application/services/maintenance-reminder-dispatcher.service';
import { prisma } from '../infrastructure/prisma/prisma.client';
import { runMigrationsOnStartup } from '../core/startup/run-migrations';
import { runDbConnectivityCheck } from '../core/startup/check-db';

function assertRequiredEnv(): void {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

async function bootstrap(): Promise<void> {
  assertRequiredEnv();

  await runMigrationsOnStartup();

  const app = createServer();

  await runDbConnectivityCheck();

  app.use(rootRouter);
  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
  app.use((err: unknown, _req: any, res: any, _next: any) => {
    const message = err instanceof Error ? err.message : 'Internal server error';
    const status = (err as any)?.statusCode ?? 500;
    res.status(status).json({ error: message });
  });
  console.log('Prisma models available:', {
    maintenanceReminder: !!(prisma as any).maintenanceReminder,
    maintenanceRecord: !!(prisma as any).maintenanceRecord,
    driverNotification: !!(prisma as any).driverNotification,
    vehicle: !!(prisma as any).vehicle,
  });
  if ((prisma as any).maintenanceReminder && (prisma as any).driverNotification) {
    startMaintenanceReminderDispatcher(new MaintenanceRepository());
  } else {
    console.warn(
      'Maintenance reminder dispatcher not started: missing Prisma models (maintenanceReminder/driverNotification).'
    );
  }

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

bootstrap().catch((err) => {
  console.error('[bootstrap] fatal:', err);
  process.exit(1);
});

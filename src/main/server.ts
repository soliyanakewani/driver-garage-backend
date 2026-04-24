import 'dotenv/config';
import { createServer } from '../core/app/http/server';
import rootRouter from './routes';
<<<<<<< Updated upstream
=======
import { MaintenanceRepository } from '../modules/driver/maintenance/infrastructure/repositories/maintenance.repository';
import { startMaintenanceReminderDispatcher } from '../modules/driver/maintenance/application/services/maintenance-reminder-dispatcher.service';
import { prisma } from '../infrastructure/prisma/prisma.client';
import express from 'express';
import path from 'path';
>>>>>>> Stashed changes


const app = createServer();

app.use(rootRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

import { Router } from 'express';
import { verifyDriverJWT } from '../../../../../core/middleware/auth/jwt.middleware';
import {
  createReminder,
  listReminders,
  updateReminder,
  toggleReminder,
  deleteReminder,
  markReminderDone,
  createRecord,
  listRecords,
  updateRecord,
  deleteRecord,
  listNotifications,
  markNotificationRead,
  getMaintenanceCatalog,
  getVehicleHealth,
} from '../controllers/maintenance.controller';

const router = Router();

router.use(verifyDriverJWT);

// Catalog & vehicle health (for dropdown + gauges)
router.get('/catalog', getMaintenanceCatalog);
router.get('/health/:vehicleId', getVehicleHealth);

// Upcoming maintenance reminders
router.post('/upcoming', createReminder);
router.get('/upcoming', listReminders);
router.patch('/upcoming/:id', updateReminder);
router.patch('/upcoming/:id/reminder', toggleReminder);
router.patch('/upcoming/:id/done', markReminderDone);
router.delete('/upcoming/:id', deleteReminder);

// Maintenance history records
router.post('/history', createRecord);
router.get('/history', listRecords);
router.patch('/history/:id', updateRecord);
router.delete('/history/:id', deleteRecord);

// In-app maintenance notifications
router.get('/notifications', listNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

export default router;

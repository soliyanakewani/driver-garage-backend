import { Router } from 'express';
import { verifyGarageJWT, verifyDriverJWT } from '../../../../../core/middleware/auth/jwt.middleware';
import { listMySlots, createSlot, updateSlot, deleteSlot } from '../controllers/garage-availability.controller';
import { listGarageSlotsForDriver } from '../controllers/driver-view-availability.controller';

const router = Router();

// Garage owner manages own slots
router.get('/me/slots', verifyGarageJWT, listMySlots);
router.post('/me/slots', verifyGarageJWT, createSlot);
router.patch('/me/slots/:id', verifyGarageJWT, updateSlot);
router.delete('/me/slots/:id', verifyGarageJWT, deleteSlot);

// Driver views a garage's slots
router.get('/:garageId/slots', verifyDriverJWT, listGarageSlotsForDriver);

export default router;


import { Router } from 'express';
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicles.controller';

const router = Router();

router.post('/', createVehicle);
router.get('/', getVehicles);
router.get('/:vehicleId', getVehicleById);
router.put('/:vehicleId', updateVehicle);
router.delete('/:vehicleId', deleteVehicle);

export default router;

import { Router } from 'express';
import { vehicleUpload } from '../../../../../core/middleware/upload.middleware';
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicles.controller';

const router = Router();

router.post('/', vehicleUpload, createVehicle);
router.get('/', getVehicles);
router.get('/:vehicleId', getVehicleById);
router.put('/:vehicleId', vehicleUpload, updateVehicle);
router.delete('/:vehicleId', deleteVehicle);

export default router;

import { Router } from 'express';
import {
  approveGarage,
  rejectGarage,
  getAllGarages,
  getGarageById,
  searchGarages,
} from '../controllers/garage-approval.controller';

const router = Router();

router.get('/',getAllGarages);
router.get('/search', searchGarages);
router.get('/:id', getGarageById);
router.post('/:id/approve', approveGarage);
router.post('/:id/reject', rejectGarage);

export default router;

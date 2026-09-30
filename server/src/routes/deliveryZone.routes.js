import { Router } from 'express';
import { listZones } from '../controllers/deliveryZone.controller.js';

const router = Router();
router.get('/delivery-zones', listZones);

export default router;
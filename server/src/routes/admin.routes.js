import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { listOrdersAdmin, getOrderAdmin, updateOrderStatusAdmin } from '../controllers/order.controller.js';

const router = Router();

router.get('/admin/ping', requireAuth, (req, res) => {
  res.json({ success: true, data: { message: `Hello ${req.user.name}, you are ${req.user.role}.` } });
});

router.get('/admin/ping-admin-only', requireAuth, requireRole('ADMIN'), (req, res) => {
  res.json({ success: true, data: { message: 'You have admin access.' } });
});

router.get('/admin/orders', requireAuth, requireRole('ADMIN', 'STAFF'), listOrdersAdmin);
router.get('/admin/orders/:id', requireAuth, requireRole('ADMIN', 'STAFF'), getOrderAdmin);
router.patch('/admin/orders/:id/status', requireAuth, requireRole('ADMIN', 'STAFF'), updateOrderStatusAdmin);

export default router;
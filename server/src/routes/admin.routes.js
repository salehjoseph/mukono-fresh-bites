import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Any logged-in staff member can reach this
router.get('/admin/ping', requireAuth, (req, res) => {
  res.json({ success: true, data: { message: `Hello ${req.user.name}, you are ${req.user.role}.` } });
});

// Only ADMIN can reach this
router.get('/admin/ping-admin-only', requireAuth, requireRole('ADMIN'), (req, res) => {
  res.json({ success: true, data: { message: 'You have admin access.' } });
});

export default router;
import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { listOrdersAdmin, getOrderAdmin, updateOrderStatusAdmin } from '../controllers/order.controller.js';
import * as categoryAdmin from '../controllers/categoryAdmin.controller.js';
import * as menuItemAdmin from '../controllers/menuItemAdmin.controller.js';
import { uploadMenuItemImage, handleUploadError } from '../middleware/upload.middleware.js';

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

router.get('/admin/categories', requireAuth, requireRole('ADMIN', 'STAFF'), categoryAdmin.list);
router.post('/admin/categories', requireAuth, requireRole('ADMIN'), categoryAdmin.create);
router.patch('/admin/categories/:id', requireAuth, requireRole('ADMIN'), categoryAdmin.update);

router.get('/admin/menu-items', requireAuth, requireRole('ADMIN', 'STAFF'), menuItemAdmin.list);
router.post('/admin/menu-items', requireAuth, requireRole('ADMIN'), menuItemAdmin.create);
router.patch('/admin/menu-items/:id', requireAuth, requireRole('ADMIN'), menuItemAdmin.update);

router.delete('/admin/menu-items/:id', requireAuth, requireRole('ADMIN'), menuItemAdmin.remove);
router.post(
  '/admin/menu-items/:id/image',
  requireAuth,
  requireRole('ADMIN'),
  uploadMenuItemImage,
  menuItemAdmin.uploadImage,
);

router.post(
  '/admin/menu-items/:id/image',
  requireAuth,
  requireRole('ADMIN'),
  (req, res, next) => {
    uploadMenuItemImage(req, res, (err) => handleUploadError(err, req, res, next));
  },
  menuItemAdmin.uploadImage,
);

export default router;
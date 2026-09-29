import { Router } from 'express';
import { listCategories, listMenu, getMenuItem } from '../controllers/menu.controller.js';

const router = Router();

router.get('/categories', listCategories);
router.get('/menu', listMenu);
router.get('/menu/:slug', getMenuItem);

export default router;
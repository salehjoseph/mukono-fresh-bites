import * as menuService from '../services/menu.service.js';

export async function listCategories(req, res, next) {
  try {
    const categories = await menuService.getCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}

export async function listMenu(req, res, next) {
  try {
    const { category, search, featured } = req.query;
    const items = await menuService.getMenu({ category, search, featured });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

export async function getMenuItem(req, res, next) {
  try {
    const item = await menuService.getMenuItemBySlug(req.params.slug);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}
import * as menuItemService from '../services/menuItemAdmin.service.js';
import { validateMenuItemInput } from '../validators/menuItem.validator.js';

export async function list(req, res, next) {
  try {
    res.json({ success: true, data: await menuItemService.listMenuItemsAdmin() });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const errors = validateMenuItemInput(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: errors.join(' ') } });
    }
    const item = await menuItemService.createMenuItem(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const errors = validateMenuItemInput(req.body, { isUpdate: true });
    if (errors.length) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: errors.join(' ') } });
    }
    const item = await menuItemService.updateMenuItem(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}


export async function remove(req, res, next) {
  try {
    const result = await menuItemService.deleteMenuItem(req.params.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_FILE', message: 'No image file was provided.' },
      });
    }
    const imageUrl = `/uploads/menu-items/${req.file.filename}`;
    const item = await menuItemService.updateMenuItem(req.params.id, { imageUrl });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}
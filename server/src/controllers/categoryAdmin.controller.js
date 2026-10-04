import * as categoryService from '../services/categoryAdmin.service.js';
import { validateCategoryInput } from '../validators/category.validator.js';

export async function list(req, res, next) {
  try {
    res.json({ success: true, data: await categoryService.listCategoriesAdmin() });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const errors = validateCategoryInput(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: errors.join(' ') } });
    }
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const errors = validateCategoryInput(req.body, { isUpdate: true });
    if (errors.length) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: errors.join(' ') } });
    }
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}
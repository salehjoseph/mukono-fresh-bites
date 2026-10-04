import * as categoryRepo from '../repositories/category.repository.js';
import { slugify } from '../validators/category.validator.js';

export async function listCategoriesAdmin() {
  return categoryRepo.findAllCategoriesAdmin();
}

export async function createCategory({ name, sortOrder }) {
  const slug = slugify(name);
  const id = await categoryRepo.insertCategory({ name: name.trim(), slug, sortOrder });
  return { id, name: name.trim(), slug };
}

export async function updateCategory(id, updates) {
  const fields = {};
  if (updates.name !== undefined) {
    fields.name = updates.name.trim();
    fields.slug = slugify(updates.name);
  }
  if (updates.sortOrder !== undefined) fields.sort_order = updates.sortOrder;

  if (updates.isActive === false) {
    const inUse = await categoryRepo.categoryHasMenuItems(id);
    if (inUse) {
      const err = new Error('Cannot deactivate a category that still has active menu items.');
      err.status = 400;
      err.code = 'CATEGORY_IN_USE';
      throw err;
    }
  }
  if (updates.isActive !== undefined) fields.is_active = updates.isActive;

  await categoryRepo.updateCategory(id, fields);
  return { id, ...fields };
}
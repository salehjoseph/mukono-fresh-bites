import * as menuItemRepo from '../repositories/menuItem.repository.js';
import { slugify } from '../validators/category.validator.js';

export async function listMenuItemsAdmin() {
  return menuItemRepo.findAllMenuItemsAdmin();
}

export async function createMenuItem(input) {
  const slug = slugify(input.name);
  const id = await menuItemRepo.insertMenuItem({
    categoryId: input.categoryId,
    name: input.name.trim(),
    slug,
    description: input.description?.trim() || null,
    priceUgx: input.priceUgx,
    isAvailable: input.isAvailable ?? true,
    isFeatured: input.isFeatured ?? false,
  });
  return { id, slug };
}

export async function updateMenuItem(id, updates) {
  const existing = await menuItemRepo.findMenuItemByIdAny(id);
  if (!existing) {
    const err = new Error('Menu item not found.');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  const fields = {};
  if (updates.name !== undefined) {
    fields.name = updates.name.trim();
    fields.slug = slugify(updates.name);
  }
  if (updates.categoryId !== undefined) fields.category_id = updates.categoryId;
  if (updates.description !== undefined) fields.description = updates.description.trim() || null;
  if (updates.priceUgx !== undefined) fields.price_ugx = updates.priceUgx;
  if (updates.isAvailable !== undefined) fields.is_available = updates.isAvailable;
  if (updates.isFeatured !== undefined) fields.is_featured = updates.isFeatured;
  if (updates.isActive !== undefined) fields.is_active = updates.isActive;
  if (updates.imageUrl !== undefined) fields.image_url = updates.imageUrl;

  await menuItemRepo.updateMenuItem(id, fields);
  return { id, ...fields };
}

export async function deleteMenuItem(id) {
  const existing = await menuItemRepo.findMenuItemByIdAny(id);
  if (!existing) {
    const err = new Error('Menu item not found.');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  const hasOrders = await menuItemRepo.menuItemHasOrders(id);
  if (hasOrders) {
    // Protects order history: an item that's been ordered keeps its row forever,
    // so past receipts always show what was actually bought. Deactivate instead.
    await menuItemRepo.updateMenuItem(id, { is_active: false, is_available: false });
    return { id, deactivated: true, deleted: false };
  }

  await menuItemRepo.deleteMenuItemPermanently(id);
  return { id, deactivated: false, deleted: true };
}
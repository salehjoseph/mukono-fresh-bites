import * as categoryRepo from '../repositories/category.repository.js';
import * as menuItemRepo from '../repositories/menuItem.repository.js';

export async function getCategories() {
  return categoryRepo.findActiveCategories();
}

export async function getMenu({ category, search, featured }) {
  return menuItemRepo.findMenuItems({
    categorySlug: category,
    search,
    featuredOnly: featured === 'true',
  });
}

export async function getMenuItemBySlug(slug) {
  const item = await menuItemRepo.findMenuItemBySlug(slug);
  if (!item) {
    const err = new Error('Menu item not found');
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }
  return item;
}
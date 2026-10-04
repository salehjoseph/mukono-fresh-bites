import { pool } from '../config/db.js';

export async function findMenuItems({ categorySlug, search, featuredOnly }) {
  const conditions = ['mi.is_active = TRUE'];
  const params = {};

  if (categorySlug) {
    conditions.push('c.slug = :categorySlug');
    params.categorySlug = categorySlug;
  }
  if (search) {
    conditions.push('mi.name LIKE :search');
    params.search = `%${search}%`;
  }
  if (featuredOnly) {
    conditions.push('mi.is_featured = TRUE');
  }

  const [rows] = await pool.query(
    `SELECT
        mi.id, mi.name, mi.slug, mi.description, mi.price_ugx,
        mi.image_url, mi.image_alt, mi.is_available, mi.is_featured,
        c.name AS category_name, c.slug AS category_slug
     FROM menu_items mi
     JOIN categories c ON c.id = mi.category_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY mi.sort_order ASC, mi.name ASC`,
    params,
  );
  return rows;
}

export async function findMenuItemBySlug(slug) {
  const [rows] = await pool.query(
    `SELECT
        mi.id, mi.name, mi.slug, mi.description, mi.price_ugx,
        mi.image_url, mi.image_alt, mi.is_available, mi.is_featured,
        c.name AS category_name, c.slug AS category_slug
     FROM menu_items mi
     JOIN categories c ON c.id = mi.category_id
     WHERE mi.slug = :slug AND mi.is_active = TRUE`,
    { slug },
  );
  return rows[0] || null;
}

export async function findAllMenuItemsAdmin() {
  const [rows] = await pool.query(
    `SELECT mi.id, mi.name, mi.slug, mi.description, mi.price_ugx, mi.image_url,
            mi.is_available, mi.is_featured, mi.is_active, mi.sort_order,
            c.id AS category_id, c.name AS category_name
     FROM menu_items mi
     JOIN categories c ON c.id = mi.category_id
     ORDER BY mi.sort_order ASC, mi.name ASC`,
  );
  return rows;
}

export async function insertMenuItem(item) {
  const [result] = await pool.query(
    `INSERT INTO menu_items
      (category_id, name, slug, description, price_ugx, is_available, is_featured)
     VALUES (:categoryId, :name, :slug, :description, :priceUgx, :isAvailable, :isFeatured)`,
    item,
  );
  return result.insertId;
}

export async function updateMenuItem(id, fields) {
  const sets = [];
  const params = { id };
  for (const [key, value] of Object.entries(fields)) {
    sets.push(`${key} = :${key}`);
    params[key] = value;
  }
  if (sets.length === 0) return;
  await pool.query(`UPDATE menu_items SET ${sets.join(', ')} WHERE id = :id`, params);
}

export async function findMenuItemByIdAny(id) {
  const [rows] = await pool.query(`SELECT * FROM menu_items WHERE id = :id`, { id });
  return rows[0] || null;
}

export async function menuItemHasOrders(menuItemId) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count FROM order_items WHERE menu_item_id = :menuItemId`,
    { menuItemId },
  );
  return rows[0].count > 0;
}

export async function deleteMenuItemPermanently(id) {
  await pool.query(`DELETE FROM menu_items WHERE id = :id`, { id });
}
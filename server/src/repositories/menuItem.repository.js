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
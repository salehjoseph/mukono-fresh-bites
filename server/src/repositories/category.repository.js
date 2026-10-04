import { pool } from '../config/db.js';

export async function findActiveCategories() {
  const [rows] = await pool.query(
    `SELECT id, name, slug, sort_order
     FROM categories
     WHERE is_active = TRUE
     ORDER BY sort_order ASC, name ASC`,
  );
  return rows;
}

export async function findAllCategoriesAdmin() {
  const [rows] = await pool.query(
    `SELECT id, name, slug, sort_order, is_active, created_at
     FROM categories ORDER BY sort_order ASC, name ASC`,
  );
  return rows;
}

export async function insertCategory({ name, slug, sortOrder }) {
  const [result] = await pool.query(
    `INSERT INTO categories (name, slug, sort_order) VALUES (:name, :slug, :sortOrder)`,
    { name, slug, sortOrder: sortOrder ?? 0 },
  );
  return result.insertId;
}

export async function updateCategory(id, fields) {
  const sets = [];
  const params = { id };
  for (const [key, value] of Object.entries(fields)) {
    sets.push(`${key} = :${key}`);
    params[key] = value;
  }
  if (sets.length === 0) return;
  await pool.query(`UPDATE categories SET ${sets.join(', ')} WHERE id = :id`, params);
}

export async function categoryHasMenuItems(categoryId) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count FROM menu_items WHERE category_id = :categoryId AND is_active = TRUE`,
    { categoryId },
  );
  return rows[0].count > 0;
}
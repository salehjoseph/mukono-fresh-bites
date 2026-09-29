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
import { pool } from '../config/db.js';

export async function findActiveZones() {
  const [rows] = await pool.query(
    `SELECT id, name, fee_ugx, estimated_minutes
     FROM delivery_zones
     WHERE is_active = TRUE
     ORDER BY name ASC`,
  );
  return rows;
}
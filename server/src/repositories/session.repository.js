import { pool } from '../config/db.js';
import crypto from 'crypto';

export async function createSession(userId) {
  const id = crypto.randomBytes(32).toString('hex'); // 256-bit random session token
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await pool.query(
    `INSERT INTO sessions (id, user_id, expires_at) VALUES (:id, :userId, :expiresAt)`,
    { id, userId, expiresAt },
  );
  return { id, expiresAt };
}

export async function findValidSession(sessionId) {
  const [rows] = await pool.query(
    `SELECT s.id, s.user_id, s.expires_at, u.name, u.email, u.role, u.is_active
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.id = :sessionId AND s.expires_at > NOW()`,
    { sessionId },
  );
  return rows[0] || null;
}

export async function deleteSession(sessionId) {
  await pool.query(`DELETE FROM sessions WHERE id = :sessionId`, { sessionId });
}
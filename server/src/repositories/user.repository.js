import { pool } from '../config/db.js';

export async function findUserByEmail(email) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = :email`, { email });
  return rows[0] || null;
}

export async function recordFailedLogin(userId, attempts, lockedUntil) {
  await pool.query(
    `UPDATE users SET failed_login_attempts = :attempts, locked_until = :lockedUntil WHERE id = :userId`,
    { userId, attempts, lockedUntil },
  );
}

export async function resetFailedLogins(userId) {
  await pool.query(
    `UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = :userId`,
    { userId },
  );
}
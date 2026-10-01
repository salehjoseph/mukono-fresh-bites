import * as userRepo from '../repositories/user.repository.js';
import * as sessionRepo from '../repositories/session.repository.js';
import { verifyPassword } from '../utils/password.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

function authError(message) {
  const err = new Error(message);
  err.status = 401;
  err.code = 'INVALID_CREDENTIALS';
  return err;
}

export async function login(email, password) {
  const user = await userRepo.findUserByEmail(email);

  // Deliberately identical error for "no such user" and "wrong password" —
  // telling an attacker which one is true would leak which emails have accounts.
  if (!user || !user.is_active) {
    throw authError('Invalid email or password.');
  }

  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    const err = new Error('Account temporarily locked due to repeated failed attempts. Try again later.');
    err.status = 423;
    err.code = 'ACCOUNT_LOCKED';
    throw err;
  }

  const valid = await verifyPassword(user.password_hash, password);

  if (!valid) {
    const attempts = user.failed_login_attempts + 1;
    const lockedUntil =
      attempts >= MAX_FAILED_ATTEMPTS
        ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
        : null;
    await userRepo.recordFailedLogin(user.id, attempts, lockedUntil);
    throw authError('Invalid email or password.');
  }

  await userRepo.resetFailedLogins(user.id);
  const session = await sessionRepo.createSession(user.id);

  return {
    session,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export async function logout(sessionId) {
  await sessionRepo.deleteSession(sessionId);
}

export async function getCurrentUser(sessionId) {
  const session = await sessionRepo.findValidSession(sessionId);
  if (!session || !session.is_active) return null;
  return { id: session.user_id, name: session.name, email: session.email, role: session.role };
}
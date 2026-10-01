import * as sessionRepo from '../repositories/session.repository.js';

const COOKIE_NAME = 'mfb_session';

function unauthorized(res) {
  return res.status(401).json({
    success: false,
    error: { code: 'UNAUTHORIZED', message: 'You must be logged in to do that.' },
  });
}

function forbidden(res) {
  return res.status(403).json({
    success: false,
    error: { code: 'FORBIDDEN', message: 'You do not have permission to do that.' },
  });
}

// Confirms the request has a valid, non-expired session and attaches the user to req.user.
// Any route using this middleware is now protected — no session, no access.
export async function requireAuth(req, res, next) {
  try {
    const sessionId = req.cookies?.[COOKIE_NAME];
    if (!sessionId) return unauthorized(res);

    const session = await sessionRepo.findValidSession(sessionId);
    if (!session || !session.is_active) return unauthorized(res);

    req.user = {
      id: session.user_id,
      name: session.name,
      email: session.email,
      role: session.role,
    };
    next();
  } catch (err) {
    next(err);
  }
}

// Use AFTER requireAuth on routes that need a specific role, e.g. requireRole('ADMIN').
// Accepts one or more allowed roles: requireRole('ADMIN', 'STAFF').
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return unauthorized(res); // safety net if used without requireAuth by mistake
    if (!allowedRoles.includes(req.user.role)) return forbidden(res);
    next();
  };
}
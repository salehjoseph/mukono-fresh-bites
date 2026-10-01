import * as authService from '../services/auth.service.js';

const COOKIE_NAME = 'mfb_session';
const isProd = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true, // JavaScript on the page can never read this cookie — blocks a whole class of XSS cookie theft
  secure: isProd, // only sent over HTTPS in production; allowed over plain HTTP in local dev
  sameSite: 'lax', // blocks the cookie being sent on most cross-site requests — a CSRF defense
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email and password are required.' },
      });
    }

    const { session, user } = await authService.login(email, password);
    res.cookie(COOKIE_NAME, session.id, cookieOptions);
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const sessionId = req.cookies?.[COOKIE_NAME];
    if (sessionId) await authService.logout(sessionId);
    res.clearCookie(COOKIE_NAME, { path: '/' });
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const sessionId = req.cookies?.[COOKIE_NAME];
    const user = sessionId ? await authService.getCurrentUser(sessionId) : null;
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
}
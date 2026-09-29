import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ success: true, data: { status: 'ok', database: 'connected' } });
  } catch  {
    // Do not leak connection details in the response.
    res.status(503).json({
      success: false,
      error: { code: 'DB_UNAVAILABLE', message: 'Database is unavailable' },
    });
  }
});

export default router;
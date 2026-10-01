import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import menuRoutes from './routes/menu.routes.js';
import orderRoutes from './routes/order.routes.js';
import deliveryZoneRoutes from './routes/deliveryZone.routes.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());

  app.use('/api/v1', healthRoutes);
  app.use('/api/v1', menuRoutes);
  app.use('/api/v1', orderRoutes);
  app.use('/api/v1', deliveryZoneRoutes);
  app.use('/api/v1', authRoutes);

  // 404 for unknown API routes
  app.use('/api', (req, res) => {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } });
  });

  // Centralized error handler. Must be last, and must have 4 args for Express to recognize it.
  app.use((err, req, res, _next) => {
    console.error(err); // TODO: replace with structured logger in Phase 32 (logging)
    const status = err.status || 500;
    res.status(status).json({
      success: false,
      error: {
        code: err.code || 'INTERNAL_ERROR',
        message: env.nodeEnv === 'production' ? 'Something went wrong' : err.message,
      },
    });
  });

  return app;
}
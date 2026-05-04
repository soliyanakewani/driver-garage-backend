import express from 'express';
import cors from 'cors';
import path from 'path';

export const createServer = () => {
  const app = express();
  // Render / reverse proxies send X-Forwarded-*; required for express-rate-limit and correct req.ip
  app.set('trust proxy', 1);
  app.use(cors());
  app.use(express.json());
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: {
        hasFirebaseKey: Boolean(process.env.FIREBASE_PRIVATE_KEY?.trim()),
        hasJwtSecret: Boolean(process.env.JWT_SECRET?.trim()),
        hasSmtpHost: Boolean(process.env.SMTP_HOST?.trim()),
        nodeEnv: process.env.NODE_ENV ?? null,
      },
    });
  });

  return app;
};

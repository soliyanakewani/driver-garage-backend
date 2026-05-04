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
  return app;
};

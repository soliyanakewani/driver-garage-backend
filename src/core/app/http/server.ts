import express from 'express';
import cors from 'cors';
import path from 'path';

export const createServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  return app;
};

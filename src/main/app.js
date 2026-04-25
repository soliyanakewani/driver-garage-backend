import express from 'express';
import path from 'path';
import { registerRoutes } from './routes.js';

const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
registerRoutes(app);

export default app;

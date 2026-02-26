import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  id: string;
  role: string;
}

export const verifyAdminJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (payload.role !== 'ADMIN') return res.status(403).json({ error: 'Admin access required' });
    (req as Request & { user: JwtPayload }).user = payload;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
};

export const verifyDriverJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (payload.role !== 'DRIVER') return res.status(403).json({ error: 'Driver access required' });
    (req as Request & { user: JwtPayload }).user = payload;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
};
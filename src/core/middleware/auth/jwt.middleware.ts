import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  role?: string;
}

const verifyJWT = (allowedRole: string) => (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (allowedRole && payload.role !== allowedRole) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    (req as Request & { user: JwtPayload }).user = payload;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
};

export const verifyAdminJWT = verifyJWT('ADMIN');
export const verifyDriverJWT = verifyJWT('DRIVER');
export const verifyGarageJWT = verifyJWT('GARAGE');
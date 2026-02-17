import { Request, Response, NextFunction } from 'express';

// Extend Express Request interface to include 'user' property
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  role: 'ADMIN' | 'DRIVER' | 'GARAGE';
}

export const adminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
};

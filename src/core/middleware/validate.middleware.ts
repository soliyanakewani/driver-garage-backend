import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const arr = errors.array();
    const first = arr[0] && typeof arr[0] === 'object' && 'msg' in arr[0] ? String((arr[0] as { msg: string }).msg) : 'Validation failed';
    return res.status(400).json({ error: first, errors: arr });
  }
  next();
};
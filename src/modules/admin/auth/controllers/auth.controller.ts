import { Request, Response } from 'express';
import { AdminAuthService } from '../services/auth.service';

const service = new AdminAuthService();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await service.login(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};
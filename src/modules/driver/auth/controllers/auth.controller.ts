import { Request, Response } from 'express';
import { DriverAuthService } from '../services/auth.service';

const service = new DriverAuthService();

export const signup = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        error: 'Request body is required. Set Content-Type: application/json and send JSON body.',
      });
    }
    const { firstName, lastName, email, phone, password } = body;
    const driver = await service.signup(firstName, lastName, email, phone, password);
    res.status(201).json(driver);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;
    const result = await service.login(phone, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};
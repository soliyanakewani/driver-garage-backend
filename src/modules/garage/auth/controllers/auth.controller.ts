import { Request, Response } from 'express';
import { GarageAuthService } from '../services/auth.service';

const service = new GarageAuthService();

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;
    const garage = await service.signup(name, email, phone, password);
    res.status(201).json(garage);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await service.login(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};
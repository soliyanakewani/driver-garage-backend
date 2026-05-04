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

export const firebaseSignIn = async (req: Request, res: Response) => {
  try {
    const { idToken, firstName, lastName, email, password } = req.body as {
      idToken: string;
      firstName: string;
      lastName: string;
      email: string;
      password?: string;
    };
    const result = await service.firebaseSignIn({
      idToken,
      firstName,
      lastName,
      email,
      password,
    });
    res.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Authentication failed';
    const lower = msg.toLowerCase();
    if (lower.includes('firebase admin is not configured')) {
      return res.status(503).json({ error: msg });
    }
    if (
      lower.includes('invalid') ||
      lower.includes('credential') ||
      lower.includes('token') ||
      lower.includes('jwt') ||
      lower.includes('phone number not found')
    ) {
      return res.status(401).json({ error: msg });
    }
    if (lower.includes('already registered')) {
      return res.status(409).json({ error: msg });
    }
    return res.status(400).json({ error: msg });
  }
};
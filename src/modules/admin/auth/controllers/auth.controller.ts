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

export const changePassword = async (req: Request, res: Response) => {
  try {
    const adminId = (req as any).admin?.id as string | undefined;
    if (!adminId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body ?? {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'currentPassword and newPassword are required' });
    }

    await service.changePassword(adminId, String(currentPassword), String(newPassword));
    res.json({ message: 'Password changed successfully' });
  } catch (err: any) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const status =
      message === 'Admin not found'
        ? 404
        : message === 'Current password is incorrect'
          ? 401
          : 400;

    res.status(status).json({ error: message });
  }
};
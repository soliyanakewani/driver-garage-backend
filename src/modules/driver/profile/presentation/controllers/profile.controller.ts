import { Request, Response } from 'express';
import { PrismaDriverProfileRepository } from '../../infrastructure/PrismaDriverProfileRepository';
import { GetDriverProfileUseCase } from '../../application/usercases/GetDriverProfileUseCase';
import { CreateDriverProfileUseCase } from '../../application/usercases/CreateDriverProfileUseCase';
import { UpdateDriverProfileUseCase } from '../../application/usercases/UpdateDriverProfileUseCase';
import { ChangeDriverPasswordUseCase } from '../../application/usercases/ChangeDriverPasswordUseCase';

const repo = new PrismaDriverProfileRepository();
const changeDriverPasswordUseCase = new ChangeDriverPasswordUseCase();


export const getProfile = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id;

    const useCase = new GetDriverProfileUseCase(repo);
    const profile = await useCase.execute(driverId);

    res.json(profile);
  } catch (err: any) {
    res.status(err.message === 'Driver not found' ? 404 : 400).json({ error: err.message });
  }
};

export const createProfile = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id;
    const useCase = new CreateDriverProfileUseCase(repo);
    const profile = await useCase.execute(driverId, req.body);
    res.status(201).json(profile);
  } catch (err: any) {
    res.status(err.message === 'Driver not found' ? 404 : 400).json({ error: err.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id;
    const useCase = new UpdateDriverProfileUseCase(repo);
    const profile = await useCase.execute(driverId, req.body);
    res.json(profile);
  } catch (err: any) {
    const status =
      err.message === 'Driver not found'
        ? 404
        : err.message === 'Email already in use' || err.message === 'Phone already in use'
          ? 409
          : 400;
    res.status(status).json({ error: err.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body ?? {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'currentPassword and newPassword are required' });
    }
    await changeDriverPasswordUseCase.execute(driverId, String(currentPassword), String(newPassword));
    res.json({ message: 'Password changed successfully' });
  } catch (err: any) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const status =
      message === 'Driver not found'
        ? 404
        : message === 'Current password is incorrect'
          ? 401
          : 400;
    res.status(status).json({ error: message });
  }
};

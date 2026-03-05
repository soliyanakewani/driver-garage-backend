import { Request, Response } from 'express';
import { DriverProfileService } from '../services/profile.service';

const service = new DriverProfileService();

export const getProfile = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id;
    const profile = await service.getByDriverId(driverId);
    res.json(profile);
  } catch (err: any) {
    res.status(err.message === 'Driver not found' ? 404 : 400).json({ error: err.message });
  }
};

export const createProfile = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id;
    const profile = await service.create(driverId, req.body);
    res.status(201).json(profile);
  } catch (err: any) {
    res.status(err.message === 'Driver not found' ? 404 : 400).json({ error: err.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id;
    const profile = await service.update(driverId, req.body);
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

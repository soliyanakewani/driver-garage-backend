import { Request, Response } from 'express';
import { JwtPayload } from '../../../../core/middleware/auth/jwt.middleware';
import { DriverVehiclesService } from '../services/vehicles.service';

const service = new DriverVehiclesService();

const vehicleIdParam = (params: Request['params'], key: string): string => {
  const value = params[key];
  return Array.isArray(value) ? value[0] ?? '' : (value ?? '');
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const driverId = (req as Request & { user: JwtPayload }).user.id;
    const vehicle = await service.create(driverId, req.body);
    res.status(201).json(vehicle);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create vehicle';
    res.status(400).json({ error: message });
  }
};

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const driverId = (req as Request & { user: JwtPayload }).user.id;
    const vehicles = await service.findAll(driverId);
    res.json(vehicles);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch vehicles';
    res.status(500).json({ error: message });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const driverId = (req as Request & { user: JwtPayload }).user.id;
    const vehicleId = vehicleIdParam(req.params, 'vehicleId');
    const vehicle = await service.findOne(driverId, vehicleId);
    res.json(vehicle);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Vehicle not found';
    res.status(404).json({ error: message });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const driverId = (req as Request & { user: JwtPayload }).user.id;
    const vehicleId = vehicleIdParam(req.params, 'vehicleId');
    const vehicle = await service.update(driverId, vehicleId, req.body);
    res.json(vehicle);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update vehicle';
    res.status(400).json({ error: message });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const driverId = (req as Request & { user: JwtPayload }).user.id;
    const vehicleId = vehicleIdParam(req.params, 'vehicleId');
    const result = await service.delete(driverId, vehicleId);
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Vehicle not found';
    res.status(404).json({ error: message });
  }
};

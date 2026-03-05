import { Request, Response } from 'express';
import { VehicleRepository } from '../../infrastructure/repositories/vehicle.repository';
import { CreateVehicleUseCase } from '../../application/usecases/create-vehicle.usecase';
import { GetVehiclesUseCase } from '../../application/usecases/get-vehicles.usecase';
import { GetVehicleByIdUseCase } from '../../application/usecases/get-vehicle-by-id.usecase';
import { UpdateVehicleUseCase } from '../../application/usecases/update-vehicle.usecase';
import { DeleteVehicleUseCase } from '../../application/usecases/delete-vehicle.usecase';
import { JwtPayload } from '../../../../../core/middleware/auth/jwt.middleware';

const repository = new VehicleRepository();
const createVehicleUseCase = new CreateVehicleUseCase(repository);
const getVehiclesUseCase = new GetVehiclesUseCase(repository);
const getVehicleByIdUseCase = new GetVehicleByIdUseCase(repository);
const updateVehicleUseCase = new UpdateVehicleUseCase(repository);
const deleteVehicleUseCase = new DeleteVehicleUseCase(repository);

const vehicleIdParam = (params: Request['params'], key: string): string => {
  const value = params[key];
  return Array.isArray(value) ? value[0] ?? '' : (value ?? '');
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const driverId = (req as Request & { user: JwtPayload }).user.id;
    const vehicle = await createVehicleUseCase.execute(driverId, req.body);
    res.status(201).json(vehicle);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create vehicle';
    res.status(400).json({ error: message });
  }
};

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const driverId = (req as Request & { user: JwtPayload }).user.id;
    const vehicles = await getVehiclesUseCase.execute(driverId);
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
    const vehicle = await getVehicleByIdUseCase.execute(driverId, vehicleId);
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
    const vehicle = await updateVehicleUseCase.execute(driverId, vehicleId, req.body);
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
    const result = await deleteVehicleUseCase.execute(driverId, vehicleId);
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Vehicle not found';
    res.status(404).json({ error: message });
  }
};

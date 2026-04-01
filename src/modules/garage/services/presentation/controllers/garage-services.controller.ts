import { Request, Response } from 'express';
import { PrismaGarageServiceRepository } from '../../infrastructure/repositories/prisma-garage-service.repository';
import { CreateGarageServiceUseCase } from '../../application/usecases/create-service.usecase';
import { UpdateGarageServiceUseCase } from '../../application/usecases/update-service.usecase';
import { DeleteGarageServiceUseCase } from '../../application/usecases/delete-service.usecase';
import { ListGarageServicesUseCase } from '../../application/usecases/list-services.usecase';
import { ReplaceGarageServicesUseCase } from '../../application/usecases/replace-services.usecase';
import { CreateServiceRequestDto } from '../../application/dto/create-service.dto';
import { UpdateServiceRequestDto } from '../../application/dto/update-service.dto';
import { ReplaceServicesRequestDto } from '../../application/dto/replace-services.dto';
import { GarageServiceResponseDto } from '../../application/dto/service-response.dto';

const repository = new PrismaGarageServiceRepository();
const createUseCase = new CreateGarageServiceUseCase(repository);
const updateUseCase = new UpdateGarageServiceUseCase(repository);
const deleteUseCase = new DeleteGarageServiceUseCase(repository);
const listUseCase = new ListGarageServicesUseCase(repository);
const replaceUseCase = new ReplaceGarageServicesUseCase(repository);

export const listMyServices = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const services = await listUseCase.execute({ garageId });
    res.json(services.map(GarageServiceResponseDto.from));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/** PUT /garages/me/services – replace all services with the given list (same as UI sends on create/update). */
export const replaceServices = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const dto = ReplaceServicesRequestDto.from(req.body);
    const services = await replaceUseCase.execute({ garageId, services: dto.services });
    res.json(services.map(GarageServiceResponseDto.from));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/** POST /garages/me/services – accept either single { "name": "..." } or list { "services": [ ... ] }. */
export const createService = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const body = req.body as Record<string, unknown>;
    const hasList = Array.isArray(body?.services) || (typeof body?.services_offered === 'string' && body.services_offered.length > 0);
    if (hasList) {
      const dto = ReplaceServicesRequestDto.from(req.body);
      const services = await replaceUseCase.execute({ garageId, services: dto.services });
      return res.status(200).json(services.map(GarageServiceResponseDto.from));
    }
    const dto = CreateServiceRequestDto.from(req.body);
    const created = await createUseCase.execute({ garageId, name: dto.name });
    res.status(201).json(GarageServiceResponseDto.from(created));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/** PATCH /garages/me/services/:id – rename one service. For updating the full list, use PUT /garages/me/services with { "services": [...] }. */
export const updateService = async (req: Request, res: Response) => {
  try {
    const body = req.body as Record<string, unknown>;
    if (Array.isArray(body?.services)) {
      return res.status(400).json({
        error: 'To update the full list of services, use PUT /garages/me/services (no id) with body { "services": ["Name1", "Name2", ...] }. This PATCH endpoint is only for renaming one service: send { "name": "New Name" }.',
      });
    }
    const garageId = (req as any).user.id as string;
    const serviceId = String((req.params as any).id);
    const dto = UpdateServiceRequestDto.from(req.body);
    const updated = await updateUseCase.execute({
      garageId,
      serviceId,
      updates: { name: dto.name },
    });
    res.json(GarageServiceResponseDto.from(updated));
  } catch (err: any) {
    const code = err.message === 'Service not found' ? 404 : 400;
    res.status(code).json({ error: err.message });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const serviceId = String((req.params as any).id);
    await deleteUseCase.execute({ garageId, serviceId });
    res.status(204).send();
  } catch (err: any) {
    const code = err.message === 'Service not found' ? 404 : 400;
    res.status(code).json({ error: err.message });
  }
};

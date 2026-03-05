import { Request, Response } from 'express';
import { PrismaGarageServiceRepository } from '../../infrastructure/repositories/prisma-garage-service.repository';
import { CreateGarageServiceUseCase } from '../../application/usecases/create-service.usecase';
import { UpdateGarageServiceUseCase } from '../../application/usecases/update-service.usecase';
import { DeleteGarageServiceUseCase } from '../../application/usecases/delete-service.usecase';
import { ListGarageServicesUseCase } from '../../application/usecases/list-services.usecase';
import { CreateServiceRequestDto } from '../../application/dto/create-service.dto';
import { UpdateServiceRequestDto } from '../../application/dto/update-service.dto';
import { GarageServiceResponseDto } from '../../application/dto/service-response.dto';

const repository = new PrismaGarageServiceRepository();
const createUseCase = new CreateGarageServiceUseCase(repository);
const updateUseCase = new UpdateGarageServiceUseCase(repository);
const deleteUseCase = new DeleteGarageServiceUseCase(repository);
const listUseCase = new ListGarageServicesUseCase(repository);

export const listMyServices = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const services = await listUseCase.execute({ garageId });
    res.json(services.map(GarageServiceResponseDto.from));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const dto = CreateServiceRequestDto.from(req.body);
    const created = await createUseCase.execute({ garageId, name: dto.name });
    res.status(201).json(GarageServiceResponseDto.from(created));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
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

import { Request, Response } from 'express';
import { PrismaGarageServiceRepository } from '../../infrastructure/repositories/prisma-garage-service.repository';
import { ListGarageServicesUseCase } from '../../application/usecases/list-services.usecase';
import { GarageServiceResponseDto } from '../../application/dto/service-response.dto';

const repository = new PrismaGarageServiceRepository();
const listUseCase = new ListGarageServicesUseCase(repository);

export const listGarageServicesForDriver = async (req: Request, res: Response) => {
  try {
    const garageId = String((req.params as any).garageId);
    const services = await listUseCase.execute({ garageId });
    res.json(services.map(GarageServiceResponseDto.from));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

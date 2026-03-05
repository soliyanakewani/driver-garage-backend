import { Request, Response } from 'express';
import { PrismaGarageAvailabilityRepository } from '../../infrastructure/repositories/prisma-availability.repository';
import { ListAvailabilitySlotsUseCase } from '../../application/usecases/list-slots.usecase';
import { ListSlotsQueryDto } from '../../application/dto/list-slots-query.dto';
import { AvailabilitySlotResponseDto } from '../../application/dto/availability-slot-response.dto';

const repository = new PrismaGarageAvailabilityRepository();
const listUseCase = new ListAvailabilitySlotsUseCase(repository);

export const listGarageSlotsForDriver = async (req: Request, res: Response) => {
  try {
    const garageId = String((req.params as any).garageId);
    const queryDto = ListSlotsQueryDto.from(req.query);
    const slots = await listUseCase.execute({ garageId, dayOfWeek: queryDto.dayOfWeek });
    res.json(slots.map(AvailabilitySlotResponseDto.from));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};


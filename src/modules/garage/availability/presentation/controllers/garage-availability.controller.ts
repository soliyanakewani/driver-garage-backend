import { Request, Response } from 'express';
import { PrismaGarageAvailabilityRepository } from '../../infrastructure/repositories/prisma-availability.repository';
import { CreateAvailabilitySlotUseCase } from '../../application/usecases/create-slot.usecase';
import { UpdateAvailabilitySlotUseCase } from '../../application/usecases/update-slot.usecase';
import { DeleteAvailabilitySlotUseCase } from '../../application/usecases/delete-slot.usecase';
import { ListAvailabilitySlotsUseCase } from '../../application/usecases/list-slots.usecase';
import { CreateAvailabilitySlotRequestDto } from '../../application/dto/create-slot.dto';
import { UpdateAvailabilitySlotRequestDto } from '../../application/dto/update-slot.dto';
import { ListSlotsQueryDto } from '../../application/dto/list-slots-query.dto';
import { AvailabilitySlotResponseDto } from '../../application/dto/availability-slot-response.dto';

const repository = new PrismaGarageAvailabilityRepository();
const createUseCase = new CreateAvailabilitySlotUseCase(repository);
const updateUseCase = new UpdateAvailabilitySlotUseCase(repository);
const deleteUseCase = new DeleteAvailabilitySlotUseCase(repository);
const listUseCase = new ListAvailabilitySlotsUseCase(repository);

export const listMySlots = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const queryDto = ListSlotsQueryDto.from(req.query);
    const slots = await listUseCase.execute({ garageId, dayOfWeek: queryDto.dayOfWeek });
    res.json(slots.map(AvailabilitySlotResponseDto.from));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const createSlot = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const dto = CreateAvailabilitySlotRequestDto.from(req.body);
    const created = await createUseCase.execute({
      garageId,
      dayOfWeek: dto.dayOfWeek,
      startMinute: dto.startMinute,
      endMinute: dto.endMinute,
    });
    res.status(201).json(AvailabilitySlotResponseDto.from(created));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateSlot = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const slotId = String((req.params as any).id);
    const dto = UpdateAvailabilitySlotRequestDto.from(req.body);

    const updated = await updateUseCase.execute({
      garageId,
      slotId,
      updates: { dayOfWeek: dto.dayOfWeek, startMinute: dto.startMinute, endMinute: dto.endMinute },
    });

    res.json(AvailabilitySlotResponseDto.from(updated));
  } catch (err: any) {
    const code = err.message === 'Slot not found' ? 404 : 400;
    res.status(code).json({ error: err.message });
  }
};

export const deleteSlot = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const slotId = String((req.params as any).id);
    await deleteUseCase.execute({ garageId, slotId });
    res.status(204).send();
  } catch (err: any) {
    const code = err.message === 'Slot not found' ? 404 : 400;
    res.status(code).json({ error: err.message });
  }
};


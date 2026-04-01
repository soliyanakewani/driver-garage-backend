import { Request, Response } from 'express';
import { PrismaGarageSettingsRepository } from '../../infrastructure/repositories/prisma-garage-settings.repository';
import { GetSettingsUseCase } from '../../application/usecases/get-settings.usecase';
import { UpdateSettingsUseCase } from '../../application/usecases/update-settings.usecase';

const repository = new PrismaGarageSettingsRepository();
const getSettingsUseCase = new GetSettingsUseCase(repository);
const updateSettingsUseCase = new UpdateSettingsUseCase(repository);

export const getSettings = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user?.id as string;
    if (!garageId) return res.status(401).json({ error: 'Unauthorized' });
    const data = await getSettingsUseCase.execute(garageId);
    res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user?.id as string;
    if (!garageId) return res.status(401).json({ error: 'Unauthorized' });
    const data = typeof req.body === 'object' && req.body !== null ? req.body : {};
    const updated = await updateSettingsUseCase.execute(garageId, data as Record<string, unknown>);
    res.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

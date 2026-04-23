import { Request, Response } from 'express';
import { PrismaGarageRatingRepository } from '../../infrastructure/repositories/prisma-garage-rating.repository';
import { GetGarageRatingSummaryUseCase } from '../../application/usecases/get-rating-summary.usecase';

const repository = new PrismaGarageRatingRepository();
const summaryUseCase = new GetGarageRatingSummaryUseCase(repository);

export const getRatingSummary = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user?.id as string;
    if (!garageId) return res.status(401).json({ error: 'Unauthorized' });
    const summary = await summaryUseCase.execute(garageId);
    res.json(summary);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

export const getRatingSummaryByGarageId = async (req: Request, res: Response) => {
  try {
    const garageId = String(req.params.garageId ?? '').trim();
    if (!garageId) {
      return res.status(400).json({ error: 'garageId is required' });
    }
    const summary = await summaryUseCase.execute(garageId);
    res.json(summary);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

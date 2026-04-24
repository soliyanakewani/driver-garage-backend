import { Request, Response } from 'express';
import { PrismaGarageRatingRepository } from '../../infrastructure/repositories/prisma-garage-rating.repository';
import { GetGarageRatingSummaryUseCase } from '../../application/usecases/get-rating-summary.usecase';
import { GetGarageRatingsAndReviewsUseCase } from '../../application/usecases/get-ratings-and-reviews.usecase';

const repository = new PrismaGarageRatingRepository();
const summaryUseCase = new GetGarageRatingSummaryUseCase(repository);
const ratingsAndReviewsUseCase = new GetGarageRatingsAndReviewsUseCase(repository);

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

export const getRatingsAndReviewsForGarage = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user?.id as string;
    if (!garageId) return res.status(401).json({ error: 'Unauthorized' });
    const data = await ratingsAndReviewsUseCase.execute(garageId);
    res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

export const getRatingsAndReviewsByGarageId = async (req: Request, res: Response) => {
  try {
    const garageId = String(req.params.garageId ?? '').trim();
    if (!garageId) {
      return res.status(400).json({ error: 'garageId is required' });
    }
    const data = await ratingsAndReviewsUseCase.execute(garageId);
    res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

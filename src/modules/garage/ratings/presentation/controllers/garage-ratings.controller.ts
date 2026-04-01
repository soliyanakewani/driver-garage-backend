import { Request, Response } from 'express';
import { PrismaGarageRatingRepository } from '../../infrastructure/repositories/prisma-garage-rating.repository';
import { ListRatingsUseCase } from '../../application/usecases/list-ratings.usecase';
import { GetRatingByIdUseCase } from '../../application/usecases/get-rating-by-id.usecase';

const repository = new PrismaGarageRatingRepository();
const listUseCase = new ListRatingsUseCase(repository);
const getByIdUseCase = new GetRatingByIdUseCase(repository);

export const listRatings = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user?.id as string;
    if (!garageId) return res.status(401).json({ error: 'Unauthorized' });
    const ratings = await listUseCase.execute(garageId);
    res.json(ratings);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

export const getRatingById = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user?.id as string;
    if (!garageId) return res.status(401).json({ error: 'Unauthorized' });
    const ratingId = String((req.params as any).ratingId);
    const rating = await getByIdUseCase.execute(garageId, ratingId);
    res.json(rating);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(message === 'Rating not found' ? 404 : 400).json({ error: message });
  }
};

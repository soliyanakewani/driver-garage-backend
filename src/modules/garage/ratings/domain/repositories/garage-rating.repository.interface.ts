export interface IGarageRatingRepository {
  listByGarageId(garageId: string): Promise<unknown[]>;
  getById(garageId: string, ratingId: string): Promise<unknown>;
}

export interface GarageRatingSummary {
  /** Average star rating (1–5), null when there are no ratings yet. */
  averageRating: number | null;
  /** Number of ratings received. */
  totalRatings: number;
}

export interface IGarageRatingRepository {
  getSummary(garageId: string): Promise<GarageRatingSummary>;
}

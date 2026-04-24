export interface GarageRatingSummary {
  /** Average star rating (1–5), null when there are no ratings yet. */
  averageRating: number | null;
  /** Number of ratings received. */
  totalRatings: number;
}

export interface GarageReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  driver: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface GarageRatingsAndReviews {
  averageRating: number | null;
  totalRatings: number;
  reviews: GarageReviewItem[];
}

export interface IGarageRatingRepository {
  getSummary(garageId: string): Promise<GarageRatingSummary>;
  getRatingsAndReviews(garageId: string): Promise<GarageRatingsAndReviews>;
}

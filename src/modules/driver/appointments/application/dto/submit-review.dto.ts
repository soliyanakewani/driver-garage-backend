export class SubmitReviewDto {
  constructor(
    public readonly rating: number,
    public readonly comment?: string
  ) {}

  static from(body: unknown): SubmitReviewDto {
    if (!body || typeof body !== 'object') throw new Error('Invalid request body');
    const b = body as Record<string, unknown>;
    const rating = Number(b.rating);
    if (!Number.isFinite(rating)) throw new Error('rating is required');
    if (rating < 1 || rating > 5) throw new Error('rating must be between 1 and 5');
    const comment = typeof b.comment === 'string' ? b.comment : undefined;
    return new SubmitReviewDto(rating, comment);
  }
}

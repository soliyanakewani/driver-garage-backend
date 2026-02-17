export class BookAppointmentRequestDto {
  constructor(
    public readonly garageId: string,
    public readonly scheduledAt: Date,
    public readonly serviceDescription: string
  ) {}

  static from(body: unknown): BookAppointmentRequestDto {
    if (!body || typeof body !== 'object') throw new Error('Invalid request body');

    const b = body as any;
    const garageId = String(b.garageId ?? '').trim();
    const scheduledAtRaw = b.scheduledAt;
    const serviceDescription = String(b.serviceDescription ?? '').trim();

    if (!garageId) throw new Error('garageId and scheduledAt are required');
    if (!scheduledAtRaw) throw new Error('garageId and scheduledAt are required');

    const scheduledAt = new Date(scheduledAtRaw);
    if (Number.isNaN(scheduledAt.getTime())) throw new Error('scheduledAt must be a valid date');

    return new BookAppointmentRequestDto(garageId, scheduledAt, serviceDescription);
  }
}


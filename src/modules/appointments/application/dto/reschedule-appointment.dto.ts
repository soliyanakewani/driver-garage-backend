export class RescheduleAppointmentRequestDto {
  constructor(public readonly scheduledAt: Date) {}

  static from(body: unknown): RescheduleAppointmentRequestDto {
    if (!body || typeof body !== 'object') throw new Error('Invalid request body');
    const b = body as any;
    if (!b.scheduledAt) throw new Error('scheduledAt is required');

    const scheduledAt = new Date(b.scheduledAt);
    if (Number.isNaN(scheduledAt.getTime())) throw new Error('scheduledAt must be a valid date');

    return new RescheduleAppointmentRequestDto(scheduledAt);
  }
}


export class BookAppointmentRequestDto {
  constructor(
    public readonly garageId: string,
    public readonly vehicleId: string,
    public readonly scheduledAt: Date,
    public readonly serviceDescription: string
  ) {}

  static from(body: unknown): BookAppointmentRequestDto {
    if (!body || typeof body !== 'object') {
      throw new Error(
        'Request body is required. Set Content-Type: application/json and send JSON with garageId, vehicleId, scheduledAt, and serviceDescription.'
      );
    }

    const b = body as any;
    const garageId = String(b.garageId ?? '').trim();
    const vehicleId = String(b.vehicleId ?? '').trim();
    const scheduledAtRaw = b.scheduledAt;
    const serviceDescription = String(b.serviceDescription ?? '').trim();

    if (!garageId) throw new Error('garageId is required');
    if (!vehicleId) throw new Error('vehicleId is required — please specify which vehicle is being serviced');
    if (!scheduledAtRaw) throw new Error('scheduledAt is required');

    const scheduledAt = new Date(scheduledAtRaw);
    if (Number.isNaN(scheduledAt.getTime())) throw new Error('scheduledAt must be a valid date');

    return new BookAppointmentRequestDto(garageId, vehicleId, scheduledAt, serviceDescription);
  }
}

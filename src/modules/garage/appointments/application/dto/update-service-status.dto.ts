import { AppointmentStatus } from '../../domain/entities/appointment.entity';

const VALID_STATUSES = new Set<string>(Object.values(AppointmentStatus));

export class UpdateServiceStatusRequestDto {
  constructor(public readonly status: AppointmentStatus) {}

  static from(body: unknown): UpdateServiceStatusRequestDto {
    if (!body || typeof body !== 'object') throw new Error('Invalid request body');
    const b = body as any;
    const status = String(b.status ?? '').trim().toUpperCase();

    if (!status) throw new Error('status is required');
    if (!VALID_STATUSES.has(status)) {
      throw new Error(
        `status must be one of: ${Array.from(VALID_STATUSES).join(', ')}`
      );
    }

    return new UpdateServiceStatusRequestDto(status as AppointmentStatus);
  }
}

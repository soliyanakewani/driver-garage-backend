import { AppointmentStatus } from '../../domain/entities/appointment.entity';

export class UpdateServiceStatusRequestDto {
  constructor(public readonly status: AppointmentStatus.InService | AppointmentStatus.Completed) {}

  static from(body: unknown): UpdateServiceStatusRequestDto {
    if (!body || typeof body !== 'object') throw new Error('Invalid request body');
    const b = body as any;
    const status = String(b.status ?? '').trim().toUpperCase();

    if (!status) throw new Error('status is required and must be IN_SERVICE or COMPLETED');
    if (status !== AppointmentStatus.InService && status !== AppointmentStatus.Completed) {
      throw new Error('status is required and must be IN_SERVICE or COMPLETED');
    }

    return new UpdateServiceStatusRequestDto(
      status as AppointmentStatus.InService | AppointmentStatus.Completed
    );
  }
}


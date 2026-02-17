import { AppointmentStatus } from '../../domain/entities/appointment.entity';

export class ListAppointmentsQueryDto {
  constructor(public readonly status?: AppointmentStatus) {}

  static from(query: unknown): ListAppointmentsQueryDto {
    if (!query || typeof query !== 'object') return new ListAppointmentsQueryDto(undefined);
    const q = query as any;
    const statusRaw = q.status as string | undefined;
    if (!statusRaw) return new ListAppointmentsQueryDto(undefined);

    const status = statusRaw.trim().toUpperCase();
    const allowed: string[] = [
      AppointmentStatus.Pending,
      AppointmentStatus.Approved,
      AppointmentStatus.Rejected,
      AppointmentStatus.InService,
      AppointmentStatus.Completed,
      AppointmentStatus.Cancelled,
    ];

    if (!allowed.includes(status)) {
      throw new Error(`Invalid status. Allowed: ${allowed.join(', ')}`);
    }

    return new ListAppointmentsQueryDto(status as AppointmentStatus);
  }
}


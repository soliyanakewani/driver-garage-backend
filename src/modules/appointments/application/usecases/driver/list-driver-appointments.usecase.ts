import { IAppointmentRepository } from '../../../domain/repositories/appointment.repository.interface';
import { Appointment, AppointmentStatus } from '../../../domain/entities/appointment.entity';

export interface ListDriverAppointmentsRequest {
  driverId: string;
  status?: AppointmentStatus;
}

export class ListDriverAppointmentsUseCase {
  constructor(private readonly repository: IAppointmentRepository) {}

  async execute(request: ListDriverAppointmentsRequest): Promise<Appointment[]> {
    return this.repository.findByDriver(request.driverId, request.status);
  }
}


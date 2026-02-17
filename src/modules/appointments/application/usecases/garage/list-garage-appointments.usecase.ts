import { IAppointmentRepository } from '../../../domain/repositories/appointment.repository.interface';
import { Appointment, AppointmentStatus } from '../../../domain/entities/appointment.entity';

export interface ListGarageAppointmentsRequest {
  garageId: string;
  status?: AppointmentStatus;
}

export class ListGarageAppointmentsUseCase {
  constructor(private readonly repository: IAppointmentRepository) {}

  async execute(request: ListGarageAppointmentsRequest): Promise<Appointment[]> {
    return this.repository.findByGarage(request.garageId, request.status);
  }
}


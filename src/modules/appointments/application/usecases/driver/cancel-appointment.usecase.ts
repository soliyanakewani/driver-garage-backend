import { IAppointmentRepository } from '../../../domain/repositories/appointment.repository.interface';
import { Appointment } from '../../../domain/entities/appointment.entity';

export interface CancelAppointmentRequest {
  driverId: string;
  id: string;
}

export class CancelAppointmentUseCase {
  constructor(private readonly repository: IAppointmentRepository) {}

  async execute(request: CancelAppointmentRequest): Promise<Appointment> {
    return this.repository.cancelForDriver(request.id, request.driverId);
  }
}


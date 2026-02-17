import { IAppointmentRepository } from '../../../domain/repositories/appointment.repository.interface';
import { Appointment } from '../../../domain/entities/appointment.entity';

export interface RescheduleAppointmentRequest {
  driverId: string;
  id: string;
  scheduledAt: Date;
}

export class RescheduleAppointmentUseCase {
  constructor(private readonly repository: IAppointmentRepository) {}

  async execute(request: RescheduleAppointmentRequest): Promise<Appointment> {
    return this.repository.rescheduleForDriver(request.id, request.driverId, request.scheduledAt);
  }
}


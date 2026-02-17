import { IAppointmentRepository } from '../../../domain/repositories/appointment.repository.interface';
import { Appointment } from '../../../domain/entities/appointment.entity';

export interface BookGarageAppointmentRequest {
  driverId: string;
  garageId: string;
  scheduledAt: Date;
  serviceDescription: string;
}

export class BookGarageAppointmentUseCase {
  constructor(private readonly repository: IAppointmentRepository) {}

  async execute(request: BookGarageAppointmentRequest): Promise<Appointment> {
    return this.repository.createForDriver(request);
  }
}


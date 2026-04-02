import { IAppointmentRepository } from '../../../../garage/appointments/domain/repositories/appointment.repository.interface';
import { Appointment } from '../../../../garage/appointments/domain/entities/appointment.entity';

export interface BookGarageAppointmentRequest {
  driverId: string;
  garageId: string;
  vehicleId: string;
  scheduledAt: Date;
  serviceDescription: string;
  garageServiceIds: string[];
}

export class BookGarageAppointmentUseCase {
  constructor(private readonly repository: IAppointmentRepository) {}

  async execute(request: BookGarageAppointmentRequest): Promise<Appointment> {
    return this.repository.createForDriver(request);
  }
}

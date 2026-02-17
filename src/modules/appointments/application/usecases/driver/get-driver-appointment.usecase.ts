import { IAppointmentRepository } from '../../../domain/repositories/appointment.repository.interface';
import { Appointment } from '../../../domain/entities/appointment.entity';

export interface GetDriverAppointmentRequest {
  driverId: string;
  id: string;
}

export class GetDriverAppointmentUseCase {
  constructor(private readonly repository: IAppointmentRepository) {}

  async execute(request: GetDriverAppointmentRequest): Promise<Appointment> {
    const appointment = await this.repository.findByIdForDriver(request.id, request.driverId);
    if (!appointment) throw new Error('Appointment not found');
    return appointment;
  }
}


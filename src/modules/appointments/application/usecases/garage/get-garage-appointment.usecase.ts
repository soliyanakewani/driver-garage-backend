import { IAppointmentRepository } from '../../../domain/repositories/appointment.repository.interface';
import { Appointment } from '../../../domain/entities/appointment.entity';

export interface GetGarageAppointmentRequest {
  garageId: string;
  id: string;
}

export class GetGarageAppointmentUseCase {
  constructor(private readonly repository: IAppointmentRepository) {}

  async execute(request: GetGarageAppointmentRequest): Promise<Appointment> {
    const appointment = await this.repository.findByIdForGarage(request.id, request.garageId);
    if (!appointment) throw new Error('Appointment not found');
    return appointment;
  }
}


import { IAppointmentRepository } from '../../../domain/repositories/appointment.repository.interface';
import { Appointment } from '../../../domain/entities/appointment.entity';

export interface RejectAppointmentRequest {
  garageId: string;
  id: string;
}

export class RejectAppointmentUseCase {
  constructor(private readonly repository: IAppointmentRepository) {}

  async execute(request: RejectAppointmentRequest): Promise<Appointment> {
    return this.repository.rejectForGarage(request.id, request.garageId);
  }
}


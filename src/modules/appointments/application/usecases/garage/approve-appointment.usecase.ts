import { IAppointmentRepository } from '../../../domain/repositories/appointment.repository.interface';
import { Appointment } from '../../../domain/entities/appointment.entity';

export interface ApproveAppointmentRequest {
  garageId: string;
  id: string;
}

export class ApproveAppointmentUseCase {
  constructor(private readonly repository: IAppointmentRepository) {}

  async execute(request: ApproveAppointmentRequest): Promise<Appointment> {
    return this.repository.approveForGarage(request.id, request.garageId);
  }
}


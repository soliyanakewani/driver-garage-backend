import { IAppointmentRepository } from '../../../domain/repositories/appointment.repository.interface';
import { Appointment, AppointmentStatus } from '../../../domain/entities/appointment.entity';

export interface UpdateServiceStatusRequest {
  garageId: string;
  id: string;
  status: AppointmentStatus.InService | AppointmentStatus.Completed;
}

export class UpdateServiceStatusUseCase {
  constructor(private readonly repository: IAppointmentRepository) {}

  async execute(request: UpdateServiceStatusRequest): Promise<Appointment> {
    return this.repository.updateServiceStatusForGarage(
      request.id,
      request.garageId,
      request.status
    );
  }
}


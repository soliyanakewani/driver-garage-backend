import { IAppointmentRepository } from '../../../../garage/appointments/domain/repositories/appointment.repository.interface';

export interface SubmitAppointmentReviewRequest {
  appointmentId: string;
  driverId: string;
  rating: number;
  comment?: string;
}

export class SubmitAppointmentReviewUseCase {
  constructor(private readonly repository: IAppointmentRepository) {}

  async execute(request: SubmitAppointmentReviewRequest): Promise<unknown> {
    return this.repository.submitReviewForCompletedAppointment(request);
  }
}

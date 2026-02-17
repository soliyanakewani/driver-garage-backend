import { Appointment, AppointmentStatus } from '../entities/appointment.entity';

export interface IAppointmentRepository {
  // Driver side
  createForDriver(input: {
    driverId: string;
    garageId: string;
    scheduledAt: Date;
    serviceDescription: string;
  }): Promise<Appointment>;

  findByDriver(driverId: string, status?: AppointmentStatus): Promise<Appointment[]>;

  findByIdForDriver(id: string, driverId: string): Promise<Appointment | null>;

  rescheduleForDriver(id: string, driverId: string, newScheduledAt: Date): Promise<Appointment>;

  cancelForDriver(id: string, driverId: string): Promise<Appointment>;

  // Garage side
  findByGarage(garageId: string, status?: AppointmentStatus): Promise<Appointment[]>;

  findByIdForGarage(id: string, garageId: string): Promise<Appointment | null>;

  approveForGarage(id: string, garageId: string): Promise<Appointment>;

  rejectForGarage(id: string, garageId: string): Promise<Appointment>;

  updateServiceStatusForGarage(
    id: string,
    garageId: string,
    status: AppointmentStatus.InService | AppointmentStatus.Completed
  ): Promise<Appointment>;
}


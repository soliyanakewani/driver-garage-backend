import { Appointment } from '../../domain/entities/appointment.entity';

export class AppointmentResponseDto {
  constructor(
    public readonly id: string,
    public readonly driverId: string,
    public readonly garageId: string,
    public readonly vehicleId: string | null,
    public readonly scheduledAt: string,
    public readonly serviceDescription: string,
    public readonly services: string[],
    public readonly status: string,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  static from(appointment: Appointment): AppointmentResponseDto {
    const json = appointment.toJSON();
    return new AppointmentResponseDto(
      json.id,
      json.driverId,
      json.garageId,
      json.vehicleId,
      json.scheduledAt.toISOString(),
      json.serviceDescription,
      json.services,
      json.status,
      json.createdAt.toISOString(),
      json.updatedAt.toISOString()
    );
  }
}

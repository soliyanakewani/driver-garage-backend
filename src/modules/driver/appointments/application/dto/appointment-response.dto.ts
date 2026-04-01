import { Appointment } from '../../../../garage/appointments/domain/entities/appointment.entity';

export interface VehicleSummary {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  color: string | null;
}

export class AppointmentResponseDto {
  constructor(
    public readonly id: string,
    public readonly driverId: string,
    public readonly garageId: string,
    public readonly vehicleId: string | null,
    public readonly scheduledAt: string,
    public readonly serviceDescription: string,
    public readonly status: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly garageName?: string,
    public readonly vehicle?: VehicleSummary | null
  ) {}

  static from(
    appointment: Appointment,
    extras?: { garageName?: string; vehicle?: VehicleSummary | null }
  ): AppointmentResponseDto {
    const json = appointment.toJSON();
    return new AppointmentResponseDto(
      json.id,
      json.driverId,
      json.garageId,
      json.vehicleId,
      json.scheduledAt.toISOString(),
      json.serviceDescription,
      json.status,
      json.createdAt.toISOString(),
      json.updatedAt.toISOString(),
      extras?.garageName,
      extras?.vehicle
    );
  }
}

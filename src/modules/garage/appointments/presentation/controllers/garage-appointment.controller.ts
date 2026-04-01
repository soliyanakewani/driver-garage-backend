import { Request, Response } from 'express';
import { PrismaAppointmentRepository } from '../../infrastructure/repositories/prisma-appointment.repository';
import { ListGarageAppointmentsUseCase } from '../../application/usecases/list-garage-appointments.usecase';
import { GetGarageAppointmentUseCase } from '../../application/usecases/get-garage-appointment.usecase';
import { ApproveAppointmentUseCase } from '../../application/usecases/approve-appointment.usecase';
import { RejectAppointmentUseCase } from '../../application/usecases/reject-appointment.usecase';
import { UpdateServiceStatusUseCase } from '../../application/usecases/update-service-status.usecase';
import { ListAppointmentsQueryDto } from '../../application/dto/list-appointments-query.dto';
import { UpdateServiceStatusRequestDto } from '../../application/dto/update-service-status.dto';
import { AppointmentResponseDto } from '../../application/dto/appointment-response.dto';
import { AppointmentStatus } from '../../domain/entities/appointment.entity';
import { prisma } from '../../../../../infrastructure/prisma/prisma.client';

const repository = new PrismaAppointmentRepository();
const listUseCase = new ListGarageAppointmentsUseCase(repository);
const getUseCase = new GetGarageAppointmentUseCase(repository);
const approveUseCase = new ApproveAppointmentUseCase(repository);
const rejectUseCase = new RejectAppointmentUseCase(repository);
const updateStatusUseCase = new UpdateServiceStatusUseCase(repository);

function buildVehicleSummary(v: any) {
  return {
    id: v.id,
    plateNumber: v.plateNumber,
    make: v.make,
    model: v.model,
    year: v.year,
    color: v.color ?? null,
    vin: v.vin ?? null,
    mileage: v.mileage ?? null,
    fuelType: v.fuelType ?? null,
  };
}

export const listAppointments = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const queryDto = ListAppointmentsQueryDto.from(req.query);
    const search =
      (req.query.search as string | undefined) ?? (req.query.q as string | undefined) ?? undefined;

    const appointments = await listUseCase.execute({ garageId, status: queryDto.status });

    const driverIds = Array.from(new Set(appointments.map((a) => a.toJSON().driverId)));
    const vehicleIds = appointments
      .map((a) => a.toJSON().vehicleId)
      .filter((id): id is string => id !== null);

    const [drivers, vehicles] = await Promise.all([
      prisma.driver.findMany({ where: { id: { in: driverIds } } }),
      vehicleIds.length > 0
        ? prisma.vehicle.findMany({ where: { id: { in: vehicleIds } } })
        : Promise.resolve([]),
    ]);

    const driverMap = new Map<string, (typeof drivers)[number]>();
    drivers.forEach((d) => driverMap.set(d.id, d));

    const vehicleMap = new Map<string, (typeof vehicles)[number]>();
    vehicles.forEach((v) => vehicleMap.set(v.id, v));

    const term = search?.trim().toLowerCase();

    const result = appointments
      .filter((appt) => {
        if (!term) return true;
        const json = appt.toJSON();
        const driver = driverMap.get(json.driverId);
        const vehicle = json.vehicleId ? vehicleMap.get(json.vehicleId) : undefined;

        const driverName =
          driver
            ? `${driver.firstName} ${driver.lastName}`.toLowerCase()
            : '';

        const matchesDriver = driverName.includes(term);
        const matchesVehicle = vehicle
          ? `${vehicle.make ?? ''} ${vehicle.model ?? ''}`.toLowerCase().includes(term) ||
            (vehicle.plateNumber ?? '').toLowerCase().includes(term)
          : false;

        return matchesDriver || matchesVehicle;
      })
      .map((appt) => {
        const base = AppointmentResponseDto.from(appt);
        const json = appt.toJSON();
        const driver = driverMap.get(json.driverId);
        const vehicle = json.vehicleId ? vehicleMap.get(json.vehicleId) : undefined;

        return {
          ...base,
          driver: driver
            ? {
                id: driver.id,
                firstName: driver.firstName,
                lastName: driver.lastName,
                email: driver.email,
                phone: driver.phone,
              }
            : null,
          vehicle: vehicle ? buildVehicleSummary(vehicle) : null,
        };
      });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const listAppointmentHistory = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const [completed, cancelled] = await Promise.all([
      listUseCase.execute({ garageId, status: AppointmentStatus.Completed }),
      listUseCase.execute({ garageId, status: AppointmentStatus.Cancelled }),
    ]);
    const combined = [...completed, ...cancelled].sort(
      (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    );
    res.json(combined.map((a) => AppointmentResponseDto.from(a)));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

export const getAppointment = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const id = String((req.params as any).id);
    const appointment = await getUseCase.execute({ garageId, id });
    const json = appointment.toJSON();

    const [driver, vehicle] = await Promise.all([
      prisma.driver.findUnique({ where: { id: json.driverId } }),
      json.vehicleId
        ? prisma.vehicle.findUnique({ where: { id: json.vehicleId } })
        : Promise.resolve(null),
    ]);

    const base = AppointmentResponseDto.from(appointment);

    res.json({
      ...base,
      driver: driver
        ? {
            id: driver.id,
            firstName: driver.firstName,
            lastName: driver.lastName,
            email: driver.email,
            phone: driver.phone,
          }
        : null,
      vehicle: vehicle ? buildVehicleSummary(vehicle) : null,
    });
  } catch (err: any) {
    const msg = err?.message ?? 'Internal error';
    res.status(msg === 'Appointment not found' ? 404 : 500).json({ error: msg });
  }
};

export const approveAppointment = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const id = String((req.params as any).id);
    const appointment = await approveUseCase.execute({ garageId, id });
    res.json(AppointmentResponseDto.from(appointment));
  } catch (err: any) {
    const code = err.message === 'Appointment not found' ? 404 : 400;
    res.status(code).json({ error: err.message });
  }
};

export const rejectAppointment = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const id = String((req.params as any).id);
    const appointment = await rejectUseCase.execute({ garageId, id });
    res.json(AppointmentResponseDto.from(appointment));
  } catch (err: any) {
    const code = err.message === 'Appointment not found' ? 404 : 400;
    res.status(code).json({ error: err.message });
  }
};

export const updateServiceStatus = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const id = String((req.params as any).id);
    const dto = UpdateServiceStatusRequestDto.from(req.body);

    const appointment = await updateStatusUseCase.execute({
      garageId,
      id,
      status: dto.status,
    });

    res.json(AppointmentResponseDto.from(appointment));
  } catch (err: any) {
    const code = err.message === 'Appointment not found' ? 404 : 400;
    res.status(code).json({ error: err.message });
  }
};

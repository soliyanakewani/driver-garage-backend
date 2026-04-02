import { Request, Response } from 'express';
import { PrismaAppointmentRepository } from '../../../../garage/appointments/infrastructure/repositories/prisma-appointment.repository';
import { BookGarageAppointmentUseCase } from '../../application/usecases/book-garage-appointment.usecase';
import { ListDriverAppointmentsUseCase } from '../../application/usecases/list-driver-appointments.usecase';
import { GetDriverAppointmentUseCase } from '../../application/usecases/get-driver-appointment.usecase';
import { RescheduleAppointmentUseCase } from '../../application/usecases/reschedule-appointment.usecase';
import { CancelAppointmentUseCase } from '../../application/usecases/cancel-appointment.usecase';
import { BookAppointmentRequestDto } from '../../application/dto/book-appointment.dto';
import { RescheduleAppointmentRequestDto } from '../../application/dto/reschedule-appointment.dto';
import { ListAppointmentsQueryDto } from '../../application/dto/list-appointments-query.dto';
import { AppointmentResponseDto } from '../../application/dto/appointment-response.dto';
import { prisma } from '../../../../../infrastructure/prisma/prisma.client';

const repository = new PrismaAppointmentRepository();
const bookUseCase = new BookGarageAppointmentUseCase(repository);
const listUseCase = new ListDriverAppointmentsUseCase(repository);
const getUseCase = new GetDriverAppointmentUseCase(repository);
const rescheduleUseCase = new RescheduleAppointmentUseCase(repository);
const cancelUseCase = new CancelAppointmentUseCase(repository);

async function enrichAppointment(
  appt: Awaited<ReturnType<typeof getUseCase.execute>>
) {
  const json = appt.toJSON();

  const [garage, vehicle] = await Promise.all([
    prisma.garage.findUnique({
      where: { id: json.garageId },
      select: { id: true, name: true, address: true },
    }),
    json.vehicleId
      ? prisma.vehicle.findUnique({
          where: { id: json.vehicleId },
          select: { id: true, plateNumber: true, make: true, model: true, year: true, color: true },
        })
      : Promise.resolve(null),
  ]);

  return AppointmentResponseDto.from(appt, {
    garageName: garage?.name,
    vehicle: vehicle
      ? {
          id: vehicle.id,
          plateNumber: vehicle.plateNumber,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          color: vehicle.color ?? null,
        }
      : null,
  });
}

export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id as string;
    const dto = BookAppointmentRequestDto.from(req.body);

    const appointment = await bookUseCase.execute({
      driverId,
      garageId: dto.garageId,
      vehicleId: dto.vehicleId,
      scheduledAt: dto.scheduledAt,
      serviceDescription: dto.serviceDescription,
      garageServiceIds: dto.garageServiceIds,
    });

    res.status(201).json(await enrichAppointment(appointment));
  } catch (err: any) {
    const code = err.message?.includes('not found') || err.message?.includes('not belong') ? 404 : 400;
    res.status(code).json({ error: err.message });
  }
};

export const listAppointments = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id as string;
    const queryDto = ListAppointmentsQueryDto.from(req.query);
    const appointments = await listUseCase.execute({ driverId, status: queryDto.status });

    const enriched = await Promise.all(appointments.map(enrichAppointment));
    res.json(enriched);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAppointment = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id as string;
    const id = String((req.params as any).id);
    const appointment = await getUseCase.execute({ driverId, id });
    res.json(await enrichAppointment(appointment));
  } catch (err: any) {
    res.status(err.message === 'Appointment not found' ? 404 : 500).json({ error: err.message });
  }
};

export const rescheduleAppointment = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id as string;
    const id = String((req.params as any).id);
    const dto = RescheduleAppointmentRequestDto.from(req.body);

    const appointment = await rescheduleUseCase.execute({
      driverId,
      id,
      scheduledAt: dto.scheduledAt,
    });

    res.json(AppointmentResponseDto.from(appointment));
  } catch (err: any) {
    const code = err.message === 'Appointment not found' ? 404 : 400;
    res.status(code).json({ error: err.message });
  }
};

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id as string;
    const id = String((req.params as any).id);

    const appointment = await cancelUseCase.execute({ driverId, id });
    res.json(AppointmentResponseDto.from(appointment));
  } catch (err: any) {
    const code = err.message === 'Appointment not found' ? 404 : 400;
    res.status(code).json({ error: err.message });
  }
};

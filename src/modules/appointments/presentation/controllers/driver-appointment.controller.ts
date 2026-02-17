import { Request, Response } from 'express';
import { PrismaAppointmentRepository } from '../../infrastructure/repositories/prisma-appointment.repository';
import { BookGarageAppointmentUseCase } from '../../application/usecases/driver/book-garage-appointment.usecase';
import { ListDriverAppointmentsUseCase } from '../../application/usecases/driver/list-driver-appointments.usecase';
import { GetDriverAppointmentUseCase } from '../../application/usecases/driver/get-driver-appointment.usecase';
import { RescheduleAppointmentUseCase } from '../../application/usecases/driver/reschedule-appointment.usecase';
import { CancelAppointmentUseCase } from '../../application/usecases/driver/cancel-appointment.usecase';
import { BookAppointmentRequestDto } from '../../application/dto/book-appointment.dto';
import { RescheduleAppointmentRequestDto } from '../../application/dto/reschedule-appointment.dto';
import { ListAppointmentsQueryDto } from '../../application/dto/list-appointments-query.dto';
import { AppointmentResponseDto } from '../../application/dto/appointment-response.dto';

const repository = new PrismaAppointmentRepository();
const bookUseCase = new BookGarageAppointmentUseCase(repository);
const listUseCase = new ListDriverAppointmentsUseCase(repository);
const getUseCase = new GetDriverAppointmentUseCase(repository);
const rescheduleUseCase = new RescheduleAppointmentUseCase(repository);
const cancelUseCase = new CancelAppointmentUseCase(repository);

export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id as string;
    const dto = BookAppointmentRequestDto.from(req.body);

    const appointment = await bookUseCase.execute({
      driverId,
      garageId: dto.garageId,
      scheduledAt: dto.scheduledAt,
      serviceDescription: dto.serviceDescription,
    });

    res.status(201).json(AppointmentResponseDto.from(appointment));
  } catch (err: any) {
    const code = err.message?.includes('not found') ? 404 : 400;
    res.status(code).json({ error: err.message });
  }
};

export const listAppointments = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id as string;
    const queryDto = ListAppointmentsQueryDto.from(req.query);
    const appointments = await listUseCase.execute({ driverId, status: queryDto.status });

    res.json(appointments.map((a) => AppointmentResponseDto.from(a)));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAppointment = async (req: Request, res: Response) => {
  try {
    const driverId = (req as any).user.id as string;
    const id = String((req.params as any).id);
    const appointment = await getUseCase.execute({ driverId, id });
    res.json(AppointmentResponseDto.from(appointment));
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


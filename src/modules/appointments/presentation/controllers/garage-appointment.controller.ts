import { Request, Response } from 'express';
import { PrismaAppointmentRepository } from '../../infrastructure/repositories/prisma-appointment.repository';
import { ListGarageAppointmentsUseCase } from '../../application/usecases/garage/list-garage-appointments.usecase';
import { GetGarageAppointmentUseCase } from '../../application/usecases/garage/get-garage-appointment.usecase';
import { ApproveAppointmentUseCase } from '../../application/usecases/garage/approve-appointment.usecase';
import { RejectAppointmentUseCase } from '../../application/usecases/garage/reject-appointment.usecase';
import { UpdateServiceStatusUseCase } from '../../application/usecases/garage/update-service-status.usecase';
import { ListAppointmentsQueryDto } from '../../application/dto/list-appointments-query.dto';
import { UpdateServiceStatusRequestDto } from '../../application/dto/update-service-status.dto';
import { AppointmentResponseDto } from '../../application/dto/appointment-response.dto';

const repository = new PrismaAppointmentRepository();
const listUseCase = new ListGarageAppointmentsUseCase(repository);
const getUseCase = new GetGarageAppointmentUseCase(repository);
const approveUseCase = new ApproveAppointmentUseCase(repository);
const rejectUseCase = new RejectAppointmentUseCase(repository);
const updateStatusUseCase = new UpdateServiceStatusUseCase(repository);

export const listAppointments = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const queryDto = ListAppointmentsQueryDto.from(req.query);

    const appointments = await listUseCase.execute({ garageId, status: queryDto.status });
    res.json(appointments.map((a) => AppointmentResponseDto.from(a)));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAppointment = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const id = String((req.params as any).id);
    const appointment = await getUseCase.execute({ garageId, id });
    res.json(AppointmentResponseDto.from(appointment));
  } catch (err: any) {
    res.status(err.message === 'Appointment not found' ? 404 : 500).json({ error: err.message });
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


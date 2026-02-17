import { prisma } from '../../../../infrastructure/prisma/prisma.client';
import { Appointment, AppointmentStatus } from '../../domain/entities/appointment.entity';
import { IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';

type PrismaAppointmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_SERVICE' | 'COMPLETED' | 'CANCELLED';

interface PrismaAppointment {
  id: string;
  driverId: string;
  garageId: string;
  scheduledAt: Date;
  serviceDescription: string;
  status: PrismaAppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const PRISMA_TO_DOMAIN_STATUS: Record<PrismaAppointmentStatus, AppointmentStatus> = {
  PENDING: AppointmentStatus.Pending,
  APPROVED: AppointmentStatus.Approved,
  REJECTED: AppointmentStatus.Rejected,
  IN_SERVICE: AppointmentStatus.InService,
  COMPLETED: AppointmentStatus.Completed,
  CANCELLED: AppointmentStatus.Cancelled,
};

const DOMAIN_TO_PRISMA_STATUS: Record<AppointmentStatus, PrismaAppointmentStatus> = {
  [AppointmentStatus.Pending]: 'PENDING',
  [AppointmentStatus.Approved]: 'APPROVED',
  [AppointmentStatus.Rejected]: 'REJECTED',
  [AppointmentStatus.InService]: 'IN_SERVICE',
  [AppointmentStatus.Completed]: 'COMPLETED',
  [AppointmentStatus.Cancelled]: 'CANCELLED',
};

function mapFromPrisma(model: PrismaAppointment): Appointment {
  return Appointment.create({
    id: model.id,
    driverId: model.driverId,
    garageId: model.garageId,
    scheduledAt: model.scheduledAt,
    serviceDescription: model.serviceDescription,
    status: PRISMA_TO_DOMAIN_STATUS[model.status],
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
  });
}

const RESCHEDULE_MIN_HOURS_BEFORE = 2;

export class PrismaAppointmentRepository implements IAppointmentRepository {
  private async _findForDriver(id: string, driverId: string): Promise<PrismaAppointment | null> {
    return (await prisma.appointment.findFirst({ where: { id, driverId } })) as any;
  }

  private async _findForGarage(id: string, garageId: string): Promise<PrismaAppointment | null> {
    return (await prisma.appointment.findFirst({ where: { id, garageId } })) as any;
  }

  async createForDriver(input: {
    driverId: string;
    garageId: string;
    scheduledAt: Date;
    serviceDescription: string;
  }): Promise<Appointment> {
    const garage = await prisma.garage.findUnique({ where: { id: input.garageId } });
    if (!garage) throw new Error('Garage not found');
    if (garage.status !== 'ACTIVE') throw new Error('Garage is not available');

    const now = new Date();
    if (input.scheduledAt <= now) throw new Error('Appointment date and time must be in the future');

    const created = await prisma.appointment.create({
      data: {
        driverId: input.driverId,
        garageId: input.garageId,
        scheduledAt: input.scheduledAt,
        serviceDescription: input.serviceDescription.trim() || 'General service',
        status: 'PENDING',
      },
    });

    return mapFromPrisma(created as any);
  }

  async findByDriver(driverId: string, status?: AppointmentStatus): Promise<Appointment[]> {
    const where: { driverId: string; status?: PrismaAppointmentStatus } = { driverId };
    if (status) where.status = DOMAIN_TO_PRISMA_STATUS[status];

    const records = await prisma.appointment.findMany({
      where,
      orderBy: { scheduledAt: 'desc' },
    });

    return (records as any[]).map(mapFromPrisma);
  }

  async findByIdForDriver(id: string, driverId: string): Promise<Appointment | null> {
    const record = await this._findForDriver(id, driverId);
    return record ? mapFromPrisma(record) : null;
  }

  async rescheduleForDriver(id: string, driverId: string, newScheduledAt: Date): Promise<Appointment> {
    const appointment = await this._findForDriver(id, driverId);
    if (!appointment) throw new Error('Appointment not found');
    if (appointment.status !== 'PENDING') {
      throw new Error('Only pending appointments can be rescheduled');
    }

    const now = new Date();
    const minAllowed = new Date(now.getTime() + RESCHEDULE_MIN_HOURS_BEFORE * 60 * 60 * 1000);
    if (appointment.scheduledAt < minAllowed) {
      throw new Error(
        `Rescheduling is not allowed less than ${RESCHEDULE_MIN_HOURS_BEFORE} hours before the appointment`
      );
    }

    if (newScheduledAt <= now) throw new Error('New date and time must be in the future');

    const updated = await prisma.appointment.update({
      where: { id },
      data: { scheduledAt: newScheduledAt },
    });

    return mapFromPrisma(updated as any);
  }

  async cancelForDriver(id: string, driverId: string): Promise<Appointment> {
    const appointment = await this._findForDriver(id, driverId);
    if (!appointment) throw new Error('Appointment not found or already cancelled');
    if (appointment.status === 'CANCELLED') {
      throw new Error('Appointment is already cancelled');
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return mapFromPrisma(updated as any);
  }

  async findByGarage(garageId: string, status?: AppointmentStatus): Promise<Appointment[]> {
    const where: { garageId: string; status?: PrismaAppointmentStatus } = { garageId };
    if (status) where.status = DOMAIN_TO_PRISMA_STATUS[status];

    const records = await prisma.appointment.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
    });

    return (records as any[]).map(mapFromPrisma);
  }

  async findByIdForGarage(id: string, garageId: string): Promise<Appointment | null> {
    const record = await this._findForGarage(id, garageId);
    return record ? mapFromPrisma(record) : null;
  }

  async approveForGarage(id: string, garageId: string): Promise<Appointment> {
    const appointment = await this._findForGarage(id, garageId);
    if (!appointment) throw new Error('Appointment not found');
    if (appointment.status !== 'PENDING') {
      throw new Error('Only pending appointments can be approved');
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    return mapFromPrisma(updated as any);
  }

  async rejectForGarage(id: string, garageId: string): Promise<Appointment> {
    const appointment = await this._findForGarage(id, garageId);
    if (!appointment) throw new Error('Appointment not found');
    if (appointment.status !== 'PENDING') {
      throw new Error('Only pending appointments can be rejected');
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: 'REJECTED' },
    });

    return mapFromPrisma(updated as any);
  }

  async updateServiceStatusForGarage(
    id: string,
    garageId: string,
    status: AppointmentStatus.InService | AppointmentStatus.Completed
  ): Promise<Appointment> {
    const appointment = await this._findForGarage(id, garageId);
    if (!appointment) throw new Error('Appointment not found');

    if (
      appointment.status !== 'APPROVED' &&
      appointment.status !== 'IN_SERVICE'
    ) {
      throw new Error('Service status can only be updated for approved or in-service appointments');
    }

    if (status === AppointmentStatus.InService && appointment.status !== 'APPROVED') {
      throw new Error('Only approved appointments can be set to in-service');
    }

    if (
      status === AppointmentStatus.Completed &&
      appointment.status !== 'IN_SERVICE' &&
      appointment.status !== 'APPROVED'
    ) {
      throw new Error('Only in-service or approved appointments can be marked completed');
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: DOMAIN_TO_PRISMA_STATUS[status] },
    });

    return mapFromPrisma(updated as any);
  }
}


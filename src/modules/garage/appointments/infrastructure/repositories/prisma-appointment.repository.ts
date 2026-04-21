import { prisma } from '../../../../../infrastructure/prisma/prisma.client';
import { Appointment, AppointmentStatus } from '../../domain/entities/appointment.entity';
import { IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { assertAppointmentWithinGarageAvailability } from '../availability-booking.util';
import { PrismaGarageAvailabilityRepository } from '../../../availability/infrastructure/repositories/prisma-availability.repository';
import { DayOfWeek } from '../../../availability/domain/entities/availability-slot.entity';

type PrismaAppointmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_SERVICE' | 'COMPLETED' | 'CANCELLED';

interface PrismaAppointment {
  id: string;
  driverId: string;
  garageId: string;
  vehicleId: string | null;
  scheduledAt: Date;
  serviceDescription: string;
  appointmentServices?: Array<{
    garageService: {
      name: string;
    };
  }>;
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
    vehicleId: model.vehicleId ?? null,
    scheduledAt: model.scheduledAt,
    serviceDescription: model.serviceDescription,
    services: (model.appointmentServices ?? []).map((entry) => entry.garageService.name),
    status: PRISMA_TO_DOMAIN_STATUS[model.status],
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
  });
}

export class PrismaAppointmentRepository implements IAppointmentRepository {
  private async notifyDriver(driverId: string, title: string, body: string, vehicleId?: string | null): Promise<void> {
    await prisma.driverNotification.create({
      data: {
        driverId,
        title,
        body,
        vehicleId: vehicleId ?? null,
      },
    });
  }

  private async notifyGarage(garageId: string, title: string, body: string): Promise<void> {
    await prisma.garageNotification.create({
      data: {
        garageId,
        title,
        body,
      },
    });
  }

  private async _findForDriver(id: string, driverId: string): Promise<PrismaAppointment | null> {
    return (await prisma.appointment.findFirst({
      where: { id, driverId },
      include: { appointmentServices: { include: { garageService: { select: { name: true } } } } },
    })) as any;
  }

  private async _findForGarage(id: string, garageId: string): Promise<PrismaAppointment | null> {
    return (await prisma.appointment.findFirst({
      where: { id, garageId },
      include: { appointmentServices: { include: { garageService: { select: { name: true } } } } },
    })) as any;
  }

  async createForDriver(input: {
    driverId: string;
    garageId: string;
    vehicleId: string;
    scheduledAt: Date;
    serviceDescription: string;
    garageServiceIds: string[];
  }): Promise<Appointment> {
    const garage = await prisma.garage.findUnique({ where: { id: input.garageId } });
    if (!garage) throw new Error('Garage not found');
    if (garage.status !== 'ACTIVE') {
      throw new Error(
        garage.status === 'PENDING'
          ? 'Garage is not available (pending admin approval)'
          : 'Garage is not available'
      );
    }

    const vehicle = await prisma.vehicle.findFirst({
      where: { id: input.vehicleId, driverId: input.driverId },
    });
    if (!vehicle) throw new Error('Vehicle not found or does not belong to you');

    await assertAppointmentWithinGarageAvailability(input.garageId, input.scheduledAt);
    if (!input.garageServiceIds.length) {
      throw new Error('At least one service must be selected');
    }
    const uniqueServiceIds = [...new Set(input.garageServiceIds)];
    const services = await prisma.garageService.findMany({
      where: { garageId: input.garageId, id: { in: uniqueServiceIds } },
      select: { id: true, name: true },
    });
    if (services.length !== uniqueServiceIds.length) {
      throw new Error('One or more selected services are invalid for this garage');
    }

    const created = await prisma.appointment.create({
      data: {
        driverId: input.driverId,
        garageId: input.garageId,
        vehicleId: input.vehicleId,
        scheduledAt: input.scheduledAt,
        serviceDescription: input.serviceDescription.trim() || 'General service',
        appointmentServices: {
          create: services.map((service) => ({ garageServiceId: service.id })),
        },
        status: 'PENDING',
      } as any,
      include: { appointmentServices: { include: { garageService: { select: { name: true } } } } },
    });

    await Promise.all([
      this.notifyGarage(
        input.garageId,
        'New appointment request',
        `A driver requested an appointment for ${input.scheduledAt.toISOString()}.`
      ),
      this.notifyDriver(
        input.driverId,
        'Appointment booked',
        'Your appointment request has been sent to the garage and is waiting approval.',
        input.vehicleId
      ),
    ]);

    return mapFromPrisma(created as any);
  }

  async findByDriver(driverId: string, status?: AppointmentStatus): Promise<Appointment[]> {
    const where: { driverId: string; status?: PrismaAppointmentStatus } = { driverId };
    if (status) where.status = DOMAIN_TO_PRISMA_STATUS[status];

    const records = await prisma.appointment.findMany({
      where,
      orderBy: { scheduledAt: 'desc' },
      include: { appointmentServices: { include: { garageService: { select: { name: true } } } } },
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

    await assertAppointmentWithinGarageAvailability(appointment.garageId, newScheduledAt);

    const updated = await prisma.appointment.update({
      where: { id },
      data: { scheduledAt: newScheduledAt },
      include: { appointmentServices: { include: { garageService: { select: { name: true } } } } },
    });

    await Promise.all([
      this.notifyGarage(
        appointment.garageId,
        'Appointment rescheduled',
        `A driver rescheduled appointment ${appointment.id} to ${newScheduledAt.toISOString()}.`
      ),
      this.notifyDriver(
        driverId,
        'Appointment rescheduled',
        `Your appointment has been rescheduled to ${newScheduledAt.toISOString()}.`,
        appointment.vehicleId
      ),
    ]);

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
      include: { appointmentServices: { include: { garageService: { select: { name: true } } } } },
    });

    await Promise.all([
      this.notifyGarage(
        appointment.garageId,
        'Appointment cancelled',
        `Driver cancelled appointment ${appointment.id}.`
      ),
      this.notifyDriver(
        driverId,
        'Appointment cancelled',
        'Your appointment has been cancelled.',
        appointment.vehicleId
      ),
    ]);

    return mapFromPrisma(updated as any);
  }

  async submitReviewForCompletedAppointment(input: {
    appointmentId: string;
    driverId: string;
    rating: number;
    comment?: string;
  }): Promise<unknown> {
    if (input.rating < 1 || input.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const appointment = await prisma.appointment.findFirst({
      where: { id: input.appointmentId, driverId: input.driverId },
      select: { id: true, garageId: true, status: true },
    });

    if (!appointment) throw new Error('Appointment not found');
    if (appointment.status !== 'COMPLETED') {
      throw new Error('You can review only after service is completed');
    }

    const rating = await prisma.garageRating.upsert({
      where: { appointmentId: appointment.id },
      update: {
        rating: input.rating,
        comment: input.comment?.trim() || null,
      },
      create: {
        appointmentId: appointment.id,
        garageId: appointment.garageId,
        driverId: input.driverId,
        rating: input.rating,
        comment: input.comment?.trim() || null,
      },
    });

    await this.notifyGarage(
      appointment.garageId,
      'New garage review',
      `A driver submitted a ${input.rating}-star review.`
    );

    return rating;
  }

  async findByGarage(garageId: string, status?: AppointmentStatus): Promise<Appointment[]> {
    const where: { garageId: string; status?: PrismaAppointmentStatus } = { garageId };
    if (status) where.status = DOMAIN_TO_PRISMA_STATUS[status];

    const records = await prisma.appointment.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      include: { appointmentServices: { include: { garageService: { select: { name: true } } } } },
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

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: 'APPROVED' },
      include: { appointmentServices: { include: { garageService: { select: { name: true } } } } },
    });

    await this.notifyDriver(
      appointment.driverId,
      'Appointment approved',
      'Your appointment was approved by the garage.',
      appointment.vehicleId
    );

    return mapFromPrisma(updated as any);
  }

  async rejectForGarage(id: string, garageId: string): Promise<Appointment> {
    const appointment = await this._findForGarage(id, garageId);
    if (!appointment) throw new Error('Appointment not found');

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: 'REJECTED' },
      include: { appointmentServices: { include: { garageService: { select: { name: true } } } } },
    });

    await this.notifyDriver(
      appointment.driverId,
      'Appointment rejected',
      'Your appointment was rejected by the garage.',
      appointment.vehicleId
    );

    return mapFromPrisma(updated as any);
  }

  async updateServiceStatusForGarage(
    id: string,
    garageId: string,
    status: AppointmentStatus
  ): Promise<Appointment> {
    const appointment = await this._findForGarage(id, garageId);
    if (!appointment) throw new Error('Appointment not found');

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: DOMAIN_TO_PRISMA_STATUS[status] },
      include: { appointmentServices: { include: { garageService: { select: { name: true } } } } },
    });

    const statusLabel = DOMAIN_TO_PRISMA_STATUS[status].replace('_', ' ');
    await Promise.all([
      this.notifyDriver(
        appointment.driverId,
        `Service status updated: ${statusLabel}`,
        `Your service appointment is now ${statusLabel}.`,
        appointment.vehicleId
      ),
      this.notifyGarage(
        garageId,
        `Service status updated: ${statusLabel}`,
        `Appointment ${appointment.id} is now ${statusLabel}.`
      ),
    ]);

    return mapFromPrisma(updated as any);
  }
}

export enum AppointmentStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  InService = 'IN_SERVICE',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
}

export interface AppointmentProps {
  id: string;
  driverId: string;
  garageId: string;
  scheduledAt: Date;
  serviceDescription: string;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Appointment {
  private constructor(private readonly props: AppointmentProps) {}

  static create(props: AppointmentProps): Appointment {
    return new Appointment(props);
  }

  get id(): string {
    return this.props.id;
  }

  get driverId(): string {
    return this.props.driverId;
  }

  get garageId(): string {
    return this.props.garageId;
  }

  get scheduledAt(): Date {
    return this.props.scheduledAt;
  }

  get serviceDescription(): string {
    return this.props.serviceDescription;
  }

  get status(): AppointmentStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toJSON(): AppointmentProps {
    return { ...this.props };
  }
}


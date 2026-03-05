export enum DayOfWeek {
  Monday = 'MONDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY',
  Thursday = 'THURSDAY',
  Friday = 'FRIDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
}

export interface AvailabilitySlotProps {
  id: string;
  garageId: string;
  dayOfWeek: DayOfWeek;
  startMinute: number; // 0-1439
  endMinute: number; // 1-1440
  createdAt: Date;
  updatedAt: Date;
}

export class AvailabilitySlot {
  private constructor(private readonly props: AvailabilitySlotProps) {}

  static create(props: AvailabilitySlotProps): AvailabilitySlot {
    return new AvailabilitySlot(props);
  }

  get id(): string {
    return this.props.id;
  }

  get garageId(): string {
    return this.props.garageId;
  }

  get dayOfWeek(): DayOfWeek {
    return this.props.dayOfWeek;
  }

  get startMinute(): number {
    return this.props.startMinute;
  }

  get endMinute(): number {
    return this.props.endMinute;
  }

  toJSON(): AvailabilitySlotProps {
    return { ...this.props };
  }
}


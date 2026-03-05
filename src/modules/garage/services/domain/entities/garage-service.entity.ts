export interface GarageServiceProps {
  id: string;
  garageId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GarageService {
  private constructor(private readonly props: GarageServiceProps) {}

  static create(props: GarageServiceProps): GarageService {
    return new GarageService(props);
  }

  get id(): string {
    return this.props.id;
  }

  get garageId(): string {
    return this.props.garageId;
  }

  get name(): string {
    return this.props.name;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toJSON(): GarageServiceProps {
    return { ...this.props };
  }
}

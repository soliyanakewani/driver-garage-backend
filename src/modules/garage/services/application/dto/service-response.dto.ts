import { GarageService } from '../../domain/entities/garage-service.entity';

export class GarageServiceResponseDto {
  constructor(
    public readonly id: string,
    public readonly garageId: string,
    public readonly name: string,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  static from(service: GarageService): GarageServiceResponseDto {
    const s = service.toJSON();
    return new GarageServiceResponseDto(
      s.id,
      s.garageId,
      s.name,
      s.createdAt.toISOString(),
      s.updatedAt.toISOString()
    );
  }
}

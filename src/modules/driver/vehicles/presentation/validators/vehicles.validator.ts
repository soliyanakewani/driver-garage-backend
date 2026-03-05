import { CreateVehicleDTO } from '../../application/dto/create-vehicle.dto';

export function validateCreateVehicle(body: unknown): asserts body is CreateVehicleDTO {
  if (!body || typeof body !== 'object') throw new Error('Request body is required');
  const b = body as Record<string, unknown>;
  if (!b.plateNumber || typeof b.plateNumber !== 'string' || !b.plateNumber.trim()) {
    throw new Error('Plate number is required');
  }
  if (!b.make || typeof b.make !== 'string' || !b.make.trim()) throw new Error('Make is required');
  if (!b.model || typeof b.model !== 'string' || !b.model.trim()) throw new Error('Model is required');
  if (b.year == null || typeof b.year !== 'number') throw new Error('Valid year is required');
}

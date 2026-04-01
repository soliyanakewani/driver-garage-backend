export interface IGarageSettingsRepository {
  getByGarageId(garageId: string): Promise<unknown>;
  update(garageId: string, data: Record<string, unknown>): Promise<unknown>;
}

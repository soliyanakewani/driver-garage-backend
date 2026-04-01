/** Body for PUT /garages/me/services: replace all services with this list (same as UI send on create/update). */
export class ReplaceServicesRequestDto {
  constructor(public readonly services: string[]) {}

  static from(body: unknown): ReplaceServicesRequestDto {
    if (!body || typeof body !== 'object') throw new Error('Request body is required');
    const b = body as Record<string, unknown>;
    const raw = b.services ?? b.services_offered;
    if (Array.isArray(raw)) {
      const list = raw.map((item) => (typeof item === 'string' ? item.trim() : typeof item === 'object' && item !== null && 'name' in item ? String((item as { name: unknown }).name).trim() : '')).filter(Boolean);
      return new ReplaceServicesRequestDto(list);
    }
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw) as unknown;
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        const list = arr.map((item) => (typeof item === 'string' ? item.trim() : typeof item === 'object' && item !== null && 'name' in item ? String((item as { name: unknown }).name).trim() : '')).filter(Boolean);
        return new ReplaceServicesRequestDto(list);
      } catch {
        return new ReplaceServicesRequestDto(raw.trim() ? [raw.trim()] : []);
      }
    }
    return new ReplaceServicesRequestDto([]);
  }
}

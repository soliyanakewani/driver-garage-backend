export class CreateServiceRequestDto {
  constructor(public readonly name: string) {}

  static from(body: unknown): CreateServiceRequestDto {
    if (!body || typeof body !== 'object') throw new Error('Invalid request body');
    const b = body as any;
    const name = typeof b.name === 'string' ? b.name.trim() : '';
    if (!name) throw new Error('name is required');
    return new CreateServiceRequestDto(name);
  }
}

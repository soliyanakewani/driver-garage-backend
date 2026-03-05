export class UpdateServiceRequestDto {
  constructor(public readonly name?: string) {}

  static from(body: unknown): UpdateServiceRequestDto {
    if (!body || typeof body !== 'object') throw new Error('Invalid request body');
    const b = body as any;
    const name = b.name !== undefined
      ? (typeof b.name === 'string' ? b.name.trim() : '')
      : undefined;
    if (name !== undefined && !name) throw new Error('name cannot be empty');
    if (name === undefined) throw new Error('No updates provided');
    return new UpdateServiceRequestDto(name);
  }
}

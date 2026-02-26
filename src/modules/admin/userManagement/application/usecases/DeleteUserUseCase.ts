import { UserRepository } from "../../domain/repositories/UserRepository";

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, role: string) {
    await this.userRepository.delete(userId, role);
  }
}

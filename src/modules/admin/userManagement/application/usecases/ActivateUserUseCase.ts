import { AccountStatus } from "@prisma/client";
import { UserRepository } from "../../domain/repositories/UserRepository";

export class ActivateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, role: string) {
    await this.userRepository.updateStatus(
      userId,
      role,
      AccountStatus.ACTIVE
    );
  }
}

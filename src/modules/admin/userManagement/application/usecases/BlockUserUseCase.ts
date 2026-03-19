import { AccountStatus } from "@prisma/client";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { BlockUserDto } from "../dto/BlockUserDto";
export class BlockUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: BlockUserDto) {
    await this.userRepository.updateStatus(
      dto.userId,
      dto.role,
      AccountStatus.BLOCKED
    );
  }
}

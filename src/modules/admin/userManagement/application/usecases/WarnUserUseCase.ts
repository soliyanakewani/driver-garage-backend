import { AccountStatus } from "@prisma/client";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { WarnUserDto } from "../dto/WarnUserDto";

export class WarnUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: WarnUserDto) {
    await this.userRepository.updateStatus(
      dto.userId,
      dto.role,
      AccountStatus.WARNED
    );
  }
}

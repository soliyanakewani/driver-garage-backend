import { AccountStatus } from "@prisma/client";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { ActivateUserDto } from "../dto/ActivateUserDto";

export class ActivateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: ActivateUserDto){
    await this.userRepository.updateStatus(
      dto.userId,
      dto.role,
      AccountStatus.ACTIVE
    );
  }
}

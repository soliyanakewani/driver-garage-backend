import { UserRepository } from "../../domain/repositories/UserRepository";
import { DeleteUserDto } from "../dto/DeleteUserDto";

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: DeleteUserDto) {
    await this.userRepository.delete(
      dto.userId,
      dto.role
    );
  }
}

import { UserRepository } from "../../domain/repositories/UserRepository";

export class ListUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(search?: string, page?: number, limit?: number) {
    return this.userRepository.findAll(search, page, limit);
  }
}

import { UserRepository } from "../../domain/repositories/UserRepository";

export class GetUserStatsUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute() {
    return this.userRepository.getStats();
  }
}
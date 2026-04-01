import { UserRepository } from "../../domain/repositories/UserRepository";
import {UserStatsResponseDto} from "../dto/GetUserStatsDto";
export class GetUserStatsUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute() {
    return this.userRepository.getStats();
  }
}
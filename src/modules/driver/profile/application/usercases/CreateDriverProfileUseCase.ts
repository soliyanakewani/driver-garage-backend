import { DriverProfileRepository } from "../../domain/repositories/DriverProfileRepository";
import { DriverProfileDTO } from "../dto/profile.dto";

export class CreateDriverProfileUseCase {
    constructor(private driverProfileRepository: DriverProfileRepository) {}

    async execute(driverId: string, dto: DriverProfileDTO) {
        return this.driverProfileRepository.createProfile(driverId, dto);
    }
}
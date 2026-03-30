import { DriverProfileRepository } from "../../domain/repositories/DriverProfileRepository";
import { DriverProfileDTO } from "../dto/profile.dto";

export class UpdateDriverProfileUseCase {
    constructor(private driverProfileRepository: DriverProfileRepository) {}

    async execute(driverId: string, dto: DriverProfileDTO) {
        return this.driverProfileRepository.updateProfile(driverId, dto);
    }       
}
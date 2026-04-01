import { DriverProfileRepository } from "../../domain/repositories/DriverProfileRepository";

export class GetDriverProfileUseCase {
    constructor(private driverProfileRepository: DriverProfileRepository) {}

    async execute(driverId: string) {
        return this.driverProfileRepository.getProfile(driverId);
    }
}
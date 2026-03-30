export interface DriverProfileRepository {
    getProfile(driverId: string): Promise<any>;
    createProfile(driverId: string, data: any): Promise<any>;
    updateProfile(driverId: string, data: any): Promise<any>;
}
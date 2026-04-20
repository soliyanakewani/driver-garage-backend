/** Keys stored in VehicleMaintenanceHealth.health JSON — maps UI gauges + internals */
export type FixedHealthKey =
  | 'ENGINE'
  | 'BRAKES'
  | 'TIRES'
  | 'BATTERY'
  | 'COOLANT'
  | 'TRANSMISSION'
  | 'AIR_FILTER'
  | 'WIPERS_LIGHTS';

export interface CustomHealthSlot {
  id: string;
  label: string;
  percentage: number;
}

export interface VehicleHealthState {
  ENGINE: number;
  BRAKES: number;
  TIRES: number;
  BATTERY: number;
  COOLANT: number;
  TRANSMISSION: number;
  AIR_FILTER: number;
  WIPERS_LIGHTS: number;
  custom: CustomHealthSlot[];
}

export type ReminderDisplayStatus = 'DONE' | 'URGENT' | 'SOON' | 'GOOD';

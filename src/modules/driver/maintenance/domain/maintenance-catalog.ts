import type { FixedHealthKey } from './maintenance-health.types';

/** Must match Prisma enum MaintenancePresetCategory */
export type MaintenancePresetCategoryId =
  | 'OIL_CHANGE'
  | 'TIRE_ROTATION'
  | 'TIRE_INSPECTION'
  | 'BRAKE_INSPECTION'
  | 'BRAKE_SERVICE'
  | 'BATTERY_CHECK'
  | 'COOLANT'
  | 'TRANSMISSION_FLUID'
  | 'AIR_FILTER'
  | 'CABIN_FILTER'
  | 'ENGINE_DIAGNOSTIC'
  | 'BELTS_HOSES'
  | 'SPARK_PLUGS'
  | 'WIPERS_LIGHTS'
  | 'FLUIDS_CHECK'
  | 'OTHER';

export interface MaintenanceCatalogItem {
  id: MaintenancePresetCategoryId;
  label: string;
  description: string;
  /** Which vehicle health gauge this affects (Flutter can show 3 main + more in detail) */
  healthComponent: FixedHealthKey | 'CUSTOM';
}

/**
 * Preset maintenance types — common car care items.
 * OTHER uses `customServiceName` from the client.
 */
export const MAINTENANCE_CATALOG: MaintenanceCatalogItem[] = [
  { id: 'OIL_CHANGE', label: 'Oil change', description: 'Engine oil and filter', healthComponent: 'ENGINE' },
  { id: 'ENGINE_DIAGNOSTIC', label: 'Engine check', description: 'Engine diagnostics & fluids', healthComponent: 'ENGINE' },
  { id: 'BELTS_HOSES', label: 'Belts & hoses', description: 'Serpentine belt and coolant hoses', healthComponent: 'ENGINE' },
  { id: 'SPARK_PLUGS', label: 'Spark plugs', description: 'Ignition system', healthComponent: 'ENGINE' },
  { id: 'FLUIDS_CHECK', label: 'Fluids top-up', description: 'Brake, power steering, washer fluid', healthComponent: 'ENGINE' },
  { id: 'TIRE_ROTATION', label: 'Tire rotation', description: 'Rotate tires for even wear', healthComponent: 'TIRES' },
  { id: 'TIRE_INSPECTION', label: 'Tire inspection', description: 'Pressure, tread, alignment check', healthComponent: 'TIRES' },
  { id: 'BRAKE_INSPECTION', label: 'Brake inspection', description: 'Pads, rotors, fluid', healthComponent: 'BRAKES' },
  { id: 'BRAKE_SERVICE', label: 'Brake service', description: 'Pads/rotors replacement', healthComponent: 'BRAKES' },
  { id: 'BATTERY_CHECK', label: 'Battery', description: 'Test and terminals', healthComponent: 'BATTERY' },
  { id: 'COOLANT', label: 'Coolant', description: 'Coolant flush or top-up', healthComponent: 'COOLANT' },
  { id: 'TRANSMISSION_FLUID', label: 'Transmission fluid', description: 'Transmission service', healthComponent: 'TRANSMISSION' },
  { id: 'AIR_FILTER', label: 'Engine air filter', description: 'Replace air filter', healthComponent: 'AIR_FILTER' },
  { id: 'CABIN_FILTER', label: 'Cabin air filter', description: 'HVAC filter', healthComponent: 'AIR_FILTER' },
  { id: 'WIPERS_LIGHTS', label: 'Wipers & lights', description: 'Wiper blades, bulbs', healthComponent: 'WIPERS_LIGHTS' },
  { id: 'OTHER', label: 'Custom', description: 'Your own maintenance item', healthComponent: 'CUSTOM' },
];

export function getCatalogItem(id: string): MaintenanceCatalogItem | undefined {
  return MAINTENANCE_CATALOG.find((item) => item.id === id);
}

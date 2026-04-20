import { randomUUID } from 'crypto';
import {
  MAINTENANCE_HEALTH_MIN,
  MAINTENANCE_HEALTH_REDUCTION_PERCENT,
  MAINTENANCE_SOON_DAYS,
} from './maintenance.constants';
import type {
  CustomHealthSlot,
  FixedHealthKey,
  ReminderDisplayStatus,
  VehicleHealthState,
} from './maintenance-health.types';

const FIXED_KEYS: FixedHealthKey[] = [
  'ENGINE',
  'BRAKES',
  'TIRES',
  'BATTERY',
  'COOLANT',
  'TRANSMISSION',
  'AIR_FILTER',
  'WIPERS_LIGHTS',
];

export function defaultVehicleHealth(): VehicleHealthState {
  const base: Record<string, number> = {};
  for (const key of FIXED_KEYS) {
    base[key] = 100;
  }
  return { ...(base as unknown as VehicleHealthState), custom: [] };
}

export function parseVehicleHealth(raw: unknown): VehicleHealthState {
  const d = defaultVehicleHealth();
  if (!raw || typeof raw !== 'object') return d;
  const o = raw as Record<string, unknown>;
  for (const key of FIXED_KEYS) {
    const v = o[key];
    if (typeof v === 'number' && !Number.isNaN(v)) {
      (d as unknown as Record<string, number>)[key] = clampPercent(v);
    }
  }
  if (Array.isArray(o.custom)) {
    d.custom = o.custom
      .filter(
        (row): row is CustomHealthSlot =>
          !!row &&
          typeof row === 'object' &&
          typeof (row as CustomHealthSlot).id === 'string' &&
          typeof (row as CustomHealthSlot).label === 'string' &&
          typeof (row as CustomHealthSlot).percentage === 'number'
      )
      .map((row) => ({
        ...row,
        percentage: clampPercent(row.percentage),
      }));
  }
  return d;
}

export function serializeVehicleHealth(state: VehicleHealthState): object {
  const out: Record<string, unknown> = {};
  for (const key of FIXED_KEYS) {
    out[key] = clampPercent((state as unknown as Record<string, number>)[key] ?? 100);
  }
  out.custom = state.custom.map((c) => ({
    id: c.id,
    label: c.label,
    percentage: clampPercent(c.percentage),
  }));
  return out;
}

function clampPercent(n: number): number {
  return Math.max(MAINTENANCE_HEALTH_MIN, Math.min(100, Math.round(n * 100) / 100));
}

export function computeOverallHealth(state: VehicleHealthState): number {
  const fixedValues = FIXED_KEYS.map((k) => clampPercent((state as unknown as Record<string, number>)[k] ?? 100));
  const customValues = state.custom.map((c) => clampPercent(c.percentage));
  const all = [...fixedValues, ...customValues];
  if (!all.length) return 100;
  const sum = all.reduce((a, b) => a + b, 0);
  return clampPercent(sum / all.length);
}

export type ApplyReductionResult =
  | {
      kind: 'fixed';
      key: FixedHealthKey;
      valueBefore: number;
      reductionApplied: number;
      state: VehicleHealthState;
    }
  | {
      kind: 'custom';
      slotId: string;
      valueBefore: number;
      reductionApplied: number;
      state: VehicleHealthState;
    };

export function applyReductionForFixed(
  state: VehicleHealthState,
  key: FixedHealthKey,
  reduction: number = MAINTENANCE_HEALTH_REDUCTION_PERCENT
): Extract<ApplyReductionResult, { kind: 'fixed' }> {
  const copy = cloneState(state);
  const cur = clampPercent((copy as unknown as Record<string, number>)[key] ?? 100);
  const next = clampPercent(cur - reduction);
  const applied = cur - next;
  (copy as unknown as Record<string, number>)[key] = next;
  return { kind: 'fixed', key, valueBefore: cur, reductionApplied: applied, state: copy };
}

/** Match custom slot by label (case-insensitive) or create a new slot */
export function applyReductionForCustom(
  state: VehicleHealthState,
  label: string,
  reduction: number = MAINTENANCE_HEALTH_REDUCTION_PERCENT
): Extract<ApplyReductionResult, { kind: 'custom' }> {
  const copy = cloneState(state);
  const trimmed = label.trim();
  const idx = copy.custom.findIndex((c) => c.label.toLowerCase() === trimmed.toLowerCase());
  let slotId: string;
  let valueBefore: number;

  if (idx >= 0) {
    slotId = copy.custom[idx].id;
    valueBefore = clampPercent(copy.custom[idx].percentage);
  } else {
    slotId = randomUUID();
    valueBefore = 100;
    copy.custom.push({ id: slotId, label: trimmed, percentage: 100 });
  }

  const i = copy.custom.findIndex((c) => c.id === slotId);
  const cur = clampPercent(copy.custom[i].percentage);
  const next = clampPercent(cur - reduction);
  const applied = cur - next;
  copy.custom[i] = { ...copy.custom[i], percentage: next };

  return { kind: 'custom', slotId, valueBefore, reductionApplied: applied, state: copy };
}

export function restoreFixed(state: VehicleHealthState, key: FixedHealthKey, valueBefore: number): VehicleHealthState {
  const copy = cloneState(state);
  (copy as unknown as Record<string, number>)[key] = clampPercent(valueBefore);
  return copy;
}

export function restoreCustomSlot(
  state: VehicleHealthState,
  slotId: string,
  valueBefore: number
): VehicleHealthState {
  const copy = cloneState(state);
  const idx = copy.custom.findIndex((c) => c.id === slotId);
  if (idx < 0) return copy;
  copy.custom[idx] = { ...copy.custom[idx], percentage: clampPercent(valueBefore) };
  return copy;
}

function cloneState(state: VehicleHealthState): VehicleHealthState {
  return {
    ENGINE: state.ENGINE,
    BRAKES: state.BRAKES,
    TIRES: state.TIRES,
    BATTERY: state.BATTERY,
    COOLANT: state.COOLANT,
    TRANSMISSION: state.TRANSMISSION,
    AIR_FILTER: state.AIR_FILTER,
    WIPERS_LIGHTS: state.WIPERS_LIGHTS,
    custom: state.custom.map((c) => ({ ...c })),
  };
}

export function computeReminderDisplayStatus(
  scheduledDate: Date,
  completedAt: Date | null,
  now: Date = new Date()
): { status: ReminderDisplayStatus; daysUntilDue: number; overdueDays: number } {
  if (completedAt) {
    return { status: 'DONE', daysUntilDue: 0, overdueDays: 0 };
  }
  const due = scheduledDate.getTime();
  const t = now.getTime();
  const msPerDay = 86_400_000;
  const diffDays = Math.round((due - t) / msPerDay);
  const overdueDays = diffDays < 0 ? Math.abs(diffDays) : 0;

  if (t > due) {
    return { status: 'URGENT', daysUntilDue: diffDays, overdueDays };
  }
  if (diffDays <= MAINTENANCE_SOON_DAYS) {
    return { status: 'SOON', daysUntilDue: diffDays, overdueDays: 0 };
  }
  return { status: 'GOOD', daysUntilDue: diffDays, overdueDays: 0 };
}

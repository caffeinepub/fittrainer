import type { UserProfile } from "../hooks/useProfile";
import type { WorkoutLogEntry } from "../hooks/useWorkoutLog";
import type { WorkoutPlan } from "../lib/workoutGenerator";

const KEYS = {
  PROFILE: "fitai_profile",
  PLAN: "fitai_plan",
  LOG: "fitai_log",
  SETTINGS: "fitai_settings",
} as const;

function get<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function set<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error("localStorage write failed");
  }
}

function remove(key: string): void {
  localStorage.removeItem(key);
}

export const storage = {
  getProfile: () => get<UserProfile>(KEYS.PROFILE),
  setProfile: (p: UserProfile) => set(KEYS.PROFILE, p),

  getPlan: () => get<WorkoutPlan>(KEYS.PLAN),
  setPlan: (p: WorkoutPlan) => set(KEYS.PLAN, p),

  getLog: () => get<WorkoutLogEntry[]>(KEYS.LOG) ?? [],
  setLog: (log: WorkoutLogEntry[]) => set(KEYS.LOG, log),
  addLogEntry: (entry: WorkoutLogEntry) => {
    const log = storage.getLog();
    log.push(entry);
    storage.setLog(log);
  },

  getSettings: () => get<Record<string, unknown>>(KEYS.SETTINGS) ?? {},
  setSettings: (s: Record<string, unknown>) => set(KEYS.SETTINGS, s),

  clearAll: () => {
    Object.values(KEYS).forEach(remove);
  },
};

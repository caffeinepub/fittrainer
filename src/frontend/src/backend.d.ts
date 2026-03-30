import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export interface WorkoutLog {
    id: string;
    userId: UserId;
    exercises: Array<string>;
    durationMinutes: bigint;
    timestamp: Time;
    repetitions: Array<bigint>;
}
export type Time = bigint;
export interface Statistics {
    id: string;
    bio: string;
    activeMinutes: bigint;
    created: Time;
    calorieIntakeAvg: bigint;
    heightCm: bigint;
    userId: UserId;
    weightKg: bigint;
}
export interface backendInterface {
    getAllStats(): Promise<Array<Statistics>>;
    getAllWorkoutLogs(): Promise<Array<WorkoutLog>>;
    getStats(userId: UserId): Promise<Statistics | null>;
    getWorkoutLog(logId: string): Promise<WorkoutLog>;
    saveStats(stats: Statistics): Promise<void>;
    saveWorkoutLog(log: WorkoutLog): Promise<void>;
}

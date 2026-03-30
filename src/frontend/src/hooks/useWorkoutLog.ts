import { useCallback, useState } from "react";
import { storage } from "../lib/storage";

export interface CompletedSet {
  exerciseId: string;
  setIndex: number;
  reps: number;
  weight: number;
}

export interface WorkoutLogEntry {
  id: string;
  date: string;
  planDayIndex: number;
  dayName: string;
  durationMinutes: number;
  completedSets: CompletedSet[];
  feedback: "easy" | "medium" | "hard";
  caloriesBurned: number;
}

export function useWorkoutLog() {
  const [log, setLogState] = useState<WorkoutLogEntry[]>(() =>
    storage.getLog(),
  );

  const addEntry = useCallback((entry: WorkoutLogEntry) => {
    storage.addLogEntry(entry);
    setLogState(storage.getLog());
  }, []);

  const clearLog = useCallback(() => {
    storage.setLog([]);
    setLogState([]);
  }, []);

  return { log, addEntry, clearLog };
}

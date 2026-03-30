import { useMemo } from "react";
import type { UserProfile } from "./useProfile";
import type { WorkoutLogEntry } from "./useWorkoutLog";

export interface WeeklyStats {
  week: string;
  workouts: number;
  volume: number;
  calories: number;
}

export function useProgress(
  log: WorkoutLogEntry[],
  profile: UserProfile | null,
) {
  return useMemo(() => {
    const totalWorkouts = log.length;
    const totalCalories = log.reduce((s, e) => s + e.caloriesBurned, 0);
    const avgDuration =
      totalWorkouts > 0
        ? Math.round(
            log.reduce((s, e) => s + e.durationMinutes, 0) / totalWorkouts,
          )
        : 0;

    // Streak
    const sortedDates = [...new Set(log.map((e) => e.date))].sort().reverse();
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < sortedDates.length; i++) {
      const d = new Date(sortedDates[i]);
      const diffDays = Math.floor((today.getTime() - d.getTime()) / 86400000);
      if (i === 0 && diffDays > 1) break;
      if (i > 0) {
        const prev = new Date(sortedDates[i - 1]);
        const diff = Math.floor((prev.getTime() - d.getTime()) / 86400000);
        if (diff > 1) break;
      }
      streak++;
    }

    // Weekly stats (last 8 weeks)
    const weeklyMap = new Map<string, WeeklyStats>();
    for (const entry of log) {
      const d = new Date(entry.date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().slice(0, 10);
      const existing = weeklyMap.get(key) ?? {
        week: key,
        workouts: 0,
        volume: 0,
        calories: 0,
      };
      existing.workouts++;
      existing.volume += entry.completedSets.length;
      existing.calories += entry.caloriesBurned;
      weeklyMap.set(key, existing);
    }

    const weeks = Array.from(weeklyMap.values())
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-8)
      .map((w) => ({
        ...w,
        week: new Date(w.week).toLocaleDateString("en", {
          month: "short",
          day: "numeric",
        }),
      }));

    // This week workouts
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const thisWeekWorkouts = log.filter(
      (e) => new Date(e.date) >= weekStart,
    ).length;

    // Monthly consistency
    const monthStart = new Date();
    monthStart.setDate(1);
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    ).getDate();
    const workoutDaysThisMonth = new Set(
      log.filter((e) => new Date(e.date) >= monthStart).map((e) => e.date),
    ).size;
    const plannedDaysThisMonth = profile
      ? Math.round(profile.daysPerWeek * (daysInMonth / 7))
      : 12;
    const consistencyPct = Math.min(
      100,
      Math.round((workoutDaysThisMonth / plannedDaysThisMonth) * 100),
    );

    return {
      totalWorkouts,
      totalCalories: Math.round(totalCalories),
      avgDuration,
      streak,
      thisWeekWorkouts,
      weeks,
      consistencyPct,
      workoutDaysThisMonth,
      plannedDaysThisMonth,
    };
  }, [log, profile]);
}

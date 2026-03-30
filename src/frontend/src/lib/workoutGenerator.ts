import { exercises } from "../data/exercises";
import type { UserProfile } from "../hooks/useProfile";

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number | string;
  restSeconds: number;
  notes?: string;
}

export interface WorkoutDay {
  dayName: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutPlan {
  id: string;
  createdAt: number;
  split: "full_body" | "upper_lower" | "push_pull_legs";
  days: WorkoutDay[];
  weekNumber: number;
}

type EquipmentTier = "none" | "dumbbells" | "full_gym";

function getAvailableExercises(equipment: EquipmentTier) {
  const tiers: EquipmentTier[] =
    equipment === "full_gym"
      ? ["none", "dumbbells", "full_gym"]
      : equipment === "dumbbells"
        ? ["none", "dumbbells"]
        : ["none"];
  return exercises.filter((e) => tiers.includes(e.equipment));
}

function pickExercises(
  pool: typeof exercises,
  muscleGroups: string[],
  count: number,
  difficulty: UserProfile["experience"],
) {
  const diffMap = {
    beginner: ["beginner"],
    intermediate: ["beginner", "intermediate"],
    advanced: ["beginner", "intermediate", "advanced"],
  };
  const allowed = diffMap[difficulty];
  const filtered = pool.filter(
    (e) =>
      muscleGroups.includes(e.muscleGroup) && allowed.includes(e.difficulty),
  );
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getScheme(goal: UserProfile["goal"]): {
  sets: number;
  reps: number | string;
  rest: number;
} {
  switch (goal) {
    case "fat_loss":
      return { sets: 3, reps: "15-20", rest: 45 };
    case "muscle_gain":
      return { sets: 4, reps: "8-12", rest: 90 };
    case "strength":
      return { sets: 5, reps: "3-5", rest: 180 };
    case "endurance":
      return { sets: 3, reps: "20-25", rest: 30 };
  }
}

function makeExercises(
  picked: typeof exercises,
  scheme: ReturnType<typeof getScheme>,
): WorkoutExercise[] {
  return picked.map((e) => ({
    exerciseId: e.id,
    sets: scheme.sets,
    reps: scheme.reps,
    restSeconds: scheme.rest,
  }));
}

export function generateWorkoutPlan(
  profile: UserProfile,
  weekNumber = 1,
): WorkoutPlan {
  const pool = getAvailableExercises(profile.equipment);
  const scheme = getScheme(profile.goal);

  let split: WorkoutPlan["split"];
  let days: WorkoutDay[] = [];

  if (profile.experience === "beginner" || profile.daysPerWeek <= 3) {
    split = "full_body";
    const numDays = Math.min(profile.daysPerWeek, 3);
    for (let i = 0; i < numDays; i++) {
      const picked = pickExercises(
        pool,
        ["chest", "back", "legs", "core", "shoulders"],
        6,
        profile.experience,
      );
      days.push({
        dayName: `Full Body ${String.fromCharCode(65 + i)}`,
        exercises: makeExercises(picked, scheme),
      });
    }
  } else if (
    profile.experience === "intermediate" ||
    profile.daysPerWeek <= 4
  ) {
    split = "upper_lower";
    const pairs = Math.floor(profile.daysPerWeek / 2);
    for (let i = 0; i < pairs; i++) {
      const upper = pickExercises(
        pool,
        ["chest", "back", "shoulders", "biceps", "triceps"],
        6,
        profile.experience,
      );
      days.push({
        dayName: `Upper Body ${String.fromCharCode(65 + i)}`,
        exercises: makeExercises(upper, scheme),
      });
      const lower = pickExercises(
        pool,
        ["legs", "glutes", "core"],
        6,
        profile.experience,
      );
      days.push({
        dayName: `Lower Body ${String.fromCharCode(65 + i)}`,
        exercises: makeExercises(lower, scheme),
      });
    }
    if (profile.daysPerWeek % 2 !== 0) {
      const full = pickExercises(
        pool,
        ["chest", "back", "legs", "core"],
        6,
        profile.experience,
      );
      days.push({
        dayName: "Full Body",
        exercises: makeExercises(full, scheme),
      });
    }
  } else {
    split = "push_pull_legs";
    const rounds = Math.floor(profile.daysPerWeek / 3);
    for (let i = 0; i < rounds; i++) {
      const push = pickExercises(
        pool,
        ["chest", "shoulders", "triceps"],
        6,
        profile.experience,
      );
      days.push({
        dayName: `Push Day ${i + 1}`,
        exercises: makeExercises(push, scheme),
      });
      const pull = pickExercises(
        pool,
        ["back", "biceps"],
        6,
        profile.experience,
      );
      days.push({
        dayName: `Pull Day ${i + 1}`,
        exercises: makeExercises(pull, scheme),
      });
      const legs = pickExercises(
        pool,
        ["legs", "glutes", "core"],
        6,
        profile.experience,
      );
      days.push({
        dayName: `Legs Day ${i + 1}`,
        exercises: makeExercises(legs, scheme),
      });
    }
    const rem = profile.daysPerWeek % 3;
    if (rem >= 1) {
      const push = pickExercises(
        pool,
        ["chest", "shoulders", "triceps"],
        6,
        profile.experience,
      );
      days.push({
        dayName: "Push Day +",
        exercises: makeExercises(push, scheme),
      });
    }
    if (rem >= 2) {
      const pull = pickExercises(
        pool,
        ["back", "biceps"],
        6,
        profile.experience,
      );
      days.push({
        dayName: "Pull Day +",
        exercises: makeExercises(pull, scheme),
      });
    }
  }

  return {
    id: `plan_${Date.now()}`,
    createdAt: Date.now(),
    split,
    days,
    weekNumber,
  };
}

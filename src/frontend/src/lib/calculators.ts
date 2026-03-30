import type { UserProfile } from "../hooks/useProfile";

export function calculateBMI(weight: number, height: number) {
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  let category: string;
  let color: string;
  if (bmi < 18.5) {
    category = "Underweight";
    color = "#60a5fa";
  } else if (bmi < 25.0) {
    category = "Normal";
    color = "#32E36B";
  } else if (bmi < 30.0) {
    category = "Overweight";
    color = "#FBBF24";
  } else {
    category = "Obese";
    color = "#f87171";
  }
  return { bmi: Math.round(bmi * 10) / 10, category, color };
}

export function calculateTDEE(profile: UserProfile): number {
  // Mifflin-St Jeor BMR
  let bmr: number;
  if (profile.gender === "male") {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }
  // Activity multiplier based on days/week
  const activityMap: Record<number, number> = {
    2: 1.375,
    3: 1.375,
    4: 1.55,
    5: 1.55,
    6: 1.725,
  };
  const multiplier =
    activityMap[Math.min(6, Math.max(2, profile.daysPerWeek))] ?? 1.375;
  return Math.round(bmr * multiplier);
}

export function calculateGoalCalories(profile: UserProfile): number {
  const tdee = calculateTDEE(profile);
  switch (profile.goal) {
    case "fat_loss":
      return tdee - 500;
    case "muscle_gain":
      return tdee + 300;
    case "strength":
      return tdee + 150;
    case "endurance":
      return tdee;
  }
}

export function estimateCaloriesBurned(
  workoutType: "strength" | "cardio" | "hiit" | "stretching",
  weightKg: number,
  durationMinutes: number,
): number {
  const metValues = { strength: 5.0, cardio: 6.5, hiit: 8.0, stretching: 2.5 };
  const met = metValues[workoutType];
  return Math.round(met * weightKg * (durationMinutes / 60));
}

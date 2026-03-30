import type { WorkoutLogEntry } from "../hooks/useWorkoutLog";
import type { WorkoutExercise, WorkoutPlan } from "./workoutGenerator";

interface AdjustmentResult {
  plan: WorkoutPlan;
  message: string;
}

export function applyProgressiveOverload(
  plan: WorkoutPlan,
  recentLog: WorkoutLogEntry[],
): AdjustmentResult {
  if (recentLog.length === 0) return { plan, message: "" };

  const last3 = recentLog.slice(-3);
  const feedbacks = last3.map((e) => e.feedback);
  const avgCompletion =
    last3.reduce((s, e) => {
      const totalExpected = e.completedSets.length;
      return s + (totalExpected > 0 ? 1 : 0);
    }, 0) / last3.length;

  const allEasy = feedbacks.every((f) => f === "easy");
  const allHard = feedbacks.every((f) => f === "hard");
  const latestFeedback = recentLog[recentLog.length - 1]?.feedback;
  const latestCompletion = recentLog.length > 0 ? 1 : 0;

  let message = "";

  const updatedDays = plan.days.map((day) => ({
    ...day,
    exercises: day.exercises.map((ex: WorkoutExercise) => {
      let { sets, reps } = ex;

      if (allEasy && avgCompletion > 0.9) {
        // Increase reps
        if (typeof reps === "string" && reps.includes("-")) {
          const [lo, hi] = reps.split("-").map(Number);
          reps = `${lo + 1}-${hi + 2}`;
          message = "📈 Progressive overload applied: reps increased!";
        } else if (typeof reps === "number") {
          reps = reps + 2;
          message = "📈 Progressive overload applied: reps increased!";
        }
      } else if (
        allHard ||
        (latestFeedback === "hard" && latestCompletion < 0.5)
      ) {
        // Reduce volume
        sets = Math.max(2, sets - 1);
        message = "🛡️ Volume reduced to help recovery. Keep it up!";
      }

      // Every 4 weeks: increase weight suggestion
      if (plan.weekNumber > 1 && plan.weekNumber % 4 === 0) {
        message = "💪 Week 4 milestone: time to add 5% more weight!";
      }

      return { ...ex, sets, reps };
    }),
  }));

  return {
    plan: { ...plan, days: updatedDays, weekNumber: plan.weekNumber + 1 },
    message,
  };
}

export function getMotivationalMessage(log: WorkoutLogEntry[]): string {
  const messages = [
    "Every rep brings you closer to your goal. 💪",
    "Consistency beats perfection every time. 🎯",
    "Your only competition is yesterday's you. 🚀",
    "The pain you feel today is the strength you'll feel tomorrow. ⚡",
    "Discipline is the bridge between goals and accomplishment. 🌉",
    "You didn't come this far to only come this far. 🔥",
    "Champions are made in the moments they want to give up. 🏆",
    "Success is the sum of small efforts repeated daily. ⭐",
    "The body achieves what the mind believes. 🧠",
    "No shortcuts. Just results. 🚫",
    "Sweat is just fat crying. Keep going! 💧",
    "One workout at a time. That's all it takes. ✅",
    "Stronger than yesterday. Weaker than tomorrow. 📈",
    "Make your future self proud. 🌟",
    "Fall down seven times, get up eight. 🥊",
    "Your workout is a gift to your future self. 🎁",
    "Hard work beats talent when talent doesn't work hard. ⛏️",
    "The only bad workout is the one that didn't happen. 🙌",
    "Push yourself — no one else will do it for you. 🔫",
    "Transform your body, transform your life. 🔄",
  ];
  const dayOfYear = Math.floor(Date.now() / 86400000);
  return messages[(dayOfYear + log.length) % messages.length];
}

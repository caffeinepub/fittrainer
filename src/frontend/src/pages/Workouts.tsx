import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Dumbbell, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { exercises } from "../data/exercises";
import type { UserProfile } from "../hooks/useProfile";
import type { WorkoutLogEntry } from "../hooks/useWorkoutLog";
import { storage } from "../lib/storage";
import { applyProgressiveOverload } from "../lib/trainerLogic";
import type { WorkoutPlan } from "../lib/workoutGenerator";
import { generateWorkoutPlan } from "../lib/workoutGenerator";

interface Props {
  profile: UserProfile;
  plan: WorkoutPlan | null;
  onPlanUpdate: (plan: WorkoutPlan) => void;
  log: WorkoutLogEntry[];
}

export default function Workouts({ profile, plan, onPlanUpdate, log }: Props) {
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [adjustMsg, setAdjustMsg] = useState("");

  function handleGenerate() {
    let newPlan = generateWorkoutPlan(profile, plan ? plan.weekNumber + 1 : 1);
    if (log.length > 0) {
      const { plan: adjusted, message } = applyProgressiveOverload(
        newPlan,
        log,
      );
      newPlan = adjusted;
      if (message) setAdjustMsg(message);
    }
    storage.setPlan(newPlan);
    onPlanUpdate(newPlan);
  }

  const splitLabels = {
    full_body: "Full Body",
    upper_lower: "Upper / Lower",
    push_pull_legs: "Push / Pull / Legs",
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Workout Plan</h1>
          {plan && (
            <p className="text-sm text-muted-foreground mt-1">
              {splitLabels[plan.split]} &bull; Week {plan.weekNumber} &bull;{" "}
              {plan.days.length} days
            </p>
          )}
        </div>
        <Button
          type="button"
          data-ocid="workouts.generate.primary_button"
          className="bg-neon text-neon-foreground hover:opacity-90 font-semibold"
          onClick={handleGenerate}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {plan ? "Regenerate" : "Generate Plan"}
        </Button>
      </div>

      {adjustMsg && (
        <div className="mb-4 p-3 rounded-xl bg-neon/10 border border-neon/20 text-neon text-sm">
          {adjustMsg}
        </div>
      )}

      {!plan ? (
        <div
          className="glass-card rounded-2xl p-12 text-center"
          data-ocid="workouts.empty_state"
        >
          <Dumbbell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Plan Yet</h2>
          <p className="text-muted-foreground mb-6">
            Generate a personalized plan based on your profile.
          </p>
          <Button
            type="button"
            data-ocid="workouts.empty.primary_button"
            className="bg-neon text-neon-foreground hover:opacity-90"
            onClick={handleGenerate}
          >
            Generate My Plan
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {plan.days.map((day, idx) => (
            <motion.div
              key={`${plan.id}-day-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              data-ocid={`workouts.day.item.${idx + 1}`}
              className="glass-card rounded-xl overflow-hidden"
            >
              <button
                type="button"
                data-ocid={`workouts.day.toggle.${idx + 1}`}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-progress/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-progress">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{day.dayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {day.exercises.length} exercises
                    </p>
                  </div>
                </div>
                {expandedDay === idx ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {expandedDay === idx && (
                <div className="px-4 pb-4 space-y-2 border-t border-border/30 pt-3">
                  {day.exercises.map((ex, exIdx) => {
                    const exData = exercises.find(
                      (e) => e.id === ex.exerciseId,
                    );
                    return (
                      <div
                        key={`${ex.exerciseId}-${exIdx}`}
                        data-ocid={`workouts.exercise.item.${exIdx + 1}`}
                        className="flex items-center gap-3 py-2"
                      >
                        <span className="w-5 h-5 rounded-full bg-secondary text-xs flex items-center justify-center text-muted-foreground">
                          {exIdx + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {exData?.name ?? ex.exerciseId}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {ex.sets} sets &times; {ex.reps} reps &bull;{" "}
                            {ex.restSeconds}s rest
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Badge className="text-xs bg-secondary text-muted-foreground border-0">
                            {exData?.muscleGroup}
                          </Badge>
                          <Badge className="text-xs bg-amber-fit/20 text-amber-fit border-0">
                            {exData?.equipment}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

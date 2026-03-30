import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Download,
  Dumbbell,
  Flame,
  Minus,
  Play,
  ThumbsDown,
  ThumbsUp,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import RestTimer from "../components/RestTimer";
import { exercises } from "../data/exercises";
import type { UserProfile } from "../hooks/useProfile";
import type { CompletedSet, WorkoutLogEntry } from "../hooks/useWorkoutLog";
import { estimateCaloriesBurned } from "../lib/calculators";
import { calculateBMI } from "../lib/calculators";
import { getMotivationalMessage } from "../lib/trainerLogic";
import type { WorkoutPlan } from "../lib/workoutGenerator";

interface Props {
  profile: UserProfile;
  plan: WorkoutPlan | null;
  log: WorkoutLogEntry[];
  onSaveEntry: (entry: WorkoutLogEntry) => void;
  onNavigate: (page: string) => void;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getTodayDayIndex(plan: WorkoutPlan, log: WorkoutLogEntry[]): number {
  const today = new Date().toISOString().slice(0, 10);
  const todayLog = log.find((e) => e.date === today);
  if (todayLog) return todayLog.planDayIndex;
  const completedIndexes = new Set(log.map((e) => e.planDayIndex));
  for (let i = 0; i < plan.days.length; i++) {
    if (!completedIndexes.has(i)) return i;
  }
  return 0;
}

export default function Dashboard({
  profile,
  plan,
  log,
  onSaveEntry,
  onNavigate,
}: Props) {
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [setRows, setSetRows] = useState<
    { reps: string; weight: string; done: boolean }[]
  >([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [allDoneSets, setAllDoneSets] = useState<CompletedSet[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [workoutSummary, setWorkoutSummary] = useState<WorkoutLogEntry | null>(
    null,
  );
  const [showTimerRest, setShowTimerRest] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);

  const todayIndex = plan ? getTodayDayIndex(plan, log) : 0;
  const todayWorkout = plan?.days[todayIndex];

  const todayLogged = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return log.find((e) => e.date === today);
  }, [log]);

  const streak = useMemo(() => {
    const dates = [...new Set(log.map((e) => e.date))].sort().reverse();
    let s = 0;
    const today = new Date();
    for (let i = 0; i < dates.length; i++) {
      const d = new Date(dates[i]);
      const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
      if (i === 0 && diff > 1) break;
      if (i > 0) {
        const prev = new Date(dates[i - 1]);
        const gap = Math.floor((prev.getTime() - d.getTime()) / 86400000);
        if (gap > 1) break;
      }
      s++;
    }
    return s;
  }, [log]);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const thisWeekCount = log.filter((e) => new Date(e.date) >= weekStart).length;

  const motivational = getMotivationalMessage(log);
  const bmi = calculateBMI(profile.weight, profile.height);

  function startWorkout() {
    if (!todayWorkout) return;
    const firstEx = todayWorkout.exercises[0];
    const numSets = firstEx?.sets ?? 3;
    setCurrentExIndex(0);
    setSetRows(
      Array.from({ length: numSets }, () => ({
        reps: String(firstEx?.reps ?? 10),
        weight: "0",
        done: false,
      })),
    );
    setAllDoneSets([]);
    setStartTime(Date.now());
    setShowFeedback(false);
    setWorkoutSummary(null);
    setWorkoutOpen(true);
  }

  function handleSetDone(idx: number, done: boolean) {
    setSetRows((rows) => rows.map((r, i) => (i === idx ? { ...r, done } : r)));
    if (done && todayWorkout) {
      const ex = todayWorkout.exercises[currentExIndex];
      setTimerSeconds(ex.restSeconds);
      setShowTimerRest(true);
    }
  }

  function nextExercise() {
    if (!todayWorkout) return;
    const ex = todayWorkout.exercises[currentExIndex];
    const newSets: CompletedSet[] = setRows
      .filter((r) => r.done)
      .map((r, i) => ({
        exerciseId: ex.exerciseId,
        setIndex: i,
        reps: Number.parseInt(r.reps) || 0,
        weight: Number.parseFloat(r.weight) || 0,
      }));
    setAllDoneSets((prev) => [...prev, ...newSets]);
    setShowTimerRest(false);

    if (currentExIndex + 1 >= todayWorkout.exercises.length) {
      setShowFeedback(true);
    } else {
      const nextEx = todayWorkout.exercises[currentExIndex + 1];
      setCurrentExIndex(currentExIndex + 1);
      setSetRows(
        Array.from({ length: nextEx.sets }, () => ({
          reps: String(nextEx.reps),
          weight: "0",
          done: false,
        })),
      );
    }
  }

  function finishWorkout(feedback: "easy" | "medium" | "hard") {
    if (!todayWorkout) return;
    const durationMinutes = Math.round((Date.now() - startTime) / 60000) || 1;
    const cal = estimateCaloriesBurned(
      "strength",
      profile.weight,
      durationMinutes,
    );
    const entry: WorkoutLogEntry = {
      id: `log_${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      planDayIndex: todayIndex,
      dayName: todayWorkout.dayName,
      durationMinutes,
      completedSets: allDoneSets,
      feedback,
      caloriesBurned: cal,
    };
    onSaveEntry(entry);
    setWorkoutSummary(entry);
    setShowFeedback(false);
  }

  function downloadSummary() {
    if (!workoutSummary || !todayWorkout) return;
    const lines = [
      "FitTrainer - Workout Summary",
      `Date: ${workoutSummary.date}`,
      `Workout: ${workoutSummary.dayName}`,
      `Duration: ${workoutSummary.durationMinutes} minutes`,
      `Calories Burned: ~${workoutSummary.caloriesBurned} kcal`,
      `Feedback: ${workoutSummary.feedback}`,
      "",
      "Exercises:",
      ...workoutSummary.completedSets.map((s) => {
        const ex = exercises.find((e) => e.id === s.exerciseId);
        return `  - ${ex?.name ?? s.exerciseId}: Set ${s.setIndex + 1} — ${s.reps} reps @ ${s.weight}kg`;
      }),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workout-${workoutSummary.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const currentEx = todayWorkout?.exercises[currentExIndex];
  const currentExData = currentEx
    ? exercises.find((e) => e.id === currentEx.exerciseId)
    : null;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto pb-24 md:pb-6">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl md:text-4xl font-bold">
          {getGreeting()}, <span className="text-neon">{profile.name}</span>!
        </h1>
        <p className="text-muted-foreground mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="mt-2 text-sm italic text-muted-foreground">
          &ldquo;{motivational}&rdquo;
        </p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          {
            icon: Flame,
            label: "Streak",
            value: `${streak}d`,
            color: "text-orange-400",
          },
          {
            icon: Calendar,
            label: "This Week",
            value: `${thisWeekCount}/${profile.daysPerWeek}`,
            color: "text-blue-progress",
          },
          {
            icon: Trophy,
            label: "Total",
            value: log.length,
            color: "text-neon",
          },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            data-ocid={`dashboard.stat.${i + 1}.card`}
            className="glass-card rounded-xl p-4 flex flex-col items-center gap-1"
          >
            <Icon className={`w-5 h-5 ${color}`} />
            <span className={`text-2xl font-bold ${color}`}>{value}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Workout */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card rounded-2xl p-5"
          data-ocid="dashboard.workout.card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Today&apos;s Routine</h2>
            {todayWorkout && (
              <Badge
                variant="outline"
                className="text-amber-fit border-amber-fit/30"
              >
                {plan?.split === "push_pull_legs"
                  ? "PPL"
                  : plan?.split === "upper_lower"
                    ? "U/L"
                    : "Full Body"}
              </Badge>
            )}
          </div>

          {!plan ? (
            <div
              className="text-center py-8"
              data-ocid="dashboard.workout.empty_state"
            >
              <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No workout plan yet.</p>
              <Button
                type="button"
                onClick={() => onNavigate("workouts")}
                className="mt-3 bg-neon text-neon-foreground hover:opacity-90"
              >
                Generate Plan
              </Button>
            </div>
          ) : todayLogged ? (
            <div
              className="text-center py-6"
              data-ocid="dashboard.workout.success_state"
            >
              <CheckCircle2 className="w-12 h-12 text-neon mx-auto mb-2" />
              <p className="font-semibold text-neon">Workout Complete!</p>
              <p className="text-sm text-muted-foreground">
                {todayWorkout?.dayName} &bull; {todayLogged.durationMinutes} min
                &bull; ~{todayLogged.caloriesBurned} kcal
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {todayWorkout?.exercises.map((ex, idx) => {
                  const exData = exercises.find((e) => e.id === ex.exerciseId);
                  return (
                    <div
                      key={`${ex.exerciseId}-${idx}`}
                      data-ocid={`dashboard.exercise.item.${idx + 1}`}
                      className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0"
                    >
                      <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {exData?.name ?? ex.exerciseId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {ex.sets} &times; {ex.reps} reps &bull;{" "}
                          {ex.restSeconds}s rest
                        </p>
                      </div>
                      <Badge className="text-xs bg-amber-fit/20 text-amber-fit border-0">
                        {exData?.difficulty}
                      </Badge>
                    </div>
                  );
                })}
              </div>
              <Button
                type="button"
                data-ocid="dashboard.workout.primary_button"
                className="w-full bg-neon text-neon-foreground font-bold hover:opacity-90 shadow-neon"
                onClick={startWorkout}
              >
                <Play className="w-4 h-4 mr-2" /> START WORKOUT
              </Button>
            </>
          )}
        </motion.div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-5"
            data-ocid="dashboard.bmi.card"
          >
            <h2 className="text-base font-semibold mb-3">Your Stats</h2>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">BMI</p>
                <p className="text-2xl font-bold" style={{ color: bmi.color }}>
                  {bmi.bmi}
                </p>
                <p className="text-xs" style={{ color: bmi.color }}>
                  {bmi.category}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Weight</p>
                <p className="text-2xl font-bold text-foreground">
                  {profile.weight}
                  <span className="text-sm text-muted-foreground">kg</span>
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              <span className="text-xs text-muted-foreground">Goal</span>
              <Badge
                variant="outline"
                className="text-neon border-neon/30 text-xs"
              >
                {profile.goal.replace("_", " ")}
              </Badge>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-5"
            data-ocid="dashboard.weekly.card"
          >
            <h2 className="text-base font-semibold mb-3">Weekly Goal</h2>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg
                  aria-hidden="true"
                  className="w-full h-full -rotate-90"
                  viewBox="0 0 80 80"
                >
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="oklch(0.22 0.04 240)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={
                      2 *
                      Math.PI *
                      34 *
                      (1 - Math.min(1, thisWeekCount / profile.daysPerWeek))
                    }
                    style={{ transition: "stroke-dashoffset 0.8s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-progress">
                    {thisWeekCount}/{profile.daysPerWeek}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Workouts</p>
                <p className="text-xs text-muted-foreground">this week</p>
                {thisWeekCount >= profile.daysPerWeek && (
                  <p className="text-xs text-neon mt-1 font-medium">
                    Goal reached! 🎉
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Rest Timer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 glass-card rounded-2xl p-5"
        data-ocid="dashboard.timer.card"
      >
        <h2 className="text-base font-semibold mb-4">Rest Timer</h2>
        <RestTimer defaultSeconds={60} />
      </motion.div>

      {/* Active Workout Modal */}
      <Dialog open={workoutOpen} onOpenChange={setWorkoutOpen}>
        <DialogContent
          data-ocid="workout.modal"
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          style={{
            background: "oklch(0.15 0.04 240)",
            border: "1px solid oklch(0.96 0 0 / 0.1)",
          }}
        >
          <DialogHeader>
            <DialogTitle>{todayWorkout?.dayName}</DialogTitle>
          </DialogHeader>

          {showFeedback ? (
            workoutSummary ? (
              <div
                className="text-center py-4"
                data-ocid="workout.success_state"
              >
                <CheckCircle2 className="w-16 h-16 text-neon mx-auto mb-3" />
                <h3 className="text-xl font-bold">Workout Complete!</h3>
                <p className="text-muted-foreground mt-1">
                  {workoutSummary.durationMinutes} min &bull; ~
                  {workoutSummary.caloriesBurned} kcal burned
                </p>
                <Button
                  type="button"
                  data-ocid="workout.download_button"
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={downloadSummary}
                >
                  <Download className="w-4 h-4 mr-2" /> Download Summary
                </Button>
                <Button
                  type="button"
                  data-ocid="workout.close_button"
                  className="mt-2 w-full bg-neon text-neon-foreground"
                  onClick={() => setWorkoutOpen(false)}
                >
                  Close
                </Button>
              </div>
            ) : (
              <div className="py-4" data-ocid="workout.feedback.panel">
                <h3 className="text-lg font-semibold mb-2 text-center">
                  How was that workout?
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  Your feedback helps adjust your plan
                </p>
                <div className="flex gap-3">
                  {[
                    {
                      value: "easy" as const,
                      icon: ThumbsUp,
                      label: "Easy",
                      color: "text-neon",
                    },
                    {
                      value: "medium" as const,
                      icon: Minus,
                      label: "Medium",
                      color: "text-amber-fit",
                    },
                    {
                      value: "hard" as const,
                      icon: ThumbsDown,
                      label: "Hard",
                      color: "text-destructive",
                    },
                  ].map(({ value, icon: Icon, label, color }) => (
                    <button
                      key={value}
                      type="button"
                      data-ocid={`workout.feedback.${value}.button`}
                      className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 hover:border-current transition-colors ${color}`}
                      onClick={() => finishWorkout(value)}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )
          ) : currentExData ? (
            <div className="py-2" data-ocid="workout.exercise.panel">
              <div className="flex items-center gap-2 mb-4">
                {todayWorkout?.exercises.map((pex, i) => (
                  <div
                    key={pex.exerciseId}
                    className={`flex-1 h-1.5 rounded-full transition-colors ${
                      i < currentExIndex
                        ? "bg-neon"
                        : i === currentExIndex
                          ? "bg-blue-progress"
                          : "bg-secondary"
                    }`}
                  />
                ))}
              </div>

              <div className="mb-1">
                <p className="text-xs text-muted-foreground">
                  Exercise {currentExIndex + 1} of{" "}
                  {todayWorkout?.exercises.length}
                </p>
                <h3 className="text-xl font-bold">{currentExData.name}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge className="text-xs bg-secondary text-muted-foreground">
                    {currentExData.muscleGroup}
                  </Badge>
                  <Badge className="text-xs bg-amber-fit/20 text-amber-fit border-0">
                    {currentExData.difficulty}
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 mt-2">
                {currentExData.instructions}
              </p>

              {showTimerRest && (
                <div className="mb-4 p-3 rounded-xl bg-secondary/50">
                  <p className="text-sm font-medium text-center mb-2">
                    Rest Time
                  </p>
                  <RestTimer
                    key={timerSeconds}
                    defaultSeconds={timerSeconds}
                    autoStart
                    onComplete={() => setShowTimerRest(false)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground mb-1">
                  <span>Set</span>
                  <span>Reps</span>
                  <span>Weight (kg)</span>
                  <span>Done</span>
                </div>
                {setRows.map((row, i) => (
                  <div
                    key={`set-${row.reps}-${row.weight}-${i}`}
                    data-ocid={`workout.set.item.${i + 1}`}
                    className="grid grid-cols-4 gap-2 items-center"
                  >
                    <span className="text-sm font-medium">{i + 1}</span>
                    <Input
                      data-ocid="workout.set.reps.input"
                      value={row.reps}
                      onChange={(e) =>
                        setSetRows((rows) =>
                          rows.map((r, ri) =>
                            ri === i ? { ...r, reps: e.target.value } : r,
                          ),
                        )
                      }
                      className="h-8 text-sm bg-secondary border-0"
                    />
                    <Input
                      data-ocid="workout.set.weight.input"
                      value={row.weight}
                      onChange={(e) =>
                        setSetRows((rows) =>
                          rows.map((r, ri) =>
                            ri === i ? { ...r, weight: e.target.value } : r,
                          ),
                        )
                      }
                      className="h-8 text-sm bg-secondary border-0"
                    />
                    <button
                      type="button"
                      data-ocid={`workout.set.checkbox.${i + 1}`}
                      onClick={() => handleSetDone(i, !row.done)}
                      className="flex justify-center"
                    >
                      {row.done ? (
                        <CheckCircle2 className="w-5 h-5 text-neon" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                data-ocid="workout.next.primary_button"
                className="w-full mt-4 bg-neon text-neon-foreground font-semibold hover:opacity-90"
                onClick={nextExercise}
              >
                <Zap className="w-4 h-4 mr-2" />
                {currentExIndex + 1 >= (todayWorkout?.exercises.length ?? 1)
                  ? "Finish Workout"
                  : "Next Exercise"}
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

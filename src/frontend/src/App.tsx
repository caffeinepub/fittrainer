import { Toaster } from "@/components/ui/sonner";
import { useCallback, useState } from "react";
import NavBar from "./components/NavBar";
import { useProfile } from "./hooks/useProfile";
import { useWorkoutLog } from "./hooks/useWorkoutLog";
import { storage } from "./lib/storage";
import { generateWorkoutPlan } from "./lib/workoutGenerator";
import type { WorkoutPlan } from "./lib/workoutGenerator";
import Dashboard from "./pages/Dashboard";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Progress from "./pages/Progress";
import Workouts from "./pages/Workouts";

type Page = "dashboard" | "workouts" | "progress" | "library" | "profile";

export default function App() {
  const { profile, saveProfile, clearProfile } = useProfile();
  const { log, addEntry, clearLog } = useWorkoutLog();
  const [page, setPage] = useState<Page>("dashboard");
  const [plan, setPlanState] = useState<WorkoutPlan | null>(() =>
    storage.getPlan(),
  );

  const handleProfileComplete = useCallback(
    (p: typeof profile) => {
      if (!p) return;
      saveProfile(p);
      const newPlan = generateWorkoutPlan(p, 1);
      storage.setPlan(newPlan);
      setPlanState(newPlan);
    },
    [saveProfile],
  );

  const handlePlanUpdate = useCallback((p: WorkoutPlan) => {
    setPlanState(p);
  }, []);

  const handleClear = useCallback(() => {
    clearProfile();
    clearLog();
    setPlanState(null);
  }, [clearProfile, clearLog]);

  if (!profile) {
    return (
      <>
        <Onboarding onComplete={handleProfileComplete} />
        <Toaster />
      </>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.12 0.035 240)" }}
    >
      <NavBar
        currentPage={page}
        onNavigate={(p) => setPage(p as Page)}
        profile={profile}
      />
      <main className="flex-1">
        {page === "dashboard" && (
          <Dashboard
            profile={profile}
            plan={plan}
            log={log}
            onSaveEntry={addEntry}
            onNavigate={(p) => setPage(p as Page)}
          />
        )}
        {page === "workouts" && (
          <Workouts
            profile={profile}
            plan={plan}
            onPlanUpdate={handlePlanUpdate}
            log={log}
          />
        )}
        {page === "progress" && <Progress log={log} profile={profile} />}
        {page === "library" && <ExerciseLibrary />}
        {page === "profile" && (
          <Profile
            profile={profile}
            onSave={saveProfile}
            onClear={handleClear}
          />
        )}
      </main>
      <footer className="text-center py-4 text-xs text-muted-foreground border-t border-border/30 hidden md:block">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neon hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
      <Toaster />
    </div>
  );
}

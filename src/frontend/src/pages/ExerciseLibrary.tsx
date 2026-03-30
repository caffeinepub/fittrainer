import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { exercises } from "../data/exercises";
import type { Exercise } from "../data/exercises";

const MUSCLE_GROUPS: { value: string; label: string }[] = [
  { value: "all", label: "All Muscles" },
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "shoulders", label: "Shoulders" },
  { value: "biceps", label: "Biceps" },
  { value: "triceps", label: "Triceps" },
  { value: "legs", label: "Legs" },
  { value: "glutes", label: "Glutes" },
  { value: "core", label: "Core" },
  { value: "cardio", label: "Cardio" },
  { value: "full_body", label: "Full Body" },
];

const EQUIPMENT_OPTIONS = [
  { value: "all", label: "All Equipment" },
  { value: "none", label: "No Equipment" },
  { value: "dumbbells", label: "Dumbbells" },
  { value: "full_gym", label: "Full Gym" },
];

const DIFF_COLORS: Record<Exercise["difficulty"], string> = {
  beginner: "bg-neon/20 text-neon border-0",
  intermediate: "bg-amber-fit/20 text-amber-fit border-0",
  advanced: "bg-destructive/20 text-red-400 border-0",
};

const MUSCLE_COLORS: Record<string, string> = {
  chest: "bg-blue-500/20 text-blue-400",
  back: "bg-purple-500/20 text-purple-400",
  shoulders: "bg-cyan-500/20 text-cyan-400",
  biceps: "bg-emerald-500/20 text-emerald-400",
  triceps: "bg-teal-500/20 text-teal-400",
  legs: "bg-orange-500/20 text-orange-400",
  glutes: "bg-pink-500/20 text-pink-400",
  core: "bg-yellow-500/20 text-yellow-400",
  cardio: "bg-red-500/20 text-red-400",
  full_body: "bg-indigo-500/20 text-indigo-400",
};

export default function ExerciseLibrary() {
  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("all");
  const [equipFilter, setEquipFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = exercises.filter((ex) => {
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchMuscle =
      muscleFilter === "all" || ex.muscleGroup === muscleFilter;
    const matchEquip = equipFilter === "all" || ex.equipment === equipFilter;
    return matchSearch && matchMuscle && matchEquip;
  });

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto pb-24 md:pb-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold">Exercise Library</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {exercises.length} exercises available
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="library.search_input"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary border-0"
          />
        </div>
        <Select value={muscleFilter} onValueChange={setMuscleFilter}>
          <SelectTrigger
            data-ocid="library.muscle.select"
            className="w-full sm:w-44 bg-secondary border-0"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MUSCLE_GROUPS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={equipFilter} onValueChange={setEquipFilter}>
          <SelectTrigger
            data-ocid="library.equipment.select"
            className="w-full sm:w-44 bg-secondary border-0"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EQUIPMENT_OPTIONS.map((e) => (
              <SelectItem key={e.value} value={e.value}>
                {e.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div
          className="glass-card rounded-2xl p-12 text-center"
          data-ocid="library.empty_state"
        >
          <p className="text-muted-foreground">
            No exercises match your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((ex, i) => (
              <motion.div
                key={ex.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                data-ocid={`library.exercise.item.${i + 1}`}
                className="glass-card rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  className="w-full p-4 text-left hover:bg-white/5 transition-colors"
                  onClick={() => setExpanded(expanded === ex.id ? null : ex.id)}
                  data-ocid={`library.exercise.toggle.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm leading-tight">
                      {ex.name}
                    </p>
                    {expanded === ex.id ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge
                      className={`text-xs ${MUSCLE_COLORS[ex.muscleGroup] ?? "bg-secondary text-muted-foreground"} border-0`}
                    >
                      {ex.muscleGroup.replace("_", " ")}
                    </Badge>
                    <Badge className={`text-xs ${DIFF_COLORS[ex.difficulty]}`}>
                      {ex.difficulty}
                    </Badge>
                    <Badge className="text-xs bg-secondary text-muted-foreground border-0">
                      {ex.equipment === "none"
                        ? "Bodyweight"
                        : ex.equipment === "dumbbells"
                          ? "Dumbbells"
                          : "Gym"}
                    </Badge>
                  </div>
                </button>

                <AnimatePresence>
                  {expanded === ex.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-border/30"
                    >
                      <div className="p-4 pt-3">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {ex.instructions}
                        </p>
                        <div className="mt-2">
                          <span className="text-xs text-muted-foreground capitalize">
                            {ex.category} exercise
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

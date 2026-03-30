import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Dumbbell } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { UserProfile } from "../hooks/useProfile";

interface Props {
  onComplete: (profile: UserProfile) => void;
}

const GOALS = [
  {
    value: "fat_loss" as const,
    label: "Fat Loss",
    emoji: "🔥",
    desc: "Burn fat, get lean",
  },
  {
    value: "muscle_gain" as const,
    label: "Muscle Gain",
    emoji: "💪",
    desc: "Build size and mass",
  },
  {
    value: "strength" as const,
    label: "Strength",
    emoji: "⛏️",
    desc: "Get stronger",
  },
  {
    value: "endurance" as const,
    label: "Endurance",
    emoji: "🏊",
    desc: "Improve stamina",
  },
];

const EXPERIENCE = [
  { value: "beginner" as const, label: "Beginner", desc: "Less than 1 year" },
  { value: "intermediate" as const, label: "Intermediate", desc: "1-3 years" },
  { value: "advanced" as const, label: "Advanced", desc: "3+ years" },
];

const EQUIPMENT = [
  {
    value: "none" as const,
    label: "No Equipment",
    emoji: "🏠",
    desc: "Bodyweight only",
  },
  {
    value: "dumbbells" as const,
    label: "Dumbbells",
    emoji: "🔎",
    desc: "Dumbbells at home",
  },
  {
    value: "full_gym" as const,
    label: "Full Gym",
    emoji: "🏋️",
    desc: "Access to gym",
  },
];

const DAYS = [2, 3, 4, 5, 6];

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Partial<UserProfile>>({
    name: "",
    age: 25,
    gender: "male",
    height: 175,
    weight: 75,
    goal: "muscle_gain",
    experience: "beginner",
    equipment: "none",
    daysPerWeek: 3,
  });

  const totalSteps = 4;

  function next() {
    if (step < totalSteps - 1) setStep((s) => s + 1);
    else onComplete(form as UserProfile);
  }
  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  const canNext = () => {
    if (step === 0)
      return !!(form.name && form.age && form.height && form.weight);
    return true;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, oklch(0.18 0.06 240) 0%, oklch(0.10 0.03 240) 70%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-neon flex items-center justify-center mx-auto mb-3 shadow-neon">
            <Dumbbell className="w-7 h-7 text-neon-foreground" />
          </div>
          <h1 className="text-3xl font-bold">FitTrainer</h1>
          <p className="text-muted-foreground mt-1">
            Your free AI personal trainer
          </p>
        </div>

        <div className="flex gap-1.5 mb-6">
          {[1, 2, 3, 4].map((stepNum) => (
            <div
              key={stepNum}
              className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${stepNum - 1 <= step ? "bg-neon" : "bg-secondary"}`}
            />
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-bold mb-5">
                  Tell us about yourself
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Your Name
                    </Label>
                    <Input
                      data-ocid="onboarding.name.input"
                      placeholder="Alex"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="mt-1 bg-secondary border-0"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Age
                      </Label>
                      <Input
                        data-ocid="onboarding.age.input"
                        type="number"
                        min="10"
                        max="100"
                        value={form.age}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            age: Number.parseInt(e.target.value) || 0,
                          }))
                        }
                        className="mt-1 bg-secondary border-0"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Gender
                      </Label>
                      <div className="flex gap-1 mt-1">
                        {(["male", "female", "other"] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            data-ocid={`onboarding.gender.${g}.button`}
                            onClick={() =>
                              setForm((f) => ({ ...f, gender: g }))
                            }
                            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                              form.gender === g
                                ? "bg-neon text-neon-foreground"
                                : "bg-secondary text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Height (cm)
                      </Label>
                      <Input
                        data-ocid="onboarding.height.input"
                        type="number"
                        min="100"
                        max="250"
                        value={form.height}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            height: Number.parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="mt-1 bg-secondary border-0"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Weight (kg)
                      </Label>
                      <Input
                        data-ocid="onboarding.weight.input"
                        type="number"
                        min="30"
                        max="300"
                        value={form.weight}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            weight: Number.parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="mt-1 bg-secondary border-0"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-bold mb-5">
                  What&apos;s your goal?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {GOALS.map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      data-ocid={`onboarding.goal.${g.value}.button`}
                      onClick={() => setForm((f) => ({ ...f, goal: g.value }))}
                      className={`p-4 rounded-xl text-left transition-all ${
                        form.goal === g.value
                          ? "bg-neon/20 border border-neon/50 shadow-neon"
                          : "bg-secondary border border-transparent hover:border-border"
                      }`}
                    >
                      <span className="text-2xl">{g.emoji}</span>
                      <p className="font-semibold mt-2 text-sm">{g.label}</p>
                      <p className="text-xs text-muted-foreground">{g.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-bold mb-2">Experience level</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  This determines your workout split and intensity.
                </p>
                <div className="space-y-3">
                  {EXPERIENCE.map((e) => (
                    <button
                      key={e.value}
                      type="button"
                      data-ocid={`onboarding.experience.${e.value}.button`}
                      onClick={() =>
                        setForm((f) => ({ ...f, experience: e.value }))
                      }
                      className={`w-full p-4 rounded-xl text-left flex items-center gap-3 transition-all ${
                        form.experience === e.value
                          ? "bg-neon/20 border border-neon/50"
                          : "bg-secondary border border-transparent hover:border-border"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                          form.experience === e.value
                            ? "border-neon bg-neon"
                            : "border-muted-foreground"
                        }`}
                      />
                      <div>
                        <p className="font-semibold text-sm">{e.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl font-bold mb-5">
                  Equipment &amp; Schedule
                </h2>
                <p className="text-sm text-muted-foreground mb-3">
                  Available equipment
                </p>
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {EQUIPMENT.map((e) => (
                    <button
                      key={e.value}
                      type="button"
                      data-ocid={`onboarding.equipment.${e.value}.button`}
                      onClick={() =>
                        setForm((f) => ({ ...f, equipment: e.value }))
                      }
                      className={`p-3 rounded-xl text-center transition-all ${
                        form.equipment === e.value
                          ? "bg-neon/20 border border-neon/50"
                          : "bg-secondary border border-transparent hover:border-border"
                      }`}
                    >
                      <span className="text-xl">{e.emoji}</span>
                      <p className="text-xs font-medium mt-1">{e.label}</p>
                      <p className="text-xs text-muted-foreground">{e.desc}</p>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Workout days per week
                </p>
                <div className="flex gap-2">
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      data-ocid={`onboarding.days.${d}.button`}
                      onClick={() => setForm((f) => ({ ...f, daysPerWeek: d }))}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                        form.daysPerWeek === d
                          ? "bg-neon text-neon-foreground shadow-neon"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-6">
            <Button
              type="button"
              data-ocid="onboarding.back.button"
              variant="ghost"
              onClick={back}
              disabled={step === 0}
              className="text-muted-foreground"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button
              type="button"
              data-ocid="onboarding.next.primary_button"
              onClick={next}
              disabled={!canNext()}
              className="bg-neon text-neon-foreground hover:opacity-90 font-semibold px-6"
            >
              {step === totalSteps - 1 ? "Let's Go! 🚀" : "Continue"}
              {step < totalSteps - 1 && (
                <ChevronRight className="w-4 h-4 ml-1" />
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

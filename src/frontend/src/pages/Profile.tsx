import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff, Calculator, Edit2, Save, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { UserProfile } from "../hooks/useProfile";
import {
  calculateBMI,
  calculateGoalCalories,
  calculateTDEE,
} from "../lib/calculators";

interface Props {
  profile: UserProfile;
  onSave: (p: UserProfile) => void;
  onClear: () => void;
}

export default function Profile({ profile, onSave, onClear }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<UserProfile>(profile);
  const [notificationsOn, setNotificationsOn] = useState(false);

  const bmi = calculateBMI(profile.weight, profile.height);
  const tdee = calculateTDEE(profile);
  const goalCal = calculateGoalCalories(profile);

  function handleSave() {
    onSave(form);
    setEditing(false);
  }

  async function toggleNotifications(on: boolean) {
    if (on) {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        setNotificationsOn(true);
        new Notification("FitTrainer", {
          body: "Reminder notifications enabled! Let's crush those goals 💪",
        });
      }
    } else {
      setNotificationsOn(false);
    }
  }

  const field = (label: string, key: keyof UserProfile, type = "text") => (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {editing ? (
        <Input
          data-ocid={`profile.${key}.input`}
          type={type}
          value={String(form[key])}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              [key]:
                type === "number"
                  ? Number.parseFloat(e.target.value) || 0
                  : e.target.value,
            }))
          }
          className="mt-1 bg-secondary border-0"
        />
      ) : (
        <p className="font-medium mt-0.5">{String(profile[key])}</p>
      )}
    </div>
  );

  const selectField = <T extends string>(
    label: string,
    key: keyof UserProfile,
    options: { value: T; label: string }[],
  ) => (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {editing ? (
        <Select
          value={String(form[key])}
          onValueChange={(v) => setForm((f) => ({ ...f, [key]: v }))}
        >
          <SelectTrigger
            data-ocid={`profile.${key}.select`}
            className="mt-1 bg-secondary border-0"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <p className="font-medium mt-0.5 capitalize">
          {String(profile[key]).replace("_", " ")}
        </p>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button
                data-ocid="profile.cancel.button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setForm(profile);
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                data-ocid="profile.save.primary_button"
                size="sm"
                className="bg-neon text-neon-foreground hover:opacity-90"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
            </>
          ) : (
            <Button
              data-ocid="profile.edit.button"
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
            >
              <Edit2 className="w-4 h-4 mr-1" /> Edit
            </Button>
          )}
        </div>
      </div>

      {/* Personal Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5 mb-4"
      >
        <h2 className="text-base font-semibold mb-4">Personal Info</h2>
        <div className="grid grid-cols-2 gap-4">
          {field("Name", "name")}
          {field("Age", "age", "number")}
          {field("Height (cm)", "height", "number")}
          {field("Weight (kg)", "weight", "number")}
          {selectField("Gender", "gender", [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
          ])}
          {selectField("Workout Days/Week", "daysPerWeek", [
            { value: "2", label: "2 days" },
            { value: "3", label: "3 days" },
            { value: "4", label: "4 days" },
            { value: "5", label: "5 days" },
            { value: "6", label: "6 days" },
          ])}
        </div>
      </motion.div>

      {/* Fitness Goals */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-5 mb-4"
      >
        <h2 className="text-base font-semibold mb-4">Fitness Goals</h2>
        <div className="grid grid-cols-2 gap-4">
          {selectField("Goal", "goal", [
            { value: "fat_loss", label: "Fat Loss" },
            { value: "muscle_gain", label: "Muscle Gain" },
            { value: "strength", label: "Strength" },
            { value: "endurance", label: "Endurance" },
          ])}
          {selectField("Experience", "experience", [
            { value: "beginner", label: "Beginner" },
            { value: "intermediate", label: "Intermediate" },
            { value: "advanced", label: "Advanced" },
          ])}
          {selectField("Equipment", "equipment", [
            { value: "none", label: "No Equipment" },
            { value: "dumbbells", label: "Dumbbells" },
            { value: "full_gym", label: "Full Gym" },
          ])}
        </div>
      </motion.div>

      {/* BMI Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card rounded-2xl p-5 mb-4"
        data-ocid="profile.bmi.card"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-4 h-4 text-neon" />
          <h2 className="text-base font-semibold">BMI Calculator</h2>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-4xl font-bold" style={{ color: bmi.color }}>
              {bmi.bmi}
            </p>
            <p className="text-sm mt-1" style={{ color: bmi.color }}>
              {bmi.category}
            </p>
          </div>
          <div className="flex-1">
            {/* BMI scale */}
            <div
              className="relative h-3 rounded-full overflow-hidden"
              style={{
                background:
                  "linear-gradient(to right, #60a5fa 0%, #32E36B 25%, #FBBF24 65%, #f87171 100%)",
              }}
            >
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-800 shadow"
                style={{
                  left: `${Math.min(95, Math.max(2, ((bmi.bmi - 15) / 25) * 100))}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Calorie Estimator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-5 mb-4"
        data-ocid="profile.calories.card"
      >
        <h2 className="text-base font-semibold mb-4">Daily Calorie Needs</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-secondary/60">
            <p className="text-xs text-muted-foreground">Maintenance (TDEE)</p>
            <p className="text-2xl font-bold text-blue-progress mt-1">
              {tdee}
              <span className="text-sm text-muted-foreground ml-1">kcal</span>
            </p>
          </div>
          <div className="p-3 rounded-xl bg-secondary/60">
            <p className="text-xs text-muted-foreground">Goal Calories</p>
            <p className="text-2xl font-bold text-neon mt-1">
              {goalCal}
              <span className="text-sm text-muted-foreground ml-1">kcal</span>
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Based on Mifflin-St Jeor formula with activity adjustment.
        </p>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-card rounded-2xl p-5 mb-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {notificationsOn ? (
              <Bell className="w-4 h-4 text-neon" />
            ) : (
              <BellOff className="w-4 h-4 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium">Workout Reminders</p>
              <p className="text-xs text-muted-foreground">
                Browser push notifications
              </p>
            </div>
          </div>
          <Switch
            data-ocid="profile.notifications.switch"
            checked={notificationsOn}
            onCheckedChange={toggleNotifications}
          />
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-5 border border-destructive/20"
      >
        <h2 className="text-base font-semibold text-destructive mb-3">
          Danger Zone
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Clear all your data including profile, workout plan, and progress log.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              data-ocid="profile.clear.delete_button"
              variant="destructive"
              size="sm"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Reset All Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent
            style={{
              background: "oklch(0.15 0.04 240)",
              border: "1px solid oklch(0.96 0 0 / 0.1)",
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your profile, workout plan, and all
                progress data. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-ocid="profile.clear.cancel_button">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                data-ocid="profile.clear.confirm_button"
                onClick={onClear}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Reset Everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
}

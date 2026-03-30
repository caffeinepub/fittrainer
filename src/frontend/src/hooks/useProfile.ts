import { useCallback, useState } from "react";
import { storage } from "../lib/storage";

export interface UserProfile {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  height: number;
  weight: number;
  goal: "fat_loss" | "muscle_gain" | "strength" | "endurance";
  experience: "beginner" | "intermediate" | "advanced";
  equipment: "none" | "dumbbells" | "full_gym";
  daysPerWeek: number;
}

export function useProfile() {
  const [profile, setProfileState] = useState<UserProfile | null>(() =>
    storage.getProfile(),
  );

  const saveProfile = useCallback((p: UserProfile) => {
    storage.setProfile(p);
    setProfileState(p);
  }, []);

  const clearProfile = useCallback(() => {
    storage.clearAll();
    setProfileState(null);
  }, []);

  return { profile, saveProfile, clearProfile };
}

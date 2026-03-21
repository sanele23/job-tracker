import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, EducationField } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/* ── Supabase client (lazy) ──────────────────────────────── */
async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/client");
  return createClient();
}

/* ── state shape ─────────────────────────────────────────── */
interface ProfileState {
  profile: UserProfile;
  isLoaded: boolean;
}

/* ── actions ─────────────────────────────────────────────── */
interface ProfileActions {
  updateProfile: (updates: Partial<UserProfile>, userId?: string) => void;
  completeOnboarding: (userId?: string) => void;
  loadFromSupabase: (userId: string) => Promise<void>;
  setLoaded: () => void;
  resetProfile: () => void;
}

type ProfileStore = ProfileState & ProfileActions;

/* ── defaults ────────────────────────────────────────────── */
const DEFAULT_PROFILE: UserProfile = {
  name: "",
  experienceLevel: "student",
  currentRole: "",
  educationField: "none",
  interests: [],
  weeklyLearningHours: 5,
  budgetPreference: "free-only",
  hasCompletedOnboarding: false,
};

const DEMO_PROFILE: UserProfile = {
  name: "Sanele",
  experienceLevel: "junior",
  currentRole: "Student",
  educationField: "computer-science",
  interests: ["technology", "business-consulting"],
  weeklyLearningHours: 10,
  budgetPreference: "budget-friendly",
  hasCompletedOnboarding: true,
};

/** Save the full profile to Supabase (upsert). */
async function saveProfileToSupabase(profile: UserProfile, userId: string) {
  if (!isSupabaseConfigured()) return;
  const supabase = await getSupabase();
  const upsertData = {
    user_id: userId,
    name: profile.name,
    experience_level: profile.experienceLevel,
    current_role: profile.currentRole,
    education_field: profile.educationField,
    interests: profile.interests,
    weekly_learning_hours: profile.weeklyLearningHours,
    budget_preference: profile.budgetPreference,
    has_completed_onboarding: profile.hasCompletedOnboarding,
  };
  console.log("[saveProfileToSupabase] Upserting profile:", upsertData);
  const { error } = await supabase
    .from("profiles")
    .upsert(upsertData, { onConflict: "user_id" });
  if (error) {
    console.error("[saveProfileToSupabase] Upsert error:", error);
  } else {
    console.log("[saveProfileToSupabase] Upsert successful");
  }
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      isLoaded: false,

      updateProfile: (updates: Partial<UserProfile>, userId?: string) =>
        set((state) => {
          const updated = { ...state.profile, ...updates };
          if (userId) saveProfileToSupabase(updated, userId);
          return { profile: updated };
        }),

      completeOnboarding: (userId?: string) =>
        set((state) => {
          const updated = { ...state.profile, hasCompletedOnboarding: true };
          if (userId) {
            console.log(
              "[completeOnboarding] Marking onboarding complete for user:",
              userId,
              updated,
            );
            saveProfileToSupabase(updated, userId);
          }
          return { profile: updated };
        }),

      loadFromSupabase: async (userId: string) => {
        const supabase = await getSupabase();
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (!error && data) {
          set({
            profile: {
              name: data.name ?? "",
              experienceLevel: data.experience_level ?? "student",
              currentRole: data.current_role ?? "",
              educationField:
                (data.education_field as EducationField) ?? "none",
              interests: data.interests ?? [],
              weeklyLearningHours: data.weekly_learning_hours ?? 5,
              budgetPreference: data.budget_preference ?? "free-only",
              hasCompletedOnboarding: data.has_completed_onboarding ?? false,
            },
            isLoaded: true,
          });
        } else {
          // No row exists — user hasn't onboarded yet. Keep defaults.
          set({ isLoaded: true });
        }
      },

      resetProfile: () => set({ profile: DEMO_PROFILE }),

      setLoaded: () => set({ isLoaded: true }),
    }),
    {
      name: "cebisa-profile-storage",
      partialize: (state) => ({
        profile: state.profile,
      }),
    },
  ),
);
// Expose store globally for debugging and onboarding reload
if (typeof window !== "undefined") {
  window.__profileStore = {
    loadFromSupabase: (userId: string) =>
      useProfileStore.getState().loadFromSupabase(userId),
  };
}

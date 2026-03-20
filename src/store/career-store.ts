import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/* ── Supabase client (lazy) ──────────────────────────────── */
async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/client");
  return createClient();
}

/* ── state shape ─────────────────────────────────────────── */
interface CareerState {
  targetRoleId: string | null;
  completedSkillIds: string[];
  isInitialized: boolean;
}

/* ── actions ─────────────────────────────────────────────── */
interface CareerActions {
  initialize: () => void;
  loadFromSupabase: (userId: string) => Promise<void>;
  setTargetRole: (roleId: string | null, userId?: string) => void;
  toggleSkill: (skillId: string, userId?: string) => void;
  resetCareer: () => void;
}

type CareerStore = CareerState & CareerActions;

/* ── demo defaults ───────────────────────────────────────── */
const DEMO_CAREER: Pick<CareerState, "targetRoleId" | "completedSkillIds"> = {
  targetRoleId: "frontend-dev",
  completedSkillIds: ["html", "css", "javascript", "git", "responsive-design"],
};

/** Save career progress to Supabase (upsert). */
async function saveCareerToSupabase(
  targetRoleId: string | null,
  completedSkillIds: string[],
  userId: string,
) {
  if (!isSupabaseConfigured()) return;
  const supabase = await getSupabase();
  await supabase.from("user_career_progress").upsert(
    {
      user_id: userId,
      target_role_id: targetRoleId,
      completed_skill_ids: completedSkillIds,
    },
    { onConflict: "user_id" },
  );
}

export const useCareerStore = create<CareerStore>()(
  persist(
    (set, get) => ({
      /* ── initial state ── */
      targetRoleId: null,
      completedSkillIds: [],
      isInitialized: false,

      /* ── lifecycle ── */
      initialize: () => {
        if (get().isInitialized) return;
        // In Supabase mode, loadFromSupabase handles init
        if (isSupabaseConfigured()) {
          set({ isInitialized: true });
          return;
        }
        set({ ...DEMO_CAREER, isInitialized: true });
      },

      loadFromSupabase: async (userId: string) => {
        const supabase = await getSupabase();
        const { data, error } = await supabase
          .from("user_career_progress")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (!error && data) {
          set({
            targetRoleId: data.target_role_id ?? null,
            completedSkillIds: data.completed_skill_ids ?? [],
            isInitialized: true,
          });
        } else {
          // No row yet — user hasn't selected a career path
          set({ isInitialized: true });
        }
      },

      setTargetRole: (roleId, userId) => {
        set({ targetRoleId: roleId });
        if (userId)
          saveCareerToSupabase(roleId, get().completedSkillIds, userId);
      },

      toggleSkill: (skillId, userId) => {
        const { completedSkillIds } = get();
        const updated = completedSkillIds.includes(skillId)
          ? completedSkillIds.filter((id) => id !== skillId)
          : [...completedSkillIds, skillId];
        set({ completedSkillIds: updated });
        if (userId) saveCareerToSupabase(get().targetRoleId, updated, userId);
      },

      resetCareer: () => set({ ...DEMO_CAREER, isInitialized: true }),
    }),
    {
      name: "cebisa-career-storage",
      partialize: (state) => ({
        targetRoleId: state.targetRoleId,
        completedSkillIds: state.completedSkillIds,
        isInitialized: state.isInitialized,
      }),
    },
  ),
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Job, JobStatus } from "@/types";
import { DEMO_JOBS } from "@/lib/constants";
import { generateId } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/* ── Supabase client (lazy) ──────────────────────────────── */
async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/client");
  return createClient();
}

/* ── state shape ─────────────────────────────────────────── */
interface JobState {
  jobs: Job[];
  searchQuery: string;
  statusFilter: JobStatus | "all";
  isInitialized: boolean;
}

/* ── actions ─────────────────────────────────────────────── */
interface JobActions {
  initialize: () => void;
  loadFromSupabase: (userId: string) => Promise<void>;
  addJob: (
    job: Omit<Job, "id" | "created_at" | "updated_at" | "user_id" | "position">,
    userId?: string,
  ) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  moveJob: (jobId: string, newStatus: JobStatus, newPosition?: number) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (filter: JobStatus | "all") => void;
  getFilteredJobs: () => Job[];
  getJobsByStatus: (status: JobStatus) => Job[];
  getStats: () => Record<JobStatus | "total", number>;
  seedDemoData: () => void;
  clearJobs: () => void;
}

type JobStore = JobState & JobActions;

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      /* ── initial state ── */
      jobs: [],
      searchQuery: "",
      statusFilter: "all",
      isInitialized: false,

      /* ── lifecycle ── */
      initialize: () => {
        const { isInitialized, jobs } = get();
        if (isInitialized) return;
        // In Supabase mode, loadFromSupabase handles init
        if (isSupabaseConfigured()) {
          set({ isInitialized: true });
          return;
        }
        if (jobs.length === 0) {
          set({ jobs: DEMO_JOBS, isInitialized: true });
        } else {
          set({ isInitialized: true });
        }
      },

      /* ── Supabase: fetch all jobs for user ── */
      loadFromSupabase: async (userId: string) => {
        const supabase = await getSupabase();
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("user_id", userId)
          .order("position", { ascending: true });

        if (!error && data) {
          set({ jobs: data as Job[], isInitialized: true });
        }
      },

      /* ── CRUD ── */
      addJob: (jobData, userId) => {
        const now = new Date().toISOString();
        const sameStatus = get().jobs.filter(
          (j) => j.status === jobData.status,
        );
        const tempId = generateId();
        const newJob: Job = {
          ...jobData,
          id: tempId,
          user_id: userId,
          position: sameStatus.length,
          created_at: now,
          updated_at: now,
        };
        set({ jobs: [...get().jobs, newJob] });

        // Persist to Supabase
        if (isSupabaseConfigured() && userId) {
          getSupabase().then((sb) =>
            sb
              .from("jobs")
              .insert({ ...newJob, id: undefined })
              .select()
              .single()
              .then(({ data }) => {
                if (data) {
                  set({
                    jobs: get().jobs.map((j) =>
                      j.id === tempId ? { ...j, id: data.id } : j,
                    ),
                  });
                }
              }),
          );
        }
      },

      updateJob: (id, updates) => {
        set({
          jobs: get().jobs.map((j) =>
            j.id === id
              ? { ...j, ...updates, updated_at: new Date().toISOString() }
              : j,
          ),
        });

        if (isSupabaseConfigured()) {
          const {
            id: _id,
            user_id: _uid,
            created_at: _ca,
            ...rest
          } = updates as Partial<Job>;
          getSupabase().then((sb) =>
            sb
              .from("jobs")
              .update({ ...rest, updated_at: new Date().toISOString() })
              .eq("id", id),
          );
        }
      },

      deleteJob: (id) => {
        set({ jobs: get().jobs.filter((j) => j.id !== id) });

        if (isSupabaseConfigured()) {
          getSupabase().then((sb) => sb.from("jobs").delete().eq("id", id));
        }
      },

      /* ── drag-and-drop ── */
      moveJob: (jobId, newStatus, newPosition) => {
        const jobs = get().jobs;
        const job = jobs.find((j) => j.id === jobId);
        if (!job || (job.status === newStatus && newPosition === undefined))
          return;

        const targetJobs = jobs
          .filter((j) => j.status === newStatus && j.id !== jobId)
          .sort((a, b) => a.position - b.position);

        const pos = newPosition ?? targetJobs.length;

        set({
          jobs: jobs.map((j) => {
            if (j.id === jobId) {
              return {
                ...j,
                status: newStatus,
                position: pos,
                updated_at: new Date().toISOString(),
              };
            }
            if (j.status === newStatus && j.id !== jobId) {
              const idx = targetJobs.findIndex((t) => t.id === j.id);
              return { ...j, position: idx >= pos ? idx + 1 : idx };
            }
            return j;
          }),
        });

        // Sync to Supabase
        if (isSupabaseConfigured()) {
          getSupabase().then((sb) =>
            sb
              .from("jobs")
              .update({
                status: newStatus,
                position: pos,
                updated_at: new Date().toISOString(),
              })
              .eq("id", jobId),
          );
        }
      },

      /* ── filters ── */
      setSearchQuery: (query) => set({ searchQuery: query }),
      setStatusFilter: (filter) => set({ statusFilter: filter }),

      getFilteredJobs: () => {
        const { jobs, searchQuery, statusFilter } = get();
        return jobs.filter((job) => {
          const matchesStatus =
            statusFilter === "all" || job.status === statusFilter;
          const q = searchQuery.toLowerCase();
          const matchesSearch =
            !q ||
            job.company.toLowerCase().includes(q) ||
            job.role.toLowerCase().includes(q) ||
            job.tags.some((t) => t.toLowerCase().includes(q));
          return matchesStatus && matchesSearch;
        });
      },

      getJobsByStatus: (status) =>
        get()
          .getFilteredJobs()
          .filter((j) => j.status === status)
          .sort((a, b) => a.position - b.position),

      getStats: () => {
        const jobs = get().jobs;
        return {
          total: jobs.length,
          wishlist: jobs.filter((j) => j.status === "wishlist").length,
          applied: jobs.filter((j) => j.status === "applied").length,
          interview: jobs.filter((j) => j.status === "interview").length,
          offer: jobs.filter((j) => j.status === "offer").length,
          rejected: jobs.filter((j) => j.status === "rejected").length,
        };
      },

      seedDemoData: () => set({ jobs: DEMO_JOBS, isInitialized: true }),
      clearJobs: () => set({ jobs: [], isInitialized: false }),
    }),
    {
      name: "job-tracker-storage",
      partialize: (state) => ({
        jobs: state.jobs,
        isInitialized: state.isInitialized,
      }),
    },
  ),
);

"use client";

import { useEffect, type ReactNode } from "react";
import { useJobStore } from "@/store/job-store";
import { useCareerStore } from "@/store/career-store";
import { useProfileStore } from "@/store/profile-store";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

/**
 * Wraps the app tree with auth + store initialization.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <StoreInitializer>{children}</StoreInitializer>
    </AuthProvider>
  );
}

/** Seeds demo data or loads from Supabase depending on auth state. */
function StoreInitializer({ children }: { children: ReactNode }) {
  const initialize = useJobStore((s) => s.initialize);
  const loadJobsFromSupabase = useJobStore((s) => s.loadFromSupabase);
  const initializeCareer = useCareerStore((s) => s.initialize);
  const loadCareerFromSupabase = useCareerStore((s) => s.loadFromSupabase);
  const loadProfileFromSupabase = useProfileStore((s) => s.loadFromSupabase);
  const setProfileLoaded = useProfileStore((s) => s.setLoaded);
  const hasCompletedOnboarding = useProfileStore(
    (s) => s.profile.hasCompletedOnboarding,
  );
  const { user, isSupabase, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (isSupabase && user) {
      // Load all user data from Supabase
      loadProfileFromSupabase(user.id);
      loadCareerFromSupabase(user.id);
      loadJobsFromSupabase(user.id);
    } else {
      // Demo mode: initialize with defaults
      setProfileLoaded();
      if (!hasCompletedOnboarding) {
        initializeCareer();
      }
      initialize();
    }
  }, [
    loading,
    isSupabase,
    user,
    initialize,
    loadJobsFromSupabase,
    initializeCareer,
    loadCareerFromSupabase,
    loadProfileFromSupabase,
    setProfileLoaded,
    hasCompletedOnboarding,
  ]);

  return <>{children}</>;
}

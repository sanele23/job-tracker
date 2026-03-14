"use client";

import { useEffect, type ReactNode } from "react";
import { useJobStore } from "@/store/job-store";
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
  const loadFromSupabase = useJobStore((s) => s.loadFromSupabase);
  const { user, isSupabase, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (isSupabase && user) {
      loadFromSupabase(user.id);
    } else {
      initialize();
    }
  }, [loading, isSupabase, user, initialize, loadFromSupabase]);

  return <>{children}</>;
}

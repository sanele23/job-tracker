"use client";

import { usePathname } from "next/navigation";
import { useProfileStore } from "@/store/profile-store";
import { useAuth } from "@/hooks/use-auth";
import type { ReactNode } from "react";

/**
 * If the user hasn't completed onboarding, let the onboarding page
 * through but gate everything else behind a redirect.
 */
export function OnboardingGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hasCompleted = useProfileStore((s) => s.profile.hasCompletedOnboarding);
  const isLoaded = useProfileStore((s) => s.isLoaded);
  const { isSupabase, loading: authLoading } = useAuth();

  // Always let onboarding page through
  if (pathname === "/onboarding") {
    return <>{children}</>;
  }

  // Wait for auth + profile to load before making redirect decisions
  if (authLoading || (isSupabase && !isLoaded)) {
    return null;
  }

  // If not onboarded, redirect to onboarding
  if (!hasCompleted) {
    if (typeof window !== "undefined") {
      window.location.replace("/onboarding");
    }
    return null;
  }

  return <>{children}</>;
}

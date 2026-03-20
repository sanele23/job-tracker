"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { useJobStore } from "@/store/job-store";
import { useCareerStore } from "@/store/career-store";
import { useProfileStore } from "@/store/profile-store";
import { useUIStore } from "@/store/ui-store";
import { Menu, Moon, Sun, RotateCcw, LogOut, LogIn } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/tracker": "Job Tracker",
  "/career": "Career Path",
  "/skills": "Skills",
  "/learning": "Learning",
  "/profile": "Profile",
  "/onboarding": "Getting Started",
};

export function AppHeader() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, isSupabase, signOut } = useAuth();
  const seedDemoData = useJobStore((s) => s.seedDemoData);
  const resetCareer = useCareerStore((s) => s.resetCareer);
  const resetProfile = useProfileStore((s) => s.resetProfile);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const title = PAGE_TITLES[pathname] ?? "Cebisa";

  const handleReset = () => {
    seedDemoData();
    resetCareer();
    resetProfile();
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-border bg-card/80 backdrop-blur-xl shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {!user && (
          <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            Demo
          </span>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {!user && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Reset demo data"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}

        {isSupabase && !user && (
          <a
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogIn size={14} />
            <span className="hidden sm:inline">Sign In</span>
          </a>
        )}

        {user && (
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Sign out"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  );
}

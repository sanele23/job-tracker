"use client";

import { useTheme } from "@/hooks/use-theme";
import { useJobStore } from "@/store/job-store";
import { useAuth } from "@/hooks/use-auth";
import { Briefcase, Moon, Sun, RotateCcw, LogOut, LogIn } from "lucide-react";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const seedDemoData = useJobStore((s) => s.seedDemoData);
  const { user, isSupabase, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
        {/* left: branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
            <Briefcase size={16} />
          </div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">
            JobTracker
          </h1>
          {!user && (
            <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              Demo
            </span>
          )}
        </div>

        {/* right: actions */}
        <div className="flex items-center gap-1">
          {!user && (
            <button
              onClick={seedDemoData}
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
      </div>
    </header>
  );
}

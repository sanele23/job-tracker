"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Compass,
  Target,
  BookOpen,
  X,
  GraduationCap,
  UserCircle,
} from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Job Tracker", href: "/tracker", icon: Briefcase },
  { label: "Career Path", href: "/career", icon: Compass },
  { label: "Skills", href: "/skills", icon: Target },
  { label: "Learning", href: "/learning", icon: BookOpen },
  { label: "Profile", href: "/profile", icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const closeSidebar = useUIStore((s) => s.closeSidebar);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col",
          "transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={closeSidebar}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-linear-to-br from-primary to-blue-600 text-primary-foreground shadow-sm">
              <GraduationCap size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight">
                Cebisa
              </h1>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Career Builder
              </p>
            </div>
          </Link>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "sidebar-active bg-primary-light text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center justify-center w-5 h-5 rounded-md bg-linear-to-br from-primary to-blue-600 text-primary-foreground">
              <GraduationCap size={10} />
            </div>
            <p className="text-[11px] text-muted-foreground">
              © 2026 Cebisa Career Builder
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

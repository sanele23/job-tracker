import type { CareerRole } from "@/types";
import { cn, formatSalary } from "@/lib/utils";
import { Check } from "lucide-react";

interface RoleCardProps {
  role: CareerRole;
  isSelected: boolean;
  readiness: number;
  onSelect: () => void;
}

export function RoleCard({
  role,
  isSelected,
  readiness,
  onSelect,
}: RoleCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "text-left w-full p-4 rounded-xl border transition-all duration-200",
        isSelected
          ? "bg-primary/5 border-primary ring-2 ring-primary/20"
          : "bg-card border-border hover:shadow-md hover:border-primary/30",
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-2xl">{role.icon}</span>
        {isSelected && (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
            <Check size={14} />
          </div>
        )}
      </div>

      <h3 className="text-sm font-semibold text-foreground mt-2">
        {role.title}
      </h3>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
        {role.description}
      </p>

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-muted-foreground">
          {formatSalary(role.averageSalary.min, role.averageSalary.max)}
        </span>
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full",
            role.demandLevel === "high"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : role.demandLevel === "medium"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          )}
        >
          {role.demandLevel} demand
        </span>
      </div>

      {readiness > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Readiness</span>
            <span className="font-medium text-foreground">{readiness}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                readiness >= 80
                  ? "bg-emerald-500"
                  : readiness >= 50
                    ? "bg-primary"
                    : "bg-amber-500",
              )}
              style={{ width: `${readiness}%` }}
            />
          </div>
        </div>
      )}
    </button>
  );
}

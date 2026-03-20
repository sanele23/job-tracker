"use client";

import type { Skill } from "@/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface SkillChecklistProps {
  title: string;
  skills: Skill[];
  completedIds: string[];
  onToggle: (id: string) => void;
}

export function SkillChecklist({
  title,
  skills,
  completedIds,
  onToggle,
}: SkillChecklistProps) {
  const completed = skills.filter((s) => completedIds.includes(s.id)).length;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">
          {completed}/{skills.length} complete
        </span>
      </div>

      <div className="space-y-1">
        {skills.map((skill) => {
          const isCompleted = completedIds.includes(skill.id);
          return (
            <button
              key={skill.id}
              onClick={() => onToggle(skill.id)}
              className={cn(
                "flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg transition-colors",
                isCompleted
                  ? "bg-emerald-50 dark:bg-emerald-900/10"
                  : "hover:bg-muted",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-md border-2 transition-colors shrink-0",
                  isCompleted
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "border-border",
                )}
              >
                {isCompleted && <Check size={12} />}
              </div>
              <span
                className={cn(
                  "text-sm",
                  isCompleted
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                {skill.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

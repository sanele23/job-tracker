import type { Course, Skill } from "@/types";
import { cn } from "@/lib/utils";
import { ExternalLink, Clock, Star } from "lucide-react";

interface CourseCardProps {
  course: Course;
  skills: Skill[];
  completedSkillIds: string[];
}

export function CourseCard({
  course,
  skills,
  completedSkillIds,
}: CourseCardProps) {
  const difficultyColors: Record<string, string> = {
    beginner:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    intermediate:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {course.title}
            </h3>
            {course.isFree && (
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 shrink-0">
                Free
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{course.provider}</p>
        </div>
        <a
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <ExternalLink size={16} />
        </a>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
        {course.description}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock size={12} /> {course.duration}
        </span>
        <span className="flex items-center gap-1">
          <Star size={12} className="text-amber-500" /> {course.rating}
        </span>
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-medium",
            difficultyColors[course.difficulty],
          )}
        >
          {course.difficulty}
        </span>
      </div>

      {/* Skills taught */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {skills.map((skill) => {
          const isCompleted = completedSkillIds.includes(skill.id);
          return (
            <span
              key={skill.id}
              className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded-md",
                isCompleted
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 line-through opacity-60"
                  : "bg-primary/10 text-primary",
              )}
            >
              {skill.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

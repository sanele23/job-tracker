"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCareerStore } from "@/store/career-store";
import { useProfileStore } from "@/store/profile-store";
import { CAREER_ROLES } from "@/features/career/data";
import { SKILLS } from "@/features/skills/data";
import { COURSES } from "@/features/learning/data";
import { CourseCard } from "@/components/learning/course-card";
import { rankCoursesForUser } from "@/lib/recommendation-engine";
import { motion } from "framer-motion";
import { ArrowRight, Target, Filter, Sparkles } from "lucide-react";
import type { Difficulty } from "@/types";

export default function LearningPage() {
  const targetRoleId = useCareerStore((s) => s.targetRoleId);
  const completedSkillIds = useCareerStore((s) => s.completedSkillIds);
  const profile = useProfileStore((s) => s.profile);
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "all">(
    "all",
  );

  const targetRole = useMemo(
    () => CAREER_ROLES.find((r) => r.id === targetRoleId) ?? null,
    [targetRoleId],
  );

  const missingSkillIds = useMemo(() => {
    if (!targetRole) return [];
    return targetRole.requiredSkills.filter(
      (s) => !completedSkillIds.includes(s),
    );
  }, [targetRole, completedSkillIds]);

  /* ── Personalized course ranking ── */
  const rankedCourses = useMemo(() => {
    if (!targetRole || missingSkillIds.length === 0) return [];
    return rankCoursesForUser(profile, COURSES, missingSkillIds);
  }, [profile, targetRole, missingSkillIds]);

  const filteredCourses = useMemo(() => {
    if (difficultyFilter === "all") return rankedCourses;
    return rankedCourses.filter(
      (sc) => sc.course.difficulty === difficultyFilter,
    );
  }, [rankedCourses, difficultyFilter]);

  /* ── Empty state ── */
  if (!targetRole) {
    return (
      <div className="p-4 lg:p-6 max-w-6xl mx-auto">
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
            <Target size={32} />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            No target role selected
          </h2>
          <p className="text-muted-foreground mb-6">
            Choose a career path first to get personalized course
            recommendations.
          </p>
          <Link
            href="/career"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Choose Career Path <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Learning Path</h1>
        <p className="text-muted-foreground mt-1">
          Courses ranked for{" "}
          <span className="font-semibold text-foreground">
            {profile.name || "you"}
          </span>{" "}
          based on your skills, budget, and schedule.
        </p>
      </div>

      {/* ── Personalization summary ── */}
      <div className="flex flex-wrap gap-2 items-center text-xs">
        <span className="flex items-center gap-1 text-primary font-medium">
          <Sparkles size={12} /> Personalized
        </span>
        <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          {profile.experienceLevel} level
        </span>
        <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          {profile.weeklyLearningHours}h/week
        </span>
        <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          {profile.budgetPreference === "free-only"
            ? "Free only"
            : profile.budgetPreference === "budget-friendly"
              ? "Budget-friendly"
              : "Any price"}
        </span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Filter size={16} className="text-muted-foreground" />
        <div className="flex gap-2">
          {(["all", "beginner", "intermediate", "advanced"] as const).map(
            (level) => (
              <button
                key={level}
                onClick={() => setDifficultyFilter(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  difficultyFilter === level
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {level === "all"
                  ? "All"
                  : level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Course list */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredCourses.map((sc, i) => {
            const teachesSkills = SKILLS.filter((s) =>
              sc.course.skillIds.includes(s.id),
            );
            return (
              <motion.div
                key={sc.course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="relative">
                  <CourseCard
                    course={sc.course}
                    skills={teachesSkills}
                    completedSkillIds={completedSkillIds}
                  />
                  {/* Personalization reasons */}
                  {sc.reasons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5 px-1">
                      {sc.reasons.map((r) => (
                        <span
                          key={r}
                          className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <p className="text-lg font-semibold text-foreground mb-1">
            🎉 All caught up!
          </p>
          <p className="text-sm text-muted-foreground">
            {rankedCourses.length === 0
              ? "You've completed all required skills for this role."
              : "No courses match the current filter."}
          </p>
        </div>
      )}
    </div>
  );
}

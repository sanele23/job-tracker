"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCareerStore } from "@/store/career-store";
import { CAREER_ROLES } from "@/features/career/data";
import { SKILLS } from "@/features/skills/data";
import { SkillChecklist } from "@/components/skills/skill-checklist";
import { ProgressBar } from "@/components/ui/progress-bar";
import { motion } from "framer-motion";
import { ArrowRight, Target } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function SkillsPage() {
  const targetRoleId = useCareerStore((s) => s.targetRoleId);
  const completedSkillIds = useCareerStore((s) => s.completedSkillIds);
  const toggleSkill = useCareerStore((s) => s.toggleSkill);
  const { user } = useAuth();

  const targetRole = useMemo(
    () => CAREER_ROLES.find((r) => r.id === targetRoleId) ?? null,
    [targetRoleId],
  );

  const { groupedSkills, skillProgress } = useMemo(() => {
    if (!targetRole)
      return {
        groupedSkills: {} as Record<string, typeof SKILLS>,
        skillProgress: { completed: 0, total: 0, percentage: 0 },
      };

    const required = SKILLS.filter((s) =>
      targetRole.requiredSkills.includes(s.id),
    );

    const grouped = required.reduce(
      (acc, skill) => {
        const cat = skill.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
      },
      {} as Record<string, typeof required>,
    );

    const completed = required.filter((s) => completedSkillIds.includes(s.id));

    return {
      groupedSkills: grouped,
      skillProgress: {
        completed: completed.length,
        total: required.length,
        percentage:
          required.length === 0
            ? 0
            : Math.round((completed.length / required.length) * 100),
      },
    };
  }, [targetRole, completedSkillIds]);

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
            Choose a career path first to see your skill gap analysis.
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

  const categoryLabels: Record<string, string> = {
    technical: "💻 Technical Skills",
    tool: "🔧 Tools",
    soft: "🤝 Soft Skills",
  };

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Skill Gap Analysis
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your progress for{" "}
          <span className="font-semibold text-foreground">
            {targetRole.title}
          </span>
        </p>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <p className="text-3xl font-bold text-foreground">
              {skillProgress.percentage}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-lg font-semibold text-foreground">
              {skillProgress.completed} / {skillProgress.total}
            </p>
          </div>
        </div>
        <ProgressBar value={skillProgress.percentage} size="lg" />
      </motion.div>

      {/* Skill Groups */}
      {Object.entries(groupedSkills).map(([category, skills], i) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <SkillChecklist
            title={categoryLabels[category] ?? category}
            skills={skills}
            completedIds={completedSkillIds}
            onToggle={(skillId) => toggleSkill(skillId, user?.id)}
          />
        </motion.div>
      ))}
    </div>
  );
}

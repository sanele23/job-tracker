"use client";

import { useMemo } from "react";
import { useCareerStore } from "@/store/career-store";
import { useProfileStore } from "@/store/profile-store";
import { CAREER_ROLES } from "@/features/career/data";
import { SKILLS } from "@/features/skills/data";
import { RoleCard } from "@/components/career/role-card";
import { rankRolesForUser } from "@/lib/recommendation-engine";
import { formatSalary } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle2, Users, TrendingUp, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function CareerPage() {
  const targetRoleId = useCareerStore((s) => s.targetRoleId);
  const setTargetRole = useCareerStore((s) => s.setTargetRole);
  const { user } = useAuth();
  const completedSkillIds = useCareerStore((s) => s.completedSkillIds);
  const profile = useProfileStore((s) => s.profile);

  const selectedRole = useMemo(
    () => CAREER_ROLES.find((r) => r.id === targetRoleId) ?? null,
    [targetRoleId],
  );

  const requiredSkills = useMemo(
    () =>
      selectedRole
        ? SKILLS.filter((s) => selectedRole.requiredSkills.includes(s.id))
        : [],
    [selectedRole],
  );

  /* ── Ranked roles from recommendation engine ── */
  const rankedRoles = useMemo(
    () => rankRolesForUser(profile, CAREER_ROLES, completedSkillIds),
    [profile, completedSkillIds],
  );

  /* ── Split into "recommended" (top 3) and "other" ── */
  const topRoles = rankedRoles.slice(0, 3);
  const otherRoles = rankedRoles.slice(3);

  /* ── Group "other" by category ── */
  const otherByCategory = useMemo(() => {
    const grouped = new Map<string, typeof otherRoles>();
    otherRoles.forEach((sr) => {
      const cat = sr.role.category;
      if (!grouped.has(cat)) grouped.set(cat, []);
      grouped.get(cat)!.push(sr);
    });
    return grouped;
  }, [otherRoles]);

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Career Path</h1>
        <p className="text-muted-foreground mt-1">
          Roles ranked based on your interests, skills, and experience.
        </p>
      </div>

      {/* ── Recommended for You ── */}
      <div>
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-3">
          <Sparkles size={14} className="text-primary" />
          Recommended for you
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topRoles.map((sr) => (
            <div key={sr.role.id} className="relative">
              <RoleCard
                role={sr.role}
                isSelected={sr.role.id === targetRoleId}
                readiness={
                  sr.role.requiredSkills.length === 0
                    ? 0
                    : Math.round(
                        (sr.role.requiredSkills.filter((s) =>
                          completedSkillIds.includes(s),
                        ).length /
                          sr.role.requiredSkills.length) *
                          100,
                      )
                }
                onSelect={() =>
                  setTargetRole(
                    sr.role.id === targetRoleId ? null : sr.role.id,
                    user?.id,
                  )
                }
              />
              {/* Score reasons */}
              {sr.reasons.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5 px-1">
                  {sr.reasons.slice(0, 2).map((r) => (
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
          ))}
        </div>
      </div>

      {/* ── Other Roles by Category ── */}
      {Array.from(otherByCategory.entries()).map(([category, scoredRoles]) => (
        <div key={category}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scoredRoles.map((sr) => (
              <RoleCard
                key={sr.role.id}
                role={sr.role}
                isSelected={sr.role.id === targetRoleId}
                readiness={
                  sr.role.requiredSkills.length === 0
                    ? 0
                    : Math.round(
                        (sr.role.requiredSkills.filter((s) =>
                          completedSkillIds.includes(s),
                        ).length /
                          sr.role.requiredSkills.length) *
                          100,
                      )
                }
                onSelect={() =>
                  setTargetRole(
                    sr.role.id === targetRoleId ? null : sr.role.id,
                    user?.id,
                  )
                }
              />
            ))}
          </div>
        </div>
      ))}

      {/* Selected Role Details */}
      {selectedRole && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <span className="text-3xl">{selectedRole.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {selectedRole.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedRole.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp size={16} className="text-emerald-500" />
              <span className="text-muted-foreground">Salary:</span>
              <span className="font-medium text-foreground">
                {formatSalary(
                  selectedRole.averageSalary.min,
                  selectedRole.averageSalary.max,
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users size={16} className="text-blue-500" />
              <span className="text-muted-foreground">Demand:</span>
              <span
                className={`font-medium capitalize ${
                  selectedRole.demandLevel === "high"
                    ? "text-emerald-500"
                    : selectedRole.demandLevel === "medium"
                      ? "text-amber-500"
                      : "text-red-500"
                }`}
              >
                {selectedRole.demandLevel}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 size={16} className="text-purple-500" />
              <span className="text-muted-foreground">Skills:</span>
              <span className="font-medium text-foreground">
                {requiredSkills.length} required
              </span>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-foreground mb-3">
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {requiredSkills.map((skill) => {
              const isCompleted = completedSkillIds.includes(skill.id);
              return (
                <span
                  key={skill.id}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    isCompleted
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted && "✓ "}
                  {skill.name}
                </span>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

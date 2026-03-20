"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useJobStore } from "@/store/job-store";
import { useCareerStore } from "@/store/career-store";
import { useProfileStore } from "@/store/profile-store";
import { CAREER_ROLES } from "@/features/career/data";
import { SKILLS } from "@/features/skills/data";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  getPersonalizedGreeting,
  getRecommendedActions,
  rankRolesForUser,
} from "@/lib/recommendation-engine";
import { motion } from "framer-motion";
import {
  Briefcase,
  Target,
  TrendingUp,
  Zap,
  ArrowRight,
  BookOpen,
  Sparkles,
  UserCircle,
} from "lucide-react";

export default function DashboardPage() {
  const jobs = useJobStore((s) => s.jobs);
  const targetRoleId = useCareerStore((s) => s.targetRoleId);
  const completedSkillIds = useCareerStore((s) => s.completedSkillIds);
  const profile = useProfileStore((s) => s.profile);

  /* ── personalized greeting ── */
  const greeting = useMemo(() => getPersonalizedGreeting(profile), [profile]);

  /* ── derived state ── */
  const stats = useMemo(
    () => ({
      total: jobs.length,
      interview: jobs.filter((j) => j.status === "interview").length,
      offer: jobs.filter((j) => j.status === "offer").length,
    }),
    [jobs],
  );

  const targetRole = useMemo(
    () => CAREER_ROLES.find((r) => r.id === targetRoleId) ?? null,
    [targetRoleId],
  );

  const { missingSkills, missingSkillIds, skillProgress } = useMemo(() => {
    if (!targetRole)
      return {
        missingSkills: [] as typeof SKILLS,
        missingSkillIds: [] as string[],
        skillProgress: { completed: 0, total: 0, percentage: 0 },
      };
    const required = SKILLS.filter((s) =>
      targetRole.requiredSkills.includes(s.id),
    );
    const completed = required.filter((s) => completedSkillIds.includes(s.id));
    const missing = required.filter((s) => !completedSkillIds.includes(s.id));
    return {
      missingSkills: missing,
      missingSkillIds: missing.map((s) => s.id),
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

  /* ── personalized actions ── */
  const actions = useMemo(
    () =>
      getRecommendedActions(
        profile,
        targetRole,
        completedSkillIds,
        missingSkillIds,
        jobs,
      ),
    [profile, targetRole, completedSkillIds, missingSkillIds, jobs],
  );

  /* ── top recommended role (if no target set yet) ── */
  const topRole = useMemo(() => {
    if (targetRole) return null;
    const ranked = rankRolesForUser(profile, CAREER_ROLES, completedSkillIds);
    return ranked[0] ?? null;
  }, [profile, targetRole, completedSkillIds]);

  const recentJobs = useMemo(
    () =>
      [...jobs]
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        )
        .slice(0, 5),
    [jobs],
  );

  const primaryAction = actions[0];
  const priorityIcon =
    primaryAction?.priority === "high"
      ? Zap
      : primaryAction?.priority === "medium"
        ? Target
        : BookOpen;

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
      {/* ── Personalized Welcome ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground">{greeting.title}</h1>
        <p className="text-muted-foreground mt-1">{greeting.subtitle}</p>
      </motion.div>

      {/* ── Overview Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Applications",
            value: stats.total.toString(),
            sub: `${stats.interview} interviewing`,
            Icon: Briefcase,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Target Role",
            value: targetRole?.title ?? "Not set",
            sub: targetRole ? targetRole.category : "Choose a career path",
            Icon: Target,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            href: targetRole ? undefined : "/career",
          },
          {
            label: "Skills Progress",
            value: `${skillProgress.percentage}%`,
            sub: `${skillProgress.completed}/${skillProgress.total} skills`,
            Icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            href: "/skills",
          },
          {
            label: "Next Action",
            value: primaryAction?.text ?? "All good!",
            sub: primaryAction?.description ?? "Keep up the great work",
            Icon: priorityIcon,
            color:
              primaryAction?.priority === "high"
                ? "text-amber-500"
                : "text-blue-500",
            bg:
              primaryAction?.priority === "high"
                ? "bg-amber-500/10"
                : "bg-blue-500/10",
            href: primaryAction?.href,
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-lg font-bold text-foreground mt-1 truncate">
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {card.sub}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl ${card.bg}`}>
                <card.Icon size={20} className={card.color} />
              </div>
            </div>
            {card.href && (
              <Link
                href={card.href}
                className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Go <ArrowRight size={12} />
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Personalized Recommendation Banner ── */}
      {topRole && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-5"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                Based on your profile, we recommend:
              </p>
              <p className="text-lg font-bold text-primary mt-0.5">
                {topRole.role.icon} {topRole.role.title}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {topRole.reasons.map((r) => (
                  <span
                    key={r}
                    className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                  >
                    {r}
                  </span>
                ))}
              </div>
              <Link
                href="/career"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline mt-3"
              >
                Explore career paths <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Smart Actions ── */}
      {actions.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles size={14} className="text-primary" />
            Recommended for you
          </h3>
          <div className="space-y-2">
            {actions.slice(0, 3).map((action) => (
              <Link
                key={action.text}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    action.priority === "high"
                      ? "bg-amber-500"
                      : action.priority === "medium"
                        ? "bg-blue-500"
                        : "bg-muted-foreground"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {action.text}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                <ArrowRight
                  size={14}
                  className="text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                />
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Two-column section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Snapshot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Skills Snapshot</h3>
            <Link
              href="/skills"
              className="text-xs text-primary font-medium hover:underline"
            >
              View all
            </Link>
          </div>

          {targetRole ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    Overall progress
                  </span>
                  <span className="font-semibold text-foreground">
                    {skillProgress.percentage}%
                  </span>
                </div>
                <ProgressBar value={skillProgress.percentage} />
              </div>

              {missingSkills.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Missing skills:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.slice(0, 5).map((skill) => (
                      <span
                        key={skill.id}
                        className="text-xs px-2 py-1 rounded-md bg-destructive/10 text-destructive font-medium"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {missingSkills.length > 5 && (
                      <span className="text-xs px-2 py-1 text-muted-foreground">
                        +{missingSkills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">
                Select a target role to track your skills
              </p>
              <Link
                href="/career"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Choose Career Path <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </motion.div>

        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">
              Recent Applications
            </h3>
            <Link
              href="/tracker"
              className="text-xs text-primary font-medium hover:underline"
            >
              View all
            </Link>
          </div>

          {recentJobs.length > 0 ? (
            <div className="space-y-1">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {job.company}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {job.role}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor(job.status)}`}
                  >
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">
                No applications yet
              </p>
              <Link
                href="/tracker"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Start tracking <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Quick Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {[
          {
            label: "Track a Job",
            description: "Add a new application",
            href: "/tracker",
            Icon: Briefcase,
            color: "text-blue-500",
          },
          {
            label: "Update Profile",
            description: "Refine your preferences",
            href: "/profile",
            Icon: UserCircle,
            color: "text-purple-500",
          },
          {
            label: "Start Learning",
            description: "Courses picked for you",
            href: "/learning",
            Icon: BookOpen,
            color: "text-emerald-500",
          },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:shadow-md hover:border-primary/30 transition-all group"
          >
            <item.Icon size={20} className={item.color} />
            <div>
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {item.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
            <ArrowRight
              size={16}
              className="ml-auto text-muted-foreground group-hover:text-primary transition-colors"
            />
          </Link>
        ))}
      </motion.div>
    </div>
  );
}

/* ── helpers ── */
function statusColor(status: string): string {
  const map: Record<string, string> = {
    wishlist:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    applied: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    interview:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    offer:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    rejected: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  };
  return map[status] ?? "";
}

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profile-store";
import { useCareerStore } from "@/store/career-store";
import { SKILLS } from "@/features/skills/data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type {
  ExperienceLevel,
  BudgetPreference,
  EducationField,
  UserProfile,
} from "@/types";
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  User,
  Briefcase,
  BookOpen,
  Clock,
  Wallet,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

/* ── Step definitions ────────────────────────────────────── */
const STEPS = [
  { id: "welcome", label: "Welcome" },
  { id: "basics", label: "About You" },
  { id: "experience", label: "Experience" },
  { id: "interests", label: "Interests" },
  { id: "learning", label: "Learning Style" },
  { id: "skills", label: "Current Skills" },
  { id: "done", label: "All Set" },
] as const;

const EXPERIENCE_OPTIONS: {
  value: ExperienceLevel;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "student",
    label: "Student",
    description: "Currently studying or recently graduated",
    icon: "🎓",
  },
  {
    value: "career-changer",
    label: "Career Changer",
    description: "Switching from a different field",
    icon: "🔄",
  },
  {
    value: "junior",
    label: "Junior (0-2 yrs)",
    description: "Starting out in my target field",
    icon: "🌱",
  },
  {
    value: "mid",
    label: "Mid-level (2-5 yrs)",
    description: "Some professional experience",
    icon: "📈",
  },
  {
    value: "senior",
    label: "Senior (5+ yrs)",
    description: "Significant professional experience",
    icon: "🏆",
  },
];

const INTEREST_OPTIONS = [
  { value: "technology", label: "Technology", icon: "💻" },
  { value: "banking-finance", label: "Banking & Finance", icon: "🏦" },
  { value: "business-consulting", label: "Business & Consulting", icon: "💼" },
  { value: "marketing-sales", label: "Marketing & Sales", icon: "📣" },
  { value: "human-resources", label: "Human Resources", icon: "🤝" },
  { value: "healthcare", label: "Healthcare", icon: "🏥" },
  { value: "education", label: "Education", icon: "📚" },
  { value: "public-service", label: "Public Service & NGO", icon: "🏛️" },
  { value: "data-analytics", label: "Data & Analytics", icon: "📊" },
  { value: "design-creative", label: "Design & Creative", icon: "🎨" },
];

const EDUCATION_OPTIONS: { value: EducationField; label: string }[] = [
  { value: "computer-science", label: "Computer Science / IT" },
  { value: "engineering", label: "Engineering" },
  { value: "business", label: "Business / Commerce" },
  { value: "economics", label: "Economics" },
  { value: "finance-accounting", label: "Finance / Accounting" },
  { value: "marketing-communications", label: "Marketing / Communications" },
  { value: "law", label: "Law / Legal Studies" },
  { value: "health-sciences", label: "Health Sciences / Medicine" },
  { value: "education", label: "Education / Teaching" },
  { value: "arts-humanities", label: "Arts / Humanities" },
  { value: "social-sciences", label: "Social Sciences" },
  { value: "natural-sciences", label: "Natural Sciences" },
  { value: "mathematics-statistics", label: "Mathematics / Statistics" },
  { value: "public-admin", label: "Public Administration" },
  { value: "agriculture", label: "Agriculture" },
  { value: "other", label: "Other" },
  { value: "none", label: "No formal qualification" },
];

const BUDGET_OPTIONS: {
  value: BudgetPreference;
  label: string;
  description: string;
}[] = [
  {
    value: "free-only",
    label: "Free only",
    description: "Only show free resources",
  },
  {
    value: "budget-friendly",
    label: "Budget friendly",
    description: "Prefer free, but open to affordable paid options",
  },
  {
    value: "no-limit",
    label: "No limit",
    description: "Show me the best regardless of cost",
  },
];

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors";

// Extend the Window interface to include __profileStore
declare global {
  interface Window {
    __profileStore?: {
      loadFromSupabase: (userId: string) => void;
    };
  }
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding);
  const setTargetRole = useCareerStore((s) => s.setTargetRole);
  const toggleSkill = useCareerStore((s) => s.toggleSkill);
  const completedSkillIds = useCareerStore((s) => s.completedSkillIds);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Partial<UserProfile>>({
    name: "",
    experienceLevel: "student",
    currentRole: "",
    educationField: "none",
    interests: [],
    weeklyLearningHours: 5,
    budgetPreference: "free-only",
  });

  const update = useCallback(
    (updates: Partial<UserProfile>) =>
      setForm((prev) => ({ ...prev, ...updates })),
    [],
  );

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const canAdvance = (): boolean => {
    switch (STEPS[step].id) {
      case "basics":
        return (form.name?.trim().length ?? 0) > 0;
      case "experience":
        return !!form.experienceLevel;
      case "interests":
        return (form.interests?.length ?? 0) > 0;
      case "learning":
        return !!form.budgetPreference;
      default:
        return true;
    }
  };

  const finish = () => {
    // Save profile and mark onboarding complete, then reload profile from Supabase to ensure state is synced
    updateProfile(form as UserProfile, user?.id);
    completeOnboarding(user?.id);

    // Auto-set a target role based on first interest
    if (form.interests && form.interests.length > 0) {
      const interestMap: Record<string, string> = {
        technology: "frontend-dev",
        "banking-finance": "investment-analyst",
        "business-consulting": "management-consultant",
        "marketing-sales": "digital-marketer",
        "human-resources": "hr-generalist",
        healthcare: "healthcare-admin",
        education: "curriculum-developer",
        "public-service": "policy-analyst",
        "data-analytics": "data-analyst",
        "design-creative": "ux-designer",
      };
      const defaultRole = interestMap[form.interests[0]];
      if (defaultRole) setTargetRole(defaultRole, user?.id);
    }

    // Reload profile from Supabase to ensure onboarding state is up-to-date
    if (user?.id) {
      setTimeout(() => {
        // Delay to allow upsert to complete
        if (typeof window !== "undefined" && window.__profileStore) {
          window.__profileStore.loadFromSupabase(user.id);
        }
      }, 500);
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                i <= step ? "bg-primary" : "bg-muted",
              )}
            />
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── Step 0: Welcome ── */}
            {STEPS[step].id === "welcome" && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-primary to-blue-600 text-primary-foreground mb-6 shadow-lg btn-primary-glow">
                  <GraduationCap size={36} />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Welcome to Cebisa
                </h1>
                <p className="text-muted-foreground mb-2">
                  Your personal career development companion.
                </p>
                <p className="text-sm text-muted-foreground">
                  Let&apos;s take a minute to understand you — so every
                  recommendation is tailored to <em>your</em> goals.
                </p>
              </div>
            )}

            {/* ── Step 1: Basics ── */}
            {STEPS[step].id === "basics" && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <User size={20} className="text-primary" />
                  <h2 className="text-xl font-bold text-foreground">
                    About You
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    What should we call you?
                  </label>
                  <input
                    type="text"
                    value={form.name ?? ""}
                    onChange={(e) => update({ name: e.target.value })}
                    placeholder="Your name"
                    className={inputClass}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Current role or situation
                  </label>
                  <input
                    type="text"
                    value={form.currentRole ?? ""}
                    onChange={(e) => update({ currentRole: e.target.value })}
                    placeholder="e.g. CS Student, Marketing Manager, Self-taught developer"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Education background
                  </label>
                  <select
                    value={form.educationField ?? "none"}
                    onChange={(e) =>
                      update({
                        educationField: e.target.value as EducationField,
                      })
                    }
                    className={inputClass}
                  >
                    {EDUCATION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* ── Step 2: Experience ── */}
            {STEPS[step].id === "experience" && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <Briefcase size={20} className="text-primary" />
                  <h2 className="text-xl font-bold text-foreground">
                    Experience Level
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  This helps us recommend the right difficulty of courses and
                  realistic career targets.
                </p>
                <div className="space-y-2">
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => update({ experienceLevel: opt.value })}
                      className={cn(
                        "w-full text-left p-3.5 rounded-xl border transition-all",
                        form.experienceLevel === opt.value
                          ? "bg-primary/5 border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/30",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{opt.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {opt.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {opt.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 3: Interests ── */}
            {STEPS[step].id === "interests" && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <Sparkles size={20} className="text-primary" />
                  <h2 className="text-xl font-bold text-foreground">
                    What interests you?
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Pick one or more. This shapes which career paths we highlight.
                </p>
                <div className="grid grid-cols-2 gap-2 max-h-95 overflow-y-auto pr-1">
                  {INTEREST_OPTIONS.map((opt) => {
                    const selected =
                      form.interests?.includes(opt.value) ?? false;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          const current = form.interests ?? [];
                          update({
                            interests: selected
                              ? current.filter((i) => i !== opt.value)
                              : [...current, opt.value],
                          });
                        }}
                        className={cn(
                          "p-4 rounded-xl border transition-all text-center",
                          selected
                            ? "bg-primary/5 border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-primary/30",
                        )}
                      >
                        <span className="text-3xl block mb-2">{opt.icon}</span>
                        <p className="text-sm font-semibold text-foreground">
                          {opt.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Step 4: Learning Style ── */}
            {STEPS[step].id === "learning" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen size={20} className="text-primary" />
                  <h2 className="text-xl font-bold text-foreground">
                    Learning Preferences
                  </h2>
                </div>

                {/* Weekly hours */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <label className="text-sm font-medium text-foreground">
                      Hours per week for learning
                    </label>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={30}
                      step={1}
                      value={form.weeklyLearningHours ?? 5}
                      onChange={(e) =>
                        update({
                          weeklyLearningHours: Number(e.target.value),
                        })
                      }
                      className="flex-1 accent-primary"
                    />
                    <span className="text-lg font-bold text-foreground w-12 text-center">
                      {form.weeklyLearningHours ?? 5}h
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    We&apos;ll prioritize courses that fit your schedule.
                  </p>
                </div>

                {/* Budget */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet size={16} className="text-muted-foreground" />
                    <label className="text-sm font-medium text-foreground">
                      Course budget
                    </label>
                  </div>
                  <div className="space-y-2">
                    {BUDGET_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => update({ budgetPreference: opt.value })}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border transition-all",
                          form.budgetPreference === opt.value
                            ? "bg-primary/5 border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-primary/30",
                        )}
                      >
                        <p className="text-sm font-semibold text-foreground">
                          {opt.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {opt.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 5: Current Skills ── */}
            {STEPS[step].id === "skills" && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <CheckCircle2 size={20} className="text-primary" />
                  <h2 className="text-xl font-bold text-foreground">
                    Skills you already have
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Check off what you&apos;re comfortable with. Be honest — it
                  helps us find the right gaps.
                </p>
                <div className="max-h-95 overflow-y-auto space-y-1 pr-1">
                  {SKILLS.map((skill) => {
                    const checked = completedSkillIds.includes(skill.id);
                    return (
                      <button
                        key={skill.id}
                        onClick={() => toggleSkill(skill.id, user?.id)}
                        className={cn(
                          "flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg transition-colors",
                          checked
                            ? "bg-emerald-50 dark:bg-emerald-900/10"
                            : "hover:bg-muted",
                        )}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-5 h-5 rounded-md border-2 transition-colors shrink-0",
                            checked
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "border-border",
                          )}
                        >
                          {checked && <CheckCircle2 size={12} />}
                        </div>
                        <span
                          className={cn(
                            "text-sm",
                            checked
                              ? "text-foreground font-medium"
                              : "text-muted-foreground",
                          )}
                        >
                          {skill.name}
                        </span>
                        <span className="ml-auto text-[10px] uppercase text-muted-foreground tracking-wider">
                          {skill.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Step 6: Done ── */}
            {STEPS[step].id === "done" && (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 mb-6">
                  <Sparkles size={32} />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  You&apos;re all set, {form.name || "friend"}!
                </h1>
                <p className="text-muted-foreground mb-2">
                  Every recommendation — roles, courses, and actions — is now
                  tailored to you.
                </p>
                <div className="mt-6 bg-card border border-border rounded-xl p-4 text-left space-y-2">
                  <ProfileRow
                    label="Experience"
                    value={form.experienceLevel ?? ""}
                  />
                  <ProfileRow
                    label="Interests"
                    value={form.interests?.join(", ") ?? ""}
                  />
                  <ProfileRow
                    label="Weekly hours"
                    value={`${form.weeklyLearningHours ?? 5}h/week`}
                  />
                  <ProfileRow
                    label="Budget"
                    value={form.budgetPreference ?? ""}
                  />
                  <ProfileRow
                    label="Skills"
                    value={`${completedSkillIds.length} checked`}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {step > 0 ? (
            <button
              onClick={back}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}

          {STEPS[step].id === "done" ? (
            <button
              onClick={finish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-primary to-blue-600 text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all btn-primary-glow"
            >
              Go to Dashboard <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={next}
              disabled={!canAdvance()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-primary to-blue-600 text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-all btn-primary-glow"
            >
              {step === 0 ? "Let's go" : "Continue"} <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground capitalize">{value}</span>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useProfileStore } from "@/store/profile-store";
import { useCareerStore } from "@/store/career-store";
import { SKILLS } from "@/features/skills/data";
import { motion } from "framer-motion";
import {
  UserCircle,
  BookOpen,
  Clock,
  Wallet,
  Target,
  Save,
  CheckCircle,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type {
  ExperienceLevel,
  BudgetPreference,
  EducationField,
} from "@/types";

const EXPERIENCE_OPTIONS: {
  value: ExperienceLevel;
  label: string;
  emoji: string;
}[] = [
  { value: "student", label: "Student", emoji: "🎓" },
  { value: "career-changer", label: "Career Changer", emoji: "🔄" },
  { value: "junior", label: "Junior (0-2 yrs)", emoji: "🌱" },
  { value: "mid", label: "Mid-level (3-5 yrs)", emoji: "📈" },
  { value: "senior", label: "Senior (6+ yrs)", emoji: "🚀" },
];

const BUDGET_OPTIONS: { value: BudgetPreference; label: string }[] = [
  { value: "free-only", label: "Free courses only" },
  { value: "budget-friendly", label: "Budget-friendly (under $50)" },
  { value: "no-limit", label: "Willing to invest" },
];

const INTEREST_OPTIONS = [
  { value: "technology", label: "Technology", emoji: "💻" },
  { value: "banking-finance", label: "Banking & Finance", emoji: "🏦" },
  { value: "business-consulting", label: "Business & Consulting", emoji: "💼" },
  { value: "marketing-sales", label: "Marketing & Sales", emoji: "📣" },
  { value: "human-resources", label: "Human Resources", emoji: "🤝" },
  { value: "healthcare", label: "Healthcare", emoji: "🏥" },
  { value: "education", label: "Education", emoji: "📚" },
  { value: "public-service", label: "Public Service & NGO", emoji: "🏛️" },
  { value: "data-analytics", label: "Data & Analytics", emoji: "📊" },
  { value: "design-creative", label: "Design & Creative", emoji: "🎨" },
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

export default function ProfilePage() {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const completedSkillIds = useCareerStore((s) => s.completedSkillIds);
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  /* ── local form state ── */
  const [name, setName] = useState(profile.name);
  const [currentRole, setCurrentRole] = useState(profile.currentRole);
  const [education, setEducation] = useState<EducationField>(
    profile.educationField,
  );
  const [experience, setExperience] = useState<ExperienceLevel>(
    profile.experienceLevel,
  );
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [hours, setHours] = useState(profile.weeklyLearningHours);
  const [budget, setBudget] = useState<BudgetPreference>(
    profile.budgetPreference,
  );

  const toggleInterest = (value: string) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value],
    );
  };

  const handleSave = () => {
    updateProfile(
      {
        name,
        currentRole,
        educationField: education,
        experienceLevel: experience,
        interests,
        weeklyLearningHours: hours,
        budgetPreference: budget,
      },
      user?.id,
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const completedSkills = SKILLS.filter((s) =>
    completedSkillIds.includes(s.id),
  );

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Your Profile</h1>
        <p className="text-muted-foreground mt-1">
          Update your info to keep recommendations relevant.
        </p>
      </motion.div>

      {/* ── About You ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-5 space-y-4"
      >
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <UserCircle size={18} className="text-primary" /> About You
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Current Role
            </label>
            <input
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g. Student, Junior Developer"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            <GraduationCap size={12} className="inline mr-1" />
            Education Background
          </label>
          <select
            value={education}
            onChange={(e) => setEducation(e.target.value as EducationField)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {EDUCATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* ── Experience Level ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-xl p-5 space-y-3"
      >
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Target size={18} className="text-purple-500" /> Experience Level
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {EXPERIENCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setExperience(opt.value)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                experience === opt.value
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Interests ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-5 space-y-3"
      >
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <BookOpen size={18} className="text-emerald-500" /> Interests
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {INTEREST_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleInterest(opt.value)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                interests.includes(opt.value)
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Learning Preferences ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-card border border-border rounded-xl p-5 space-y-4"
      >
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Clock size={18} className="text-amber-500" /> Learning Preferences
        </h2>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Weekly learning hours:{" "}
            <strong className="text-foreground">{hours}h</strong>
          </label>
          <input
            type="range"
            min={1}
            max={40}
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value, 10))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>1h</span>
            <span>10h</span>
            <span>20h</span>
            <span>40h</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            <Wallet size={12} className="inline mr-1" /> Budget
          </label>
          <div className="flex flex-wrap gap-2">
            {BUDGET_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setBudget(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  budget === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Skills Summary ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-xl p-5 space-y-3"
      >
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <CheckCircle size={18} className="text-emerald-500" /> Your Skills (
          {completedSkills.length})
        </h2>
        {completedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {completedSkills.map((skill) => (
              <span
                key={skill.id}
                className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              >
                ✓ {skill.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No skills marked yet. Head to the Skills page to update.
          </p>
        )}
      </motion.div>

      {/* ── Save Button ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-linear-to-r from-primary to-blue-600 text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all btn-primary-glow flex items-center justify-center gap-2"
        >
          {saved ? (
            <>
              <CheckCircle size={16} /> Saved!
            </>
          ) : (
            <>
              <Save size={16} /> Save Changes
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}

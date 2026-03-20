export type JobStatus =
  | "wishlist"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

export interface Job {
  id: string;
  user_id?: string;
  company: string;
  role: string;
  salary_min?: number | null;
  salary_max?: number | null;
  status: JobStatus;
  date_applied?: string | null;
  notes?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  url?: string | null;
  tags: string[];
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ColumnDef {
  id: JobStatus;
  title: string;
  color: string;
  icon: string;
}

/* ── Career Types ────────────────────────────────────────── */

export type SkillCategory = "technical" | "soft" | "tool";
export type DemandLevel = "high" | "medium" | "low";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface CareerRole {
  id: string;
  title: string;
  category: string;
  description: string;
  requiredSkills: string[];
  averageSalary: { min: number; max: number };
  demandLevel: DemandLevel;
  icon: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  difficulty: Difficulty;
  duration: string;
  url: string;
  skillIds: string[];
  description: string;
  rating: number;
  isFree: boolean;
}

/* ── User Profile Types ──────────────────────────────────── */

export type ExperienceLevel =
  | "student"
  | "career-changer"
  | "junior"
  | "mid"
  | "senior";

export type BudgetPreference = "free-only" | "budget-friendly" | "no-limit";

export type EducationField =
  | "computer-science"
  | "engineering"
  | "business"
  | "economics"
  | "finance-accounting"
  | "marketing-communications"
  | "law"
  | "health-sciences"
  | "education"
  | "arts-humanities"
  | "social-sciences"
  | "natural-sciences"
  | "mathematics-statistics"
  | "public-admin"
  | "agriculture"
  | "other"
  | "none";

export interface UserProfile {
  name: string;
  experienceLevel: ExperienceLevel;
  currentRole: string;
  educationField: EducationField;
  interests: string[];
  weeklyLearningHours: number;
  budgetPreference: BudgetPreference;
  hasCompletedOnboarding: boolean;
}

/* ── Recommendation Types ────────────────────────────────── */

export interface ScoredRole {
  role: CareerRole;
  score: number;
  reasons: string[];
}

export interface ScoredCourse {
  course: Course;
  score: number;
  reasons: string[];
}

export interface RecommendedAction {
  text: string;
  description: string;
  href: string;
  priority: "high" | "medium" | "low";
}

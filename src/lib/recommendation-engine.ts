/**
 * Recommendation Engine
 *
 * Pure functions that take user profile + data → ranked, personalized results.
 * No side effects. No store dependencies. Easy to test.
 */

import type {
  UserProfile,
  CareerRole,
  Course,
  ScoredRole,
  ScoredCourse,
  RecommendedAction,
  Job,
  Difficulty,
  EducationField,
} from "@/types";

/* ══════════════════════════════════════════════════════════
   1. ROLE RANKING
   ══════════════════════════════════════════════════════════ */

/** Maps user interests to role categories */
const INTEREST_TO_CATEGORY: Record<string, string[]> = {
  technology: ["Technology"],
  "banking-finance": ["Banking & Finance"],
  "business-consulting": ["Business & Consulting"],
  "marketing-sales": ["Marketing & Sales"],
  "human-resources": ["Human Resources"],
  healthcare: ["Healthcare"],
  education: ["Education"],
  "public-service": ["Public Service & NGO"],
  "data-analytics": ["Technology", "Banking & Finance"], // cross-cutting
  "design-creative": ["Technology", "Marketing & Sales"], // cross-cutting
};

/** Maps education field to role categories it naturally aligns with */
const EDUCATION_TO_CATEGORIES: Record<string, string[]> = {
  "computer-science": ["Technology"],
  engineering: ["Technology"],
  business: ["Business & Consulting", "Marketing & Sales"],
  economics: ["Banking & Finance", "Business & Consulting"],
  "finance-accounting": ["Banking & Finance", "Business & Consulting"],
  "marketing-communications": ["Marketing & Sales"],
  law: ["Public Service & NGO", "Human Resources"],
  "health-sciences": ["Healthcare"],
  education: ["Education"],
  "arts-humanities": ["Marketing & Sales", "Education"],
  "social-sciences": ["Public Service & NGO", "Human Resources"],
  "natural-sciences": ["Healthcare", "Technology"],
  "mathematics-statistics": ["Technology", "Banking & Finance"],
  "public-admin": ["Public Service & NGO"],
  agriculture: ["Public Service & NGO"],
} satisfies Partial<Record<EducationField, string[]>>;

/** Maps experience level to recommended role difficulty/salary tiers */
const EXPERIENCE_SALARY_CEILING: Record<string, number> = {
  student: 100000,
  "career-changer": 120000,
  junior: 130000,
  mid: 170000,
  senior: 999999,
};

export function rankRolesForUser(
  profile: UserProfile,
  roles: CareerRole[],
  completedSkillIds: string[],
): ScoredRole[] {
  return roles
    .map((role) => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Interest alignment (0-35 pts)
      const matchedCategories = profile.interests.flatMap(
        (i) => INTEREST_TO_CATEGORY[i] ?? [],
      );
      if (matchedCategories.includes(role.category)) {
        score += 35;
        reasons.push("Matches your interests");
      }

      // 2. Education alignment (0-20 pts)
      const eduCategories =
        EDUCATION_TO_CATEGORIES[profile.educationField] ?? [];
      if (eduCategories.includes(role.category)) {
        score += 20;
        reasons.push("Aligns with your education");
      }

      // 3. Skill readiness (0-25 pts) — more skills = higher fit
      const readiness =
        role.requiredSkills.length === 0
          ? 0
          : role.requiredSkills.filter((s) => completedSkillIds.includes(s))
              .length / role.requiredSkills.length;
      const readinessScore = Math.round(readiness * 25);
      score += readinessScore;
      if (readiness >= 0.5) {
        reasons.push(`${Math.round(readiness * 100)}% skills ready`);
      }

      // 4. Salary realism for experience level (0-10 pts)
      const ceiling =
        EXPERIENCE_SALARY_CEILING[profile.experienceLevel] ?? 150000;
      if (role.averageSalary.min <= ceiling) {
        score += 10;
        reasons.push("Salary matches your experience");
      }

      // 5. Market demand bonus (0-10 pts)
      if (role.demandLevel === "high") {
        score += 10;
        reasons.push("High market demand");
      } else if (role.demandLevel === "medium") {
        score += 5;
      }

      return { role, score, reasons };
    })
    .sort((a, b) => b.score - a.score);
}

/* ══════════════════════════════════════════════════════════
   2. COURSE RANKING
   ══════════════════════════════════════════════════════════ */

/** Map experience level to ideal starting difficulty */
const EXPERIENCE_TO_DIFFICULTY: Record<string, Difficulty> = {
  student: "beginner",
  "career-changer": "beginner",
  junior: "intermediate",
  mid: "intermediate",
  senior: "advanced",
};

/** Parse rough hour values from duration strings like "52 hours" or "100+ hours" */
function parseHours(duration: string): number {
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 10;
}

export function rankCoursesForUser(
  profile: UserProfile,
  courses: Course[],
  missingSkillIds: string[],
): ScoredCourse[] {
  const idealDifficulty =
    EXPERIENCE_TO_DIFFICULTY[profile.experienceLevel] ?? "beginner";

  return courses
    .filter((c) => c.skillIds.some((sid) => missingSkillIds.includes(sid)))
    .map((course) => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Skill relevance (0-35 pts) — how many missing skills does it teach?
      const relevantSkills = course.skillIds.filter((s) =>
        missingSkillIds.includes(s),
      ).length;
      const relevanceScore = Math.min(35, relevantSkills * 12);
      score += relevanceScore;
      if (relevantSkills >= 2) {
        reasons.push(`Covers ${relevantSkills} missing skills`);
      }

      // 2. Difficulty match (0-25 pts)
      if (course.difficulty === idealDifficulty) {
        score += 25;
        reasons.push("Right difficulty for your level");
      } else if (
        (idealDifficulty === "beginner" &&
          course.difficulty === "intermediate") ||
        (idealDifficulty === "intermediate" &&
          course.difficulty === "advanced") ||
        (idealDifficulty === "intermediate" && course.difficulty === "beginner")
      ) {
        score += 12; // one level off
      }

      // 3. Budget match (0-20 pts)
      if (profile.budgetPreference === "free-only") {
        if (course.isFree) {
          score += 20;
          reasons.push("Free course");
        } else {
          score -= 15; // penalty for paid when user wants free
        }
      } else if (profile.budgetPreference === "budget-friendly") {
        if (course.isFree) {
          score += 15;
          reasons.push("Free course");
        } else {
          score += 5;
        }
      } else {
        score += 10; // no budget constraint
      }

      // 4. Time fit (0-10 pts) — does duration fit weekly hours?
      const hours = parseHours(course.duration);
      const weeksToComplete = Math.ceil(
        hours / Math.max(1, profile.weeklyLearningHours),
      );
      if (weeksToComplete <= 4) {
        score += 10;
        reasons.push("Fits your schedule");
      } else if (weeksToComplete <= 8) {
        score += 5;
      }

      // 5. Quality bonus (0-10 pts)
      const qualityScore = Math.round(((course.rating - 4.0) / 1.0) * 10);
      score += Math.max(0, Math.min(10, qualityScore));
      if (course.rating >= 4.7) {
        reasons.push("Highly rated");
      }

      return { course, score, reasons };
    })
    .sort((a, b) => b.score - a.score);
}

/* ══════════════════════════════════════════════════════════
   3. SMART NEXT ACTION
   ══════════════════════════════════════════════════════════ */

export function getRecommendedActions(
  profile: UserProfile,
  targetRole: CareerRole | null,
  completedSkillIds: string[],
  missingSkillIds: string[],
  jobs: Job[],
): RecommendedAction[] {
  const actions: RecommendedAction[] = [];

  // No profile → onboarding
  if (!profile.hasCompletedOnboarding) {
    actions.push({
      text: "Complete your profile",
      description: "Tell us about yourself to get personalized recommendations",
      href: "/onboarding",
      priority: "high",
    });
    return actions;
  }

  // No target role → career path
  if (!targetRole) {
    actions.push({
      text: "Choose your career path",
      description: "Select a target role to unlock personalized guidance",
      href: "/career",
      priority: "high",
    });
    return actions;
  }

  // High priority: big skill gaps
  const readiness =
    targetRole.requiredSkills.length === 0
      ? 100
      : Math.round(
          (completedSkillIds.filter((s) =>
            targetRole.requiredSkills.includes(s),
          ).length /
            targetRole.requiredSkills.length) *
            100,
        );

  if (readiness < 40) {
    actions.push({
      text: `Build foundational skills`,
      description: `You're at ${readiness}% readiness — start with the basics`,
      href: "/learning",
      priority: "high",
    });
  } else if (readiness < 70) {
    actions.push({
      text: `Close your skill gaps`,
      description: `${missingSkillIds.length} skills remaining for ${targetRole.title}`,
      href: "/learning",
      priority: "medium",
    });
  }

  // Medium: start applying
  if (readiness >= 50 && jobs.length < 5) {
    actions.push({
      text: "Start applying",
      description: `You're ${readiness}% ready — start building momentum`,
      href: "/tracker",
      priority: readiness >= 70 ? "high" : "medium",
    });
  }

  // Low: update skills
  if (completedSkillIds.length > 0 && readiness < 100) {
    actions.push({
      text: "Review your skills",
      description: "Update your skill progress to keep recommendations fresh",
      href: "/skills",
      priority: "low",
    });
  }

  // If everything is great
  if (readiness >= 80 && jobs.length >= 5) {
    actions.push({
      text: "Keep the momentum",
      description: `You're ${readiness}% ready with ${jobs.length} applications`,
      href: "/tracker",
      priority: "low",
    });
  }

  return actions;
}

/* ══════════════════════════════════════════════════════════
   4. PERSONALIZED GREETING
   ══════════════════════════════════════════════════════════ */

export function getPersonalizedGreeting(profile: UserProfile): {
  title: string;
  subtitle: string;
} {
  const name = profile.name || "there";
  const hour = new Date().getHours();

  let timeGreeting: string;
  if (hour < 12) timeGreeting = "Good morning";
  else if (hour < 17) timeGreeting = "Good afternoon";
  else timeGreeting = "Good evening";

  const subtitles: Record<string, string> = {
    student: "Let's build your career from the ground up.",
    "career-changer": "Making a bold move — let's make it count.",
    junior: "Growing fast — let's level up your skills.",
    mid: "Ready to take the next step in your career.",
    senior: "Targeting your next leadership opportunity.",
  };

  return {
    title: `${timeGreeting}, ${name} 👋`,
    subtitle:
      subtitles[profile.experienceLevel] ??
      "Your personalized career companion.",
  };
}

import type { CareerRole } from "@/types";

export const CAREER_ROLES: CareerRole[] = [
  /* ══════════════════════════════════════════════════════
     TECHNOLOGY
     ══════════════════════════════════════════════════════ */
  {
    id: "frontend-dev",
    title: "Frontend Developer",
    category: "Technology",
    description:
      "Build user interfaces and web applications using modern frameworks.",
    requiredSkills: [
      "html",
      "css",
      "javascript",
      "typescript",
      "react",
      "git",
      "responsive-design",
      "testing",
    ],
    averageSalary: { min: 70000, max: 150000 },
    demandLevel: "high",
    icon: "🖥️",
  },
  {
    id: "backend-dev",
    title: "Backend Developer",
    category: "Technology",
    description:
      "Design and build server-side logic, APIs, and database systems.",
    requiredSkills: [
      "javascript",
      "typescript",
      "nodejs",
      "sql",
      "rest-apis",
      "git",
      "docker",
      "testing",
    ],
    averageSalary: { min: 80000, max: 160000 },
    demandLevel: "high",
    icon: "⚙️",
  },
  {
    id: "fullstack-dev",
    title: "Full Stack Developer",
    category: "Technology",
    description:
      "Work across the entire stack, from frontend UI to backend services.",
    requiredSkills: [
      "html",
      "css",
      "javascript",
      "typescript",
      "react",
      "nodejs",
      "sql",
      "git",
      "rest-apis",
      "docker",
    ],
    averageSalary: { min: 85000, max: 170000 },
    demandLevel: "high",
    icon: "🔄",
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    category: "Technology",
    description:
      "Analyze data to drive business decisions using statistical methods and tools.",
    requiredSkills: [
      "python",
      "sql",
      "excel",
      "data-visualization",
      "statistics",
      "critical-thinking",
    ],
    averageSalary: { min: 60000, max: 120000 },
    demandLevel: "high",
    icon: "📊",
  },
  {
    id: "ux-designer",
    title: "UX Designer",
    category: "Technology",
    description:
      "Design intuitive user experiences through research, prototyping, and testing.",
    requiredSkills: [
      "figma",
      "user-research",
      "wireframing",
      "prototyping",
      "design-thinking",
      "communication",
    ],
    averageSalary: { min: 65000, max: 130000 },
    demandLevel: "medium",
    icon: "🎨",
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    category: "Technology",
    description:
      "Build and manage CI/CD pipelines, infrastructure, and deployment processes.",
    requiredSkills: [
      "linux",
      "docker",
      "kubernetes",
      "ci-cd",
      "cloud-aws",
      "git",
      "scripting",
      "monitoring",
    ],
    averageSalary: { min: 90000, max: 170000 },
    demandLevel: "high",
    icon: "🚀",
  },

  /* ══════════════════════════════════════════════════════
     BANKING & FINANCE
     ══════════════════════════════════════════════════════ */
  {
    id: "investment-analyst",
    title: "Investment Analyst",
    category: "Banking & Finance",
    description:
      "Evaluate investment opportunities, build financial models, and advise on asset allocation.",
    requiredSkills: [
      "financial-modelling",
      "excel",
      "accounting",
      "economics",
      "critical-thinking",
      "report-writing",
    ],
    averageSalary: { min: 65000, max: 140000 },
    demandLevel: "high",
    icon: "📈",
  },
  {
    id: "risk-analyst",
    title: "Risk Analyst",
    category: "Banking & Finance",
    description:
      "Identify, assess, and mitigate financial and operational risks for institutions.",
    requiredSkills: [
      "risk-management",
      "statistics",
      "excel",
      "regulatory-compliance",
      "report-writing",
      "critical-thinking",
    ],
    averageSalary: { min: 60000, max: 130000 },
    demandLevel: "high",
    icon: "🛡️",
  },
  {
    id: "relationship-manager",
    title: "Relationship Manager",
    category: "Banking & Finance",
    description:
      "Manage client portfolios, provide financial advice, and grow banking relationships.",
    requiredSkills: [
      "client-management",
      "sales-negotiation",
      "financial-literacy",
      "communication",
      "presentation",
      "crm-tools",
    ],
    averageSalary: { min: 55000, max: 120000 },
    demandLevel: "medium",
    icon: "🤝",
  },
  {
    id: "accountant",
    title: "Accountant",
    category: "Banking & Finance",
    description:
      "Manage financial records, prepare statements, and ensure regulatory compliance.",
    requiredSkills: [
      "accounting",
      "excel",
      "financial-literacy",
      "regulatory-compliance",
      "attention-to-detail",
      "report-writing",
    ],
    averageSalary: { min: 50000, max: 110000 },
    demandLevel: "high",
    icon: "🧮",
  },

  /* ══════════════════════════════════════════════════════
     BUSINESS & CONSULTING
     ══════════════════════════════════════════════════════ */
  {
    id: "management-consultant",
    title: "Management Consultant",
    category: "Business & Consulting",
    description:
      "Solve complex business problems through analysis, strategy, and stakeholder management.",
    requiredSkills: [
      "business-strategy",
      "data-analysis",
      "presentation",
      "communication",
      "project-management",
      "excel",
    ],
    averageSalary: { min: 75000, max: 160000 },
    demandLevel: "high",
    icon: "💼",
  },
  {
    id: "business-analyst",
    title: "Business Analyst",
    category: "Business & Consulting",
    description:
      "Bridge the gap between business needs and technical solutions through requirements analysis.",
    requiredSkills: [
      "business-strategy",
      "data-analysis",
      "sql",
      "communication",
      "project-management",
      "agile",
    ],
    averageSalary: { min: 65000, max: 130000 },
    demandLevel: "high",
    icon: "🔍",
  },
  {
    id: "product-manager",
    title: "Product Manager",
    category: "Business & Consulting",
    description:
      "Define product strategy, roadmap, and work with cross-functional teams.",
    requiredSkills: [
      "product-strategy",
      "user-research",
      "data-analysis",
      "communication",
      "agile",
      "critical-thinking",
    ],
    averageSalary: { min: 90000, max: 180000 },
    demandLevel: "high",
    icon: "📋",
  },
  {
    id: "project-manager",
    title: "Project Manager",
    category: "Business & Consulting",
    description:
      "Plan, execute, and close projects on time and budget across any industry.",
    requiredSkills: [
      "project-management",
      "agile",
      "communication",
      "leadership",
      "risk-management",
      "presentation",
    ],
    averageSalary: { min: 70000, max: 140000 },
    demandLevel: "high",
    icon: "📌",
  },

  /* ══════════════════════════════════════════════════════
     MARKETING & SALES
     ══════════════════════════════════════════════════════ */
  {
    id: "digital-marketer",
    title: "Digital Marketer",
    category: "Marketing & Sales",
    description:
      "Plan and execute digital campaigns across social media, search, and email.",
    requiredSkills: [
      "digital-marketing",
      "social-media",
      "seo-sem",
      "copywriting",
      "data-analysis",
      "crm-tools",
    ],
    averageSalary: { min: 50000, max: 110000 },
    demandLevel: "high",
    icon: "📣",
  },
  {
    id: "brand-manager",
    title: "Brand Manager",
    category: "Marketing & Sales",
    description:
      "Develop brand strategy, positioning, and ensure consistent brand identity.",
    requiredSkills: [
      "marketing-strategy",
      "communication",
      "market-research",
      "presentation",
      "copywriting",
      "project-management",
    ],
    averageSalary: { min: 65000, max: 130000 },
    demandLevel: "medium",
    icon: "🏷️",
  },
  {
    id: "sales-executive",
    title: "Sales Executive",
    category: "Marketing & Sales",
    description:
      "Drive revenue by identifying prospects, building relationships, and closing deals.",
    requiredSkills: [
      "sales-negotiation",
      "client-management",
      "crm-tools",
      "communication",
      "presentation",
      "market-research",
    ],
    averageSalary: { min: 50000, max: 130000 },
    demandLevel: "high",
    icon: "🎯",
  },

  /* ══════════════════════════════════════════════════════
     HUMAN RESOURCES
     ══════════════════════════════════════════════════════ */
  {
    id: "hr-generalist",
    title: "HR Generalist",
    category: "Human Resources",
    description:
      "Handle recruitment, employee relations, compliance, and HR operations.",
    requiredSkills: [
      "hr-management",
      "recruitment",
      "labour-law",
      "communication",
      "conflict-resolution",
      "attention-to-detail",
    ],
    averageSalary: { min: 50000, max: 100000 },
    demandLevel: "medium",
    icon: "👥",
  },
  {
    id: "talent-acquisition",
    title: "Talent Acquisition Specialist",
    category: "Human Resources",
    description: "Source, screen, and hire top talent across the organisation.",
    requiredSkills: [
      "recruitment",
      "communication",
      "sales-negotiation",
      "crm-tools",
      "social-media",
      "attention-to-detail",
    ],
    averageSalary: { min: 50000, max: 100000 },
    demandLevel: "high",
    icon: "🔎",
  },

  /* ══════════════════════════════════════════════════════
     HEALTHCARE
     ══════════════════════════════════════════════════════ */
  {
    id: "healthcare-admin",
    title: "Healthcare Administrator",
    category: "Healthcare",
    description:
      "Manage operations, budgets, and compliance in healthcare facilities.",
    requiredSkills: [
      "healthcare-systems",
      "project-management",
      "regulatory-compliance",
      "leadership",
      "communication",
      "excel",
    ],
    averageSalary: { min: 55000, max: 120000 },
    demandLevel: "medium",
    icon: "🏥",
  },
  {
    id: "public-health-analyst",
    title: "Public Health Analyst",
    category: "Healthcare",
    description:
      "Research health trends, design interventions, and evaluate public health programmes.",
    requiredSkills: [
      "healthcare-systems",
      "statistics",
      "data-analysis",
      "report-writing",
      "research-methods",
      "critical-thinking",
    ],
    averageSalary: { min: 50000, max: 100000 },
    demandLevel: "medium",
    icon: "🩺",
  },

  /* ══════════════════════════════════════════════════════
     EDUCATION
     ══════════════════════════════════════════════════════ */
  {
    id: "curriculum-developer",
    title: "Curriculum Developer",
    category: "Education",
    description:
      "Design educational programs, course materials, and assessment strategies.",
    requiredSkills: [
      "instructional-design",
      "curriculum-planning",
      "research-methods",
      "communication",
      "report-writing",
      "critical-thinking",
    ],
    averageSalary: { min: 50000, max: 95000 },
    demandLevel: "medium",
    icon: "📚",
  },

  /* ══════════════════════════════════════════════════════
     PUBLIC SERVICE & NGO
     ══════════════════════════════════════════════════════ */
  {
    id: "policy-analyst",
    title: "Policy Analyst",
    category: "Public Service & NGO",
    description:
      "Research, analyse, and recommend public policy using evidence-based methods.",
    requiredSkills: [
      "policy-analysis",
      "research-methods",
      "report-writing",
      "statistics",
      "critical-thinking",
      "communication",
    ],
    averageSalary: { min: 55000, max: 110000 },
    demandLevel: "medium",
    icon: "🏛️",
  },
  {
    id: "programme-coordinator",
    title: "Programme Coordinator",
    category: "Public Service & NGO",
    description:
      "Plan, implement, and monitor development or social impact programmes.",
    requiredSkills: [
      "project-management",
      "report-writing",
      "communication",
      "leadership",
      "data-analysis",
      "stakeholder-engagement",
    ],
    averageSalary: { min: 45000, max: 90000 },
    demandLevel: "medium",
    icon: "🌍",
  },
];



import type { ResumeData, ResumeDocument, ResumeMeta } from "./types";
import type { TemplateId } from "./types";

export const SAMPLE_RESUME_DATA: ResumeData = {
  contact: {
    name: "Avery Chen",
    title: "Senior Software Engineer",
    email: "avery.chen@example.com",
    phone: "(415) 555-0142",
    location: "San Francisco, CA",
    website: "averychen.dev",
    linkedin: "linkedin.com/in/averychen",
    github: "github.com/averychen",
  },
  summary:
    "Senior Software Engineer with 7+ years building scalable web platforms and developer tooling. Shipped products used by millions, led teams of 4–8 engineers, and drove architecture migrations that cut latency by 40%. Passionate about performance, accessibility, and mentoring.",
  experience: [
    {
      id: "exp1",
      company: "Lumina Labs",
      role: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2021-06",
      endDate: "Present",
      current: true,
      bullets: [
        "Led migration of monolith to a modular Next.js + tRPC architecture, reducing p95 page load from 2.1s to 740ms.",
        "Mentored 5 engineers and instituted a weekly architecture review that cut production incidents by 35%.",
        "Built a real-time collaboration feature (WebSocket + CRDT) adopted by 120k weekly active users.",
        "Drove adoption of edge caching, lowering CDN origin requests by 62% and saving $18k/month.",
      ],
    },
    {
      id: "exp2",
      company: "Northwind",
      role: "Software Engineer",
      location: "Remote",
      startDate: "2018-03",
      endDate: "2021-05",
      bullets: [
        "Shipped a multi-tenant analytics dashboard in React + D3 used by 200+ enterprise customers.",
        "Reduced bundle size 41% via code-splitting and lazy loading, improving Lighthouse score from 71 to 96.",
        "Automated CI/CD with GitHub Actions, cutting deploy time from 24m to 6m.",
      ],
    },
  ],
  projects: [
    {
      id: "prj1",
      name: "OpenResume",
      description: "Open-source resume analysis toolkit.",
      url: "github.com/averychen/openresume",
      tech: ["TypeScript", "Next.js", "Prisma", "SQLite"],
      bullets: [
        "1.2k GitHub stars; deterministic ATS scoring engine processing 40k resumes/month.",
      ],
    },
    {
      id: "prj2",
      name: "LatencyLens",
      description: "Open-source RUM performance profiler.",
      tech: ["Rust", "WebAssembly", "React"],
      bullets: [
        "Field-tested at 3 startups; surfaced regressions 6x faster than Lighthouse CI.",
      ],
    },
  ],
  education: [
    {
      id: "edu1",
      school: "University of California, Berkeley",
      degree: "B.S.",
      field: "Computer Science",
      startDate: "2014-08",
      endDate: "2018-05",
      gpa: "3.8",
    },
  ],
  certificates: [
    { id: "cert1", name: "AWS Solutions Architect – Associate", issuer: "Amazon Web Services", date: "2022-09" },
  ],
  training: [
    { id: "trn1", title: "Object Oriented Programming using C++", organization: "LPU", startDate: "2025-06", endDate: "2025-07", bullets: ["Crafted console-based exam system implementing core OOP principles", "Established class hierarchies for questions, students, and results management"] }
  ],
  achievements: [
    { id: "ach1", title: "LeetCode: 800+ Problems Solved", description: "10 Badges Earned | Global Rank - 51,778", url: "leetcode.com", bullets: ["Consistent Top Performer in algorithmic challenges and coding competitions", "Demonstrated Expertise in data structures, algorithms, and optimized problem-solving"] }
  ],
  skills: [
    { id: "sk1", category: "Languages", items: ["TypeScript", "JavaScript", "Python", "Go", "SQL"] },
    { id: "sk2", category: "Frameworks", items: ["Next.js", "React", "Node.js", "tRPC", "Prisma"] },
    { id: "sk3", category: "Cloud & DevOps", items: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions"] },
    { id: "sk4", category: "Practices", items: ["System Design", "Accessibility", "Performance", "Mentorship"] },
  ],
};

export const DEFAULT_META: ResumeMeta = {
  template: "modern",
  accent: "#0f766e",
  font: "inter",
  spacing: "normal",
};

export function sampleResumeDoc(): ResumeDocument {
  const now = new Date().toISOString();
  return {
    id: "resume-sample",
    title: "Avery Chen — Senior SWE",
    meta: DEFAULT_META,
    data: SAMPLE_RESUME_DATA,
    isFavorite: true,
    createdAt: now,
    updatedAt: now,
  };
}

export const TEMPLATE_PRESETS: { id: TemplateId; name: string; description: string }[] = [
  { id: "modern", name: "Modern", description: "Accent header, clean two-column skills." },
  { id: "professional", name: "Professional", description: "Classic single-column, serif accents." },
  { id: "minimal", name: "Minimal", description: "Whitespace-forward, no color." },
  { id: "academic", name: "Academic", description: "Publications-style, serif body." },
  { id: "engineer", name: "Software Engineer", description: "Tech-first, monospaced headers." },
  { id: "pm", name: "Product Manager", description: "Impact-forward, metric highlights." },
  { id: "datasci", name: "Data Scientist", description: "Modeling & metrics, compact." },
  { id: "designer", name: "Designer", description: "Editorial typography, generous spacing." },
];

export const ACCENT_PRESETS = [
  "#0f766e", 
  "#15803d", 
  "#b45309", 
  "#9f1239", 
  "#6d28d9", 
  "#0e7490", 
  "#1f2937", 
  "#be123c", 
];

export const SAMPLE_JOB_DESCRIPTION = `Senior Software Engineer — Platform

About the role:
We're looking for a Senior Software Engineer to join our Platform team. You will design and build scalable backend services, own critical infrastructure, and mentor engineers.

Requirements:
- 5+ years of professional experience building production web applications
- Deep expertise in TypeScript, Node.js, and React
- Experience with PostgreSQL, Redis, and event-driven architecture
- Strong understanding of distributed systems and system design
- Experience with AWS (EC2, S3, Lambda, RDS) and Kubernetes
- Familiarity with CI/CD, observability (Datadog, Grafana), and incident response
- Excellent communication and cross-functional collaboration skills

Nice to have:
- Experience with GraphQL and gRPC
- Contributions to open source
- Background in performance optimization and edge caching
`;





export type ID = string;

export interface ContactInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface ExperienceItem {
  id: ID;
  company: string;
  role: string;
  location?: string;
  startDate: string; 
  endDate: string; 
  current?: boolean;
  bullets: string[];
}

export interface ProjectItem {
  id: ID;
  name: string;
  description: string;
  url?: string;
  tech: string[];
  bullets: string[];
  startDate?: string;
  endDate?: string;
}

export interface EducationItem {
  id: ID;
  school: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate: string;
  location?: string;
  gpa?: string;
  highlights?: string[];
}

export interface CertificateItem {
  id: ID;
  name: string;
  issuer: string;
  date: string;
  endDate?: string;
  url?: string;
}

export interface TrainingItem {
  id: ID;
  title: string;
  organization?: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface AchievementItem {
  id: ID;
  title: string;
  description?: string;
  url?: string;
  date?: string;
  bullets: string[];
}

export interface SkillItem {
  id: ID;
  category: string;
  items: string[];
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  training: TrainingItem[];
  education: EducationItem[];
  certificates: CertificateItem[];
  achievements: AchievementItem[];
  skills: SkillItem[];
  custom?: { id: ID; title: string; body: string }[];
}

export type TemplateId =
  | "modern"
  | "professional"
  | "minimal"
  | "academic"
  | "engineer"
  | "pm"
  | "datasci"
  | "designer";

export interface ResumeMeta {
  template: TemplateId;
  accent: string; 
  font: "inter" | "geist" | "serif" | "mono";
  spacing: "compact" | "normal" | "relaxed";
}

export interface ResumeDocument {
  id: ID;
  title: string;
  meta: ResumeMeta;
  data: ResumeData;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeVersion {
  id: ID;
  resumeId: ID;
  label: string;
  note?: string;
  data: ResumeData;
  meta: ResumeMeta;
  createdAt: string;
}



export interface SectionCheck {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  message: string;
  weight: number; 
}

export interface ATSReport {
  id: ID;
  resumeId: ID;
  jobDescId?: ID;
  overall: number;
  keyword: number;
  formatting: number;
  sections: number;
  semantic: number;
  readability: number;
  grammar: number;
  details: {
    sectionChecks: SectionCheck[];
    matchedKeywords: string[];
    missingKeywords: string[];
    actionVerbsFound: string[];
    weakPhrases: string[];
    quantifiedBullets: number;
    totalBullets: number;
    wordCount: number;
    pageCount: number;
    readabilityScore: number; 
    gradeLevel: number;
    suggestions: string[];
    jobTitleMatch?: { title: string; match: number };
  };
  aiExplanation?: string;
  createdAt: string;
}

export interface JobDescription {
  id: ID;
  title: string;
  company?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchResult {
  overallMatch: number;
  keywordMatch: number;
  semanticSimilarity: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  missingSkills: string[];
  requiredTechnologies: string[];
  seniorityMatch: { level: string; score: number };
  experienceMatch: { required: number; actual: number; score: number };
  recommendations: string[];
}

export interface ChatMessage {
  id: ID;
  role: "user" | "assistant" | "system";
  content: string;
  ts: number;
  pending?: boolean;
}

export interface AIConversation {
  id: ID;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CoverLetter {
  id: ID;
  resumeId?: ID;
  jobDescId?: ID;
  title: string;
  content: string;
  tone: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: ID;
  action: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

export interface ApplicationItem {
  id: ID;
  company: string;
  role: string;
  status: "saved" | "applied" | "interview" | "offer" | "rejected";
  url?: string;
  appliedAt?: string;
  notes?: string;
}

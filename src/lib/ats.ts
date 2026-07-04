




import type {
  ATSReport,
  JobDescription,
  MatchResult,
  ResumeData,
  ResumeDocument,
  SectionCheck,
} from "./types";


const STOPWORDS = new Set(
  `a an the and or but if then else for to of in on at by with from as is are was were be been being this that these those it its they them their there here we you your our i me my will would could should may might can must do does did have has had not no yes very also more most some any all each every other than into out over under again further once up down off above below now new old get got make made use used using like such about into out over under again further once`.split(
    /\s+/,
  ),
);


const SKILL_LEXICON = new Set(
  [
    
    "javascript","typescript","python","java","c++","c#","go","rust","ruby","php","swift","kotlin","scala","r","sql","bash","shell","perl","dart","elixir","clojure","haskell",
    
    "react","vue","angular","svelte","next.js","nextjs","nuxt","redux","graphql","apollo","tailwind","css","html","sass","scss","webpack","vite","jquery","bootstrap","material-ui","shadcn","framer-motion",
    
    "node.js","nodejs","express","nestjs","django","flask","fastapi","spring","springboot","rails","laravel","asp.net","dotnet",".net","gin","fiber","ktor",
    
    "postgresql","postgres","mysql","mongodb","redis","sqlite","dynamodb","cassandra","elasticsearch","supabase","prisma","typeorm","sequelize","drizzle",
    
    "aws","gcp","azure","docker","kubernetes","k8s","terraform","ansible","jenkins","github actions","gitlab ci","circleci","vagrant","helm","argocd","serverless","lambda","ec2","s3","cloudfront","firebase","vercel","netlify",
    
    "pandas","numpy","scikit-learn","sklearn","tensorflow","pytorch","keras","xgboost","lightgbm","spark","hadoop","airflow","dbt","snowflake","bigquery","tableau","powerbi","looker","kafka","spark","databricks","mlflow","huggingface","llm","nlp","cv","computer vision","deep learning","machine learning","reinforcement",
    
    "git","github","gitlab","bitbucket","jira","confluence","notion","figma","slack","postman","linux","unix","macos","windows",
    
    "rest","grpc","microservices","ci/cd","tdd","bdd","agile","scrum","kanban","oauth","jwt","sso","saas","paas","iaas","api","sdk","oop","functional programming","distributed systems","system design",
    
    "leadership","mentorship","collaboration","communication","stakeholder","cross-functional","ownership","problem-solving",
  ].map((s) => s.toLowerCase()),
);


const ACTION_VERBS = new Set(
  `accelerated accomplished achieved acted adapted administered advanced advised advocated analyzed architected arranged assessed authored automated balanced built launched led managed designed developed deployed delivered drove engineered established executed expanded improved increased influenced initiated integrated launched led managed mentored negotiated optimized orchestrated oversaw pioneered produced reduced removed resolved revamped scaled shipped streamlined spearheaded transformed upgraded validated won`.split(
    /\s+/,
  ),
);


const WEAK_PHRASES = [
  "responsible for","responsible","duties included","worked on","helped with","helped","in charge of","tasked with","assisted in","assisted with","participated in","involved in","familiar with","exposure to","some experience","team player","hard worker","go-getter","think outside the box","results-driven","detail-oriented","self-starter",
];



function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}


function readability(text: string): {
  score: number;
  gradeLevel: number;
} {
  const sentences = (text.match(/[.!?]+/g) || []).length || 1;
  const words = (text.match(/\b[\w']+\b/g) || []).length || 1;
  const syllables = words
    ? text
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .reduce((acc, w) => acc + countSyllables(w), 0)
    : 1;
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  const gradeLevel =
    0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
  return { score: clamp(score, 0, 100), gradeLevel: Math.max(0, gradeLevel) };
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const m = word.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}



function extractKeywords(text: string): string[] {
  const tokens = tokenize(text);
  const freq = new Map<string, number>();
  for (const t of tokens) {
    if (STOPWORDS.has(t) || t.length < 2) continue;
    const isSkill = SKILL_LEXICON.has(t);
    const weight = isSkill ? 3 : 1;
    freq.set(t, (freq.get(t) || 0) + weight);
  }
  
  const lower = text.toLowerCase();
  for (const skill of SKILL_LEXICON) {
    if (skill.includes(" ") || skill.includes(".") || skill.includes("/")) {
      if (lower.includes(skill)) {
        freq.set(skill, (freq.get(skill) || 0) + 5);
      }
    }
  }
  
  return uniq(
    Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map((e) => e[0]),
  );
}


function resumeToText(data: ResumeData): string {
  const parts: string[] = [];
  parts.push(data.contact.name, data.contact.title, data.summary);
  for (const e of data.experience) {
    parts.push(e.role, e.company, e.startDate, e.endDate, ...e.bullets);
  }
  for (const p of data.projects) {
    parts.push(p.name, p.description, p.startDate || "", p.endDate || "", ...p.bullets);
  }
  if (data.training) for (const t of data.training) parts.push(t.title, t.organization || "", t.startDate, t.endDate, ...t.bullets);
  for (const s of data.skills) parts.push(s.category, s.items.join(" "));
  for (const ed of data.education) parts.push(ed.school, ed.degree, ed.field || "", ed.startDate, ed.endDate, ed.location || "");
  for (const c of data.certificates) parts.push(c.name, c.issuer, c.date);
  if (data.achievements) for (const a of data.achievements) parts.push(a.title, a.description || "", ...a.bullets);
  if (data.custom) for (const c of data.custom) parts.push(c.title, c.body);
  return parts.filter(Boolean).join(". ");
}



function sectionChecks(data: ResumeData): SectionCheck[] {
  const checks: SectionCheck[] = [];

  const has = (s: string) => s && s.trim().length > 0;

  
  const contactOk =
    has(data.contact.name) &&
    has(data.contact.email) &&
    has(data.contact.phone) &&
    has(data.contact.title);
  checks.push({
    id: "contact",
    label: "Contact Information",
    status: contactOk ? "pass" : "fail",
    message: contactOk
      ? "Name, title, email and phone are present."
      : "Missing core contact fields (name, title, email or phone).",
    weight: 8,
  });

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.email);
  checks.push({
    id: "email",
    label: "Email Format",
    status: emailOk ? "pass" : "fail",
    message: emailOk ? "Valid email address." : "Email looks malformed.",
    weight: 3,
  });

  
  const summaryLen = data.summary.trim().split(/\s+/).filter(Boolean).length;
  checks.push({
    id: "summary",
    label: "Professional Summary",
    status: summaryLen >= 30 && summaryLen <= 90 ? "pass" : summaryLen > 0 ? "warn" : "fail",
    message:
      summaryLen === 0
        ? "Add a 2–4 sentence professional summary."
        : summaryLen < 30
          ? "Summary is short — aim for 30–90 words."
          : summaryLen > 90
            ? "Summary is long — trim to 30–90 words."
            : "Summary length is optimal.",
    weight: 6,
  });

  
  checks.push({
    id: "experience",
    label: "Work Experience",
    status: data.experience.length >= 1 ? "pass" : "fail",
    message:
      data.experience.length === 0
        ? "No work experience entries."
        : `${data.experience.length} experience entr${data.experience.length === 1 ? "y" : "ies"} found.`,
    weight: 10,
  });

  const bulletsTotal = data.experience.reduce((a, e) => a + e.bullets.length, 0);
  checks.push({
    id: "bullets",
    label: "Achievement Bullets",
    status: bulletsTotal >= 5 ? "pass" : bulletsTotal > 0 ? "warn" : "fail",
    message:
      bulletsTotal === 0
        ? "Add achievement bullets to each role."
        : `${bulletsTotal} bullets total — aim for 3–5 per role.`,
    weight: 8,
  });

  
  const skillCount = data.skills.reduce((a, s) => a + s.items.length, 0);
  checks.push({
    id: "skills",
    label: "Skills Section",
    status: skillCount >= 8 ? "pass" : skillCount > 0 ? "warn" : "fail",
    message:
      skillCount === 0
        ? "Add a skills section with relevant technologies."
        : `${skillCount} skills listed — aim for 8–20.`,
    weight: 8,
  });

  
  checks.push({
    id: "education",
    label: "Education",
    status: data.education.length >= 1 ? "pass" : "warn",
    message: data.education.length ? "Education section present." : "No education entries.",
    weight: 5,
  });

  
  checks.push({
    id: "projects",
    label: "Projects",
    status: data.projects.length >= 1 ? "pass" : "warn",
    message: data.projects.length ? `${data.projects.length} projects listed.` : "Add 1–3 projects.",
    weight: 4,
  });

  
  const dateIssues = data.experience.filter(
    (e) => !has(e.startDate) || !has(e.endDate),
  ).length;
  checks.push({
    id: "dates",
    label: "Employment Dates",
    status: dateIssues === 0 ? "pass" : dateIssues < data.experience.length ? "warn" : "fail",
    message:
      dateIssues === 0
        ? "All experience entries have dates."
        : `${dateIssues} entries missing start/end dates.`,
    weight: 4,
  });

  return checks;
}



interface FormattingCheck {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  message: string;
  weight: number;
}

function formattingChecks(data: ResumeData): FormattingCheck[] {
  const checks: FormattingCheck[] = [];
  
  const links = [data.contact.linkedin, data.contact.github, data.contact.website].filter(Boolean).length;
  checks.push({
    id: "links",
    label: "Profile Links",
    status: links >= 1 ? "pass" : "warn",
    message: links ? `${links} profile link(s) present.` : "Add LinkedIn/GitHub/website links.",
    weight: 5,
  });

  
  const allText = resumeToText(data);
  const badChars = (allText.match(/[•‣◦▪◆●]/g) || []).length;
  checks.push({
    id: "bullets-chars",
    label: "Bullet Characters",
    status: badChars === 0 ? "pass" : "warn",
    message: badChars ? `${badChars} fancy bullet glyph(s) — use plain "-".` : "No problematic bullet glyphs.",
    weight: 4,
  });

  
  const tableish = (allText.match(/\|/g) || []).length;
  checks.push({
    id: "tables",
    label: "Table Characters",
    status: tableish === 0 ? "pass" : "warn",
    message: tableish ? "Pipe characters detected — avoid tables." : "No table-like characters.",
    weight: 4,
  });

  
  checks.push({
    id: "no-photo",
    label: "No Photo/Images",
    status: "pass",
    message: "Resume data model excludes images — ATS-friendly.",
    weight: 4,
  });

  
  const words = (allText.match(/\b[\w']+\b/g) || []).length;
  let pageStatus: FormattingCheck["status"] = "pass";
  let pageMsg = `${words} words (~${Math.max(1, Math.round(words / 380))} page(s)).`;
  if (words < 200) {
    pageStatus = "fail";
    pageMsg = "Resume is too short (<200 words).";
  } else if (words > 1100) {
    pageStatus = "warn";
    pageMsg = "Resume may exceed 2 pages (>1100 words).";
  }
  checks.push({
    id: "length",
    label: "Resume Length",
    status: pageStatus,
    message: pageMsg,
    weight: 6,
  });

  return checks;
}



function bulletAnalysis(data: ResumeData) {
  const allBullets = data.experience.flatMap((e) => e.bullets);
  const actionVerbsFound: string[] = [];
  const weakPhrases: string[] = [];
  let quantified = 0;
  for (const b of allBullets) {
    const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "");
    if (firstWord && ACTION_VERBS.has(firstWord)) actionVerbsFound.push(firstWord);
    const lower = b.toLowerCase();
    for (const w of WEAK_PHRASES) {
      if (lower.includes(w) && !weakPhrases.includes(w)) weakPhrases.push(w);
    }
    if (/\b\d+(\.\d+)?%?\b/.test(b) || /\$\s?\d/.test(b)) quantified++;
  }
  return {
    actionVerbsFound: uniq(actionVerbsFound),
    weakPhrases,
    quantifiedBullets: quantified,
    totalBullets: allBullets.length,
  };
}



function grammarCheck(data: ResumeData): { issues: number; samples: string[] } {
  const issues: string[] = [];
  const sentences = resumeToText(data).split(/(?<=[.!?])\s+/);
  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    
    if (/^[a-z]/.test(trimmed)) issues.push(`Sentence should start with a capital: "${trimmed.slice(0, 60)}…"`);
    
    if (/  +/.test(s)) issues.push("Double space detected.");
    
    if (/\bi\b(?!\.)/.test(s)) issues.push('Lowercase "i" should be "I".');
    
    if (/\b(\w+)\s+\1\b/i.test(s)) issues.push(`Repeated word in: "${trimmed.slice(0, 60)}…"`);
  }
  
  for (const e of data.experience) {
    for (const b of e.bullets) {
      if (/^(was|is|are|were)\b/i.test(b.trim()))
        issues.push(`Bullet starts with a weak verb: "${b.slice(0, 60)}…"`);
    }
  }
  return { issues: issues.length, samples: issues.slice(0, 6) };
}



function keywordMatch(
  data: ResumeData,
  job: Pick<JobDescription, "content"> | string,
): {
  score: number;
  matched: string[];
  missing: string[];
  requiredTech: string[];
} {
  const jdText = typeof job === "string" ? job : job.content;
  const resumeText = resumeToText(data);
  const jdKeywords = extractKeywords(jdText).slice(0, 60);
  const resumeTokens = new Set(tokenize(resumeText));

  const matched: string[] = [];
  const missing: string[] = [];
  const requiredTech: string[] = [];

  for (const kw of jdKeywords) {
    
    const isMulti = /[ ./-]/.test(kw);
    const hit = isMulti
      ? resumeText.toLowerCase().includes(kw)
      : resumeTokens.has(kw);
    if (hit) {
      matched.push(kw);
      if (SKILL_LEXICON.has(kw)) requiredTech.push(kw);
    } else {
      missing.push(kw);
      if (SKILL_LEXICON.has(kw)) requiredTech.push(kw);
    }
  }

  const score =
    jdKeywords.length === 0
      ? 0
      : clamp((matched.length / jdKeywords.length) * 100);
  return { score, matched, missing, requiredTech };
}



function semanticSimilarity(a: string, b: string): number {
  const va = tfidfVector(a);
  const vb = tfidfVector(b);
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (const k of new Set([...Object.keys(va), ...Object.keys(vb)])) {
    const x = va[k] || 0;
    const y = vb[k] || 0;
    dot += x * y;
    magA += x * x;
    magB += y * y;
  }
  if (magA === 0 || magB === 0) return 0;
  return clamp((dot / (Math.sqrt(magA) * Math.sqrt(magB))) * 100);
}

function tfidfVector(text: string): Record<string, number> {
  const tokens = tokenize(text).filter((t) => !STOPWORDS.has(t) && t.length > 2);
  const freq: Record<string, number> = {};
  for (const t of tokens) freq[t] = (freq[t] || 0) + 1;
  const max = Math.max(1, ...Object.values(freq));
  const vec: Record<string, number> = {};
  for (const k of Object.keys(freq)) {
    
    vec[k] = (0.5 + 0.5 * (freq[k] / max)) * Math.log(1 + tokens.length / (1 + (freq[k] || 1)));
  }
  return vec;
}



interface ScoreOptions {
  jobDescription?: Pick<JobDescription, "content"> | string;
}

export function scoreResume(
  doc: ResumeDocument | { data: ResumeData; meta?: never },
  opts: ScoreOptions = {},
): Omit<ATSReport, "id" | "resumeId" | "jobDescId" | "aiExplanation" | "createdAt"> {
  const data = (doc as ResumeDocument).data ?? (doc as { data: ResumeData }).data;
  const sections = sectionChecks(data);
  const formatting = formattingChecks(data);
  const bullets = bulletAnalysis(data);
  const grammar = grammarCheck(data);
  const text = resumeToText(data);
  const rd = readability(text);
  const wordCount = (text.match(/\b[\w']+\b/g) || []).length;
  const pageCount = Math.max(1, Math.round(wordCount / 380));

  
  
  let keywordScore = 0;
  let matched: string[] = [];
  let missing: string[] = [];
  let requiredTech: string[] = [];
  let jobTitleMatch: { title: string; match: number } | undefined;
  if (opts.jobDescription) {
    const km = keywordMatch(data, opts.jobDescription);
    keywordScore = km.score;
    matched = km.matched;
    missing = km.missing;
    requiredTech = km.requiredTech;
    const jdTitle =
      (typeof opts.jobDescription === "string"
        ? opts.jobDescription
        : opts.jobDescription.content
      )
        .split("\n")[0]
        ?.slice(0, 80) || "";
    jobTitleMatch = {
      title: jdTitle,
      match: semanticSimilarity(data.contact.title, jdTitle),
    };
  } else {
    
    const resumeText = resumeToText(data);
    const skills = data.skills.reduce<string[]>((a, s) => [...a, ...s.items], []);
    const covered = skills.filter((s) => resumeText.toLowerCase().includes(s.toLowerCase()));
    keywordScore = skills.length ? clamp((covered.length / skills.length) * 100) : 0;
  }

  
  const fmtScore = weightedScore(formatting);
  
  const secScore = weightedScore(sections);
  
  let semanticScore: number;
  if (opts.jobDescription) {
    const jdText = typeof opts.jobDescription === "string" ? opts.jobDescription : opts.jobDescription.content;
    semanticScore = semanticSimilarity(resumeToText(data), jdText);
  } else {
    
    semanticScore = semanticSimilarity(data.summary, resumeToText(data));
  }
  
  
  const re = rd.score;
  let readabilityScore: number;
  if (re >= 40 && re <= 65) readabilityScore = 100;
  else if (re >= 30 && re <= 75) readabilityScore = 80;
  else if (re >= 20 && re <= 85) readabilityScore = 60;
  else readabilityScore = 40;
  
  const grammarScore = clamp(100 - grammar.issues * 6);

  
  const overall = clamp(
    keywordScore * 0.3 +
      fmtScore * 0.2 +
      secScore * 0.2 +
      semanticScore * 0.15 +
      readabilityScore * 0.1 +
      grammarScore * 0.05,
  );

  
  const suggestions: string[] = [];
  if (missing.length) suggestions.push(`Add missing keywords: ${missing.slice(0, 8).join(", ")}.`);
  if (bullets.weakPhrases.length) suggestions.push(`Replace weak phrases: ${bullets.weakPhrases.slice(0, 5).join(", ")}.`);
  if (bullets.totalBullets > 0 && bullets.quantifiedBullets / bullets.totalBullets < 0.4)
    suggestions.push("Quantify more bullets with metrics (%, $, time saved).");
  if (bullets.actionVerbsFound.length < 5) suggestions.push("Start bullets with strong action verbs.");
  if (rd.gradeLevel > 14) suggestions.push("Simplify language — grade level is high for ATS parsers.");
  if (sections.find((s) => s.id === "summary" && s.status !== "pass")) suggestions.push("Refine your professional summary (30–90 words).");
  if (wordCount < 200) suggestions.push("Expand content — resume is too short.");
  if (wordCount > 1100) suggestions.push("Trim content — resume may exceed 2 pages.");
  if (grammar.issues > 0) suggestions.push("Fix grammar issues (capitalization, repeated words).");
  if (suggestions.length === 0) suggestions.push("Strong resume — keep tailoring keywords per job.");

  return {
    overall,
    keyword: keywordScore,
    formatting: fmtScore,
    sections: secScore,
    semantic: semanticScore,
    readability: readabilityScore,
    grammar: grammarScore,
    details: {
      sectionChecks: sections,
      matchedKeywords: matched,
      missingKeywords: missing,
      actionVerbsFound: bullets.actionVerbsFound,
      weakPhrases: bullets.weakPhrases,
      quantifiedBullets: bullets.quantifiedBullets,
      totalBullets: bullets.totalBullets,
      wordCount,
      pageCount,
      readabilityScore: re,
      gradeLevel: Math.round(rd.gradeLevel * 10) / 10,
      suggestions,
      jobTitleMatch,
    },
  };
}

function weightedScore(
  checks: { status: "pass" | "warn" | "fail"; weight: number }[],
): number {
  const totalW = checks.reduce((a, c) => a + c.weight, 0) || 1;
  const gained = checks.reduce((a, c) => {
    const v = c.status === "pass" ? 1 : c.status === "warn" ? 0.5 : 0;
    return a + v * c.weight;
  }, 0);
  return clamp((gained / totalW) * 100);
}



export function matchJob(
  data: ResumeData,
  job: Pick<JobDescription, "content" | "title"> | string,
): MatchResult {
  const jdText = typeof job === "string" ? job : job.content;
  const jdTitle = typeof job === "string" ? "Job" : job.title;
  const km = keywordMatch(data, jdText);
  const sem = semanticSimilarity(resumeToText(data), jdText);

  
  const lower = jdText.toLowerCase();
  const levels: { level: string; score: number }[] = [];
  if (/\b(staff|principal|director|head of)\b/.test(lower)) levels.push({ level: "Staff+", score: 90 });
  if (/\b(senior|sr\.?|lead|iii)\b/.test(lower)) levels.push({ level: "Senior", score: 75 });
  if (/\b(mid|intermediate|ii)\b/.test(lower)) levels.push({ level: "Mid", score: 60 });
  if (/\b(junior|jr\.?|entry|graduate|i)\b/.test(lower)) levels.push({ level: "Junior", score: 45 });
  const seniority = levels[0] ?? { level: "Unspecified", score: 70 };

  
  const reqYearsMatch = lower.match(/(\d+)\+?\s*(?:years|yrs)/);
  const reqYears = reqYearsMatch ? parseInt(reqYearsMatch[1], 10) : 0;
  const actualYears = estimateYears(data);
  let expScore = 100;
  if (reqYears > 0) {
    if (actualYears >= reqYears) expScore = 100;
    else expScore = clamp((actualYears / reqYears) * 100);
  }
  const experienceMatch = { required: reqYears, actual: actualYears, score: expScore };

  const recommendations: string[] = [];
  if (km.missing.length) recommendations.push(`Add these missing keywords: ${km.missing.slice(0, 8).join(", ")}.`);
  if (sem < 50) recommendations.push("Rewrite your summary to better mirror the job description's language.");
  if (reqYears > actualYears) recommendations.push(`You have ~${actualYears}y vs ${reqYears}y required — emphasize relevant projects.`);
  if (recommendations.length === 0) recommendations.push("Strong match — tailor 2–3 bullets per role to the JD.");

  const overallMatch = clamp(km.score * 0.5 + sem * 0.3 + expScore * 0.2);

  return {
    overallMatch,
    keywordMatch: km.score,
    semanticSimilarity: sem,
    matchedKeywords: km.matched,
    missingKeywords: km.missing,
    missingSkills: km.missing.filter((k) => SKILL_LEXICON.has(k)),
    requiredTechnologies: km.requiredTech,
    seniorityMatch: seniority,
    experienceMatch,
    recommendations,
  };
}


function estimateYears(data: ResumeData): number {
  let months = 0;
  const now = new Date();
  for (const e of data.experience) {
    const start = parseDate(e.startDate) ?? now;
    const end = e.current || /present|current/i.test(e.endDate) ? now : parseDate(e.endDate) ?? now;
    if (end > start) months += (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  }
  return Math.round((months / 12) * 10) / 10;
}

function parseDate(s: string): Date | null {
  if (!s) return null;
  
  const m = s.match(/(\d{4})[-/](\d{1,2})/);
  if (m) return new Date(parseInt(m[1]), parseInt(m[2]) - 1);
  
  const m2 = s.match(/([A-Za-z]{3,9})\.?\s+(\d{4})/);
  if (m2) {
    const monthIdx = [
      "jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec",
    ].indexOf(m2[1].toLowerCase().slice(0, 3));
    if (monthIdx >= 0) return new Date(parseInt(m2[2]), monthIdx);
  }
  
  const m3 = s.match(/(\d{4})/);
  if (m3) return new Date(parseInt(m3[1]), 0);
  return null;
}

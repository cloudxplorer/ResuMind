







import OpenAI from "openai";
import type { ResumeData } from "./types";

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN ?? "",
});


function extractJSON<T = unknown>(raw: string): T {
  if (!raw) throw new Error("Empty AI response");
  let text = raw.trim();
  
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  
  const start = text.search(/[\[{]/);
  if (start > 0) text = text.slice(start);
  
  try {
    return JSON.parse(text) as T;
  } catch {
    
    const open = text[0];
    const close = open === "[" ? "]" : "}";
    let depth = 0;
    let inStr = false;
    let esc = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inStr) {
        if (esc) esc = false;
        else if (ch === "\\") esc = true;
        else if (ch === '"') inStr = false;
        continue;
      }
      if (ch === '"') inStr = true;
      else if (ch === open) depth++;
      else if (ch === close) {
        depth--;
        if (depth === 0) {
          return JSON.parse(text.slice(0, i + 1)) as T;
        }
      }
    }
    throw new Error("Could not parse JSON from AI response");
  }
}

interface ChatOpts {
  system: string;
  user: string;
  json?: boolean;
  temperature?: number;
}

async function chat({ system, user, json = false, temperature }: ChatOpts): Promise<string> {
  const completion = await client.chat.completions.create({
    model: "openai/gpt-oss-120b:cerebras",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    ...(temperature ? { temperature } : {}),
  });
  const content = completion.choices[0]?.message?.content ?? "";
  if (json) return JSON.stringify(extractJSON(content));
  return content;
}



const JSON_GUARD =
  "Return ONLY valid minified JSON. No markdown, no code fences, no commentary. If unsure, use empty strings or empty arrays.";

export async function aiExplainScores(report: unknown): Promise<string> {
  const system =
    "You are an expert ATS and recruiter coach. Given a deterministic ATS report (JSON), " +
    "write a concise, actionable explanation in plain prose (3-5 short paragraphs). " +
    "Explain WHY each sub-score is what it is and the SINGLE highest-impact fix. Never invent numbers; use the provided scores.";
  const user = `ATS report JSON:\n${JSON.stringify(report)}`;
  return chat({ system, user });
}

interface RewriteResult {
  before: string;
  after: string;
  rationale: string;
}

export async function aiRewriteSection(
  kind: "summary" | "bullet" | "project",
  text: string,
  context?: { role?: string; company?: string; jobDescription?: string },
): Promise<RewriteResult> {
  const system =
    "You are a senior resume writer. Rewrite the given resume text to be concise, " +
    "impactful, ATS-friendly, and quantified where possible. Start bullets with strong action verbs. " +
    JSON_GUARD;
  const user = `Rewrite this ${kind}.\nContext: ${JSON.stringify(context || {})}\nText: """${text}"""\n` +
    `Return JSON: {"before": string, "after": string, "rationale": string}`;
  const raw = await chat({ system, user, json: true });
  return extractJSON<RewriteResult>(raw);
}

export interface ImprovedBullet {
  original: string;
  improved: string;
  metric?: string;
}

export async function aiImproveBullets(bullets: string[]): Promise<ImprovedBullet[]> {
  const system =
    "You are a resume bullet optimizer. Convert responsibilities into quantified achievements using the STAR method. " +
    "Infer reasonable, truthful-sounding metrics only when clearly implied; otherwise keep it qualitative but stronger. " +
    JSON_GUARD;
  const user =
    `Improve these resume bullets:\n${JSON.stringify(bullets)}\n` +
    `Return JSON: {"items": [{"original": string, "improved": string, "metric": string}]} where items maps 1:1 to inputs.`;
  const raw = await chat({ system, user, json: true });
  const parsed = extractJSON<{ items: ImprovedBullet[] }>(raw);
  return parsed.items ?? [];
}

interface TailoredResume {
  summary: string;
  experience: { id: string; bullets: string[] }[];
  skills: { category: string; items: string[] }[];
  notes: string[];
}

export async function aiTailorResume(
  resumeData: unknown,
  jobDescription: string,
): Promise<TailoredResume> {
  const system =
    "You tailor resumes to specific job descriptions while staying truthful. " +
    "Rewrite the summary and experience bullets to mirror the JD's language and emphasize relevant skills. " +
    "Suggest missing skills to add. Never fabricate employers, titles, or dates. " +
    JSON_GUARD;
  const user =
    `Resume JSON:\n${JSON.stringify(resumeData)}\n\nJob Description:\n${jobDescription}\n\n` +
    `Return JSON: {"summary": string, "experience": [{"id": string, "bullets": string[]}], ` +
    `"skills": [{"category": string, "items": string[]}], "notes": string[]}. ` +
    `Use the existing experience ids. Keep bullet counts similar to the original.`;
  const raw = await chat({ system, user, json: true });
  return extractJSON<TailoredResume>(raw);
}

interface CoverLetterResult {
  title: string;
  content: string;
}

export async function aiCoverLetter(
  resumeData: unknown,
  jobDescription: string,
  tone: string,
): Promise<CoverLetterResult> {
  const system =
    "You write distinctive, specific cover letters that avoid clichés and never repeat the resume. " +
    "Open with a concrete hook, show 1-2 genuine accomplishments relevant to the role, and close with intent. " +
    "3-4 paragraphs, ~250 words. " +
    JSON_GUARD;
  const user =
    `Resume JSON:\n${JSON.stringify(resumeData)}\n\nJob Description:\n${jobDescription}\n\nTone: ${tone}\n` +
    `Return JSON: {"title": string, "content": string} where content is the full letter text.`;
  const raw = await chat({ system, user, json: true });
  return extractJSON<CoverLetterResult>(raw);
}

interface SuggestionsResult {
  missingSkills: string[];
  certifications: string[];
  keywords: string[];
  actionVerbs: string[];
  summary: string;
}

export async function aiSuggestions(
  resumeData: unknown,
  jobDescription?: string,
): Promise<SuggestionsResult> {
  const system =
    "You audit resumes and recommend concrete improvements. " +
    "Suggest missing skills, certifications, keywords, and stronger action verbs relevant to the target role. " +
    JSON_GUARD;
  const user =
    `Resume JSON:\n${JSON.stringify(resumeData)}\n` +
    (jobDescription ? `Target job description:\n${jobDescription}\n` : "") +
    `Return JSON: {"missingSkills": string[], "certifications": string[], "keywords": string[], "actionVerbs": string[], "summary": string}`;
  const raw = await chat({ system, user, json: true });
  return extractJSON<SuggestionsResult>(raw);
}

interface ChatResult {
  reply: string;
  action?: { type: string; payload?: unknown };
}


export async function aiAssistant(
  messages: { role: "user" | "assistant"; content: string }[],
  resumeData: unknown,
  jobDescription?: string,
): Promise<ChatResult> {
  const system =
    "You are an elite resume & career coach embedded in a resume platform. " +
    "You can see the user's current resume (JSON) and optionally a target job description. " +
    "Be concise, direct, and specific. If the user asks you to perform an action you support " +
    "(rewrite_summary, improve_bullets, generate_cover_letter, tailor_resume, explain_score), " +
    "include an 'action' object with type and a brief payload. Otherwise omit action. " +
    JSON_GUARD +
    "\nSupported action types: rewrite_summary, improve_bullets, generate_cover_letter, tailor_resume, explain_score.";
  const resumeBrief = JSON.stringify(resumeData).slice(0, 6000);
  const userTurn =
    `CURRENT RESUME (JSON):\n${resumeBrief}\n` +
    (jobDescription ? `TARGET JOB:\n${jobDescription.slice(0, 3000)}\n` : "") +
    `\nReturn JSON: {"reply": string, "action"?: {"type": string, "payload"?: object}}. ` +
    `"reply" is your visible answer to the user.`;
  const completion = await client.chat.completions.create({
    model: "openai/gpt-oss-120b:cerebras",
    messages: [
      { role: "system", content: system },
      ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: userTurn },
    ],
  });
  const content = completion.choices[0]?.message?.content ?? "{}";
  try {
    return extractJSON<ChatResult>(content);
  } catch {
    return { reply: content || "I couldn't process that." };
  }
}



export async function aiStructureResume(text: string): Promise<ResumeData> {
  const system =
    "You parse resume text (extracted from a PDF) into a structured JSON object. " +
    "Extract ALL sections accurately. Generate short stable ids (e.g. 'exp1', 'prj1', 'edu1'). " +
    "NEVER invent content that is not in the text — if a field is missing, use empty string or empty array. " +
    "NEVER hallucinate dates. If a date is present in the text, preserve it. If missing, use empty string.\n\n" +
    "DATE EXTRACTION — CRITICAL: You MUST detect and preserve ALL dates. Recognize every format:\n" +
    "- 'Jan 2025 – Present', 'January 2025 - Present', 'Jan 2025 to Present'\n" +
    "- 'January 2025 to March 2026', 'May 2022 – Aug 2023'\n" +
    "- '01/2025 - 03/2026' (MM/YYYY)\n" +
    "- '2022 – 2026', '2022 - Present'\n" +
    "- 'Aug 2023', 'Oct 2025' (single date)\n" +
    "- 'Summer 2024', 'Spring 2023' (season)\n" +
    "- 'Oct\\' 25' (abbreviated month + 2-digit year — convert to 'Oct 2025')\n" +
    "- 'Present', 'Current', 'Ongoing' (for current roles)\n\n" +
    "Normalize ALL dates to 'Mon YYYY' format (e.g. 'Jan 2025', 'Oct 2025'). " +
    "For 'Present'/'Current'/'Ongoing', set endDate to 'Present' and current=true. " +
    "NEVER discard a date. Every experience, project, education, certificate, training entry MUST have its dates.\n\n" +
    "DATE ASSOCIATION: In some PDFs, dates appear on a separate line or at the end of the text, " +
    "disconnected from their entry. You MUST associate each date with the correct entry by context. " +
    "For example, if dates like 'Oct 2025 - Nov 2025' appear after a project name 'ExamCloud', " +
    "those dates belong to ExamCloud. If 'Aug 2023 - Present' appears after 'Bachelor of Technology', " +
    "it belongs to that education entry. Match dates to entries by reading order and proximity.\n\n" +
    "DATE FORMAT CONVERSION: Convert 'Oct\\' 25' to 'Oct 2025', 'Aug\\' 23' to 'Aug 2023'. " +
    "Convert '01/2025' to 'Jan 2025'. Convert '2022' to '2022'. Convert 'Summer 2024' to 'Jun 2024'.\n\n" +
    "SECTION DETECTION: Detect ALL of these sections if present:\n" +
    "- Experience / Work Experience / Employment History\n" +
    "- Projects / Personal Projects / Academic Projects\n" +
    "- Summer Training / Training / Internship (if separate from Experience)\n" +
    "- Education / Academic Background\n" +
    "- Certificates / Certifications / Licenses\n" +
    "- Achievements / Awards / Honors\n" +
    "- Skills / Technical Skills / Core Competencies\n" +
    "- Summary / Objective / Profile\n\n" +
    "For projects, extract startDate and endDate if present (e.g. 'Oct 2025 - Nov 2025'). " +
    "For certificates, extract the issue date. " +
    "For training/internship entries, extract startDate, endDate, title, organization, and bullets. " +
    "For achievements, extract title, description, url, date, and bullets. " +
    "Split descriptions into individual bullet points. " +
    "For skills, group into categories like 'Languages', 'Frameworks', 'Tools/Platforms', etc. " +
    JSON_GUARD;
  const user =
    `Parse this resume text into structured JSON:\n\n"""\n${text.slice(0, 8000)}\n"""\n\n` +
    `Return JSON matching EXACTLY this shape (include training and achievements arrays even if empty):\n` +
    `{"contact":{"name":"","title":"","email":"","phone":"","location":"","website":"","linkedin":"","github":""},` +
    `"summary":"",` +
    `"experience":[{"id":"","company":"","role":"","location":"","startDate":"","endDate":"","current":false,"bullets":[]}],` +
    `"projects":[{"id":"","name":"","description":"","url":"","tech":[],"bullets":[],"startDate":"","endDate":""}],` +
    `"training":[{"id":"","title":"","organization":"","startDate":"","endDate":"","bullets":[]}],` +
    `"education":[{"id":"","school":"","degree":"","field":"","startDate":"","endDate":"","location":"","gpa":""}],` +
    `"certificates":[{"id":"","name":"","issuer":"","date":"","url":""}],` +
    `"achievements":[{"id":"","title":"","description":"","url":"","date":"","bullets":[]}],` +
    `"skills":[{"id":"","category":"","items":[]}]}`;
  const raw = await chat({ system, user, json: true });
  const parsed = extractJSON<Partial<ResumeData>>(raw);

  return {
    contact: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      ...parsed.contact,
    },
    summary: parsed.summary ?? "",
    experience: (parsed.experience ?? []).map((e, i) => ({
      id: e.id || `exp${i + 1}`,
      company: e.company ?? "",
      role: e.role ?? "",
      location: e.location ?? "",
      startDate: e.startDate ?? "",
      endDate: e.endDate ?? "",
      current: e.current ?? false,
      bullets: e.bullets ?? [],
    })),
    projects: (parsed.projects ?? []).map((p, i) => ({
      id: p.id || `prj${i + 1}`,
      name: p.name ?? "",
      description: p.description ?? "",
      url: p.url ?? "",
      tech: p.tech ?? [],
      bullets: p.bullets ?? [],
      startDate: p.startDate ?? "",
      endDate: p.endDate ?? "",
    })),
    training: (parsed.training ?? []).map((t, i) => ({
      id: t.id || `trn${i + 1}`,
      title: t.title ?? "",
      organization: t.organization ?? "",
      startDate: t.startDate ?? "",
      endDate: t.endDate ?? "",
      bullets: t.bullets ?? [],
    })),
    education: (parsed.education ?? []).map((e, i) => ({
      id: e.id || `edu${i + 1}`,
      school: e.school ?? "",
      degree: e.degree ?? "",
      field: e.field ?? "",
      startDate: e.startDate ?? "",
      endDate: e.endDate ?? "",
      location: e.location ?? "",
      gpa: e.gpa ?? "",
    })),
    certificates: (parsed.certificates ?? []).map((c, i) => ({
      id: c.id || `cert${i + 1}`,
      name: c.name ?? "",
      issuer: c.issuer ?? "",
      date: c.date ?? "",
      url: c.url ?? "",
    })),
    achievements: (parsed.achievements ?? []).map((a, i) => ({
      id: a.id || `ach${i + 1}`,
      title: a.title ?? "",
      description: a.description ?? "",
      url: a.url ?? "",
      date: a.date ?? "",
      bullets: a.bullets ?? [],
    })),
    skills: (parsed.skills ?? []).map((s, i) => ({
      id: s.id || `sk${i + 1}`,
      category: s.category ?? "Skills",
      items: s.items ?? [],
    })),
  };
}

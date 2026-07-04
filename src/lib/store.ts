
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  ActivityLog,
  AIConversation,
  ApplicationItem,
  ATSReport,
  ChatMessage,
  CoverLetter,
  JobDescription,
  ResumeDocument,
  ResumeData,
  ResumeMeta,
  ResumeVersion,
} from "@/lib/types";
import { sampleResumeDoc, SAMPLE_RESUME_DATA, DEFAULT_META, SAMPLE_JOB_DESCRIPTION } from "@/lib/sample-data";

export type ViewId =
  | "dashboard"
  | "builder"
  | "ats"
  | "matcher"
  | "optimizer"
  | "cover-letter"
  | "versions"
  | "chat"
  | "latex"
  | "applications";

interface AppState {
  
  view: ViewId;
  setView: (v: ViewId) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;

  
  resumes: ResumeDocument[];
  activeResumeId: string;
  activeResume: () => ResumeDocument;
  setActiveResume: (id: string) => void;
  createResume: (title: string, data?: ResumeData, meta?: ResumeMeta) => string;
  updateResume: (id: string, patch: Partial<ResumeDocument>) => void;
  updateActiveData: (patch: Partial<ResumeData>) => void;
  updateActiveMeta: (patch: Partial<ResumeMeta>) => void;
  deleteResume: (id: string) => void;
  duplicateResume: (id: string) => string;

  
  versions: ResumeVersion[];
  saveVersion: (resumeId: string, label: string, note?: string) => void;
  restoreVersion: (versionId: string) => void;

  
  atsReports: ATSReport[];
  addATSReport: (r: ATSReport) => void;

  
  jobDescriptions: JobDescription[];
  activeJobId: string;
  activeJob: () => JobDescription;
  setActiveJob: (id: string) => void;
  saveJobDescription: (title: string, content: string, company?: string) => string;
  updateJobDescription: (id: string, patch: Partial<JobDescription>) => void;
  deleteJobDescription: (id: string) => void;

  
  coverLetters: CoverLetter[];
  addCoverLetter: (cl: CoverLetter) => void;
  updateCoverLetter: (id: string, patch: Partial<CoverLetter>) => void;
  deleteCoverLetter: (id: string) => void;

  
  conversations: AIConversation[];
  activeConversationId: string;
  activeConversation: () => AIConversation;
  setActiveConversation: (id: string) => void;
  createConversation: () => string;
  appendMessage: (id: string, msg: ChatMessage) => void;
  updateMessage: (convId: string, msgId: string, patch: Partial<ChatMessage>) => void;
  deleteConversation: (id: string) => void;

  
  applications: ApplicationItem[];
  addApplication: (a: ApplicationItem) => void;
  updateApplication: (id: string, patch: Partial<ApplicationItem>) => void;
  deleteApplication: (id: string) => void;

  
  activity: ActivityLog[];
  log: (action: string, meta?: Record<string, unknown>) => void;

  
  hydrate: () => void;
}

function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: "dashboard",
      setView: (v) => set({ view: v }),
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      commandOpen: false,
      setCommandOpen: (open) => set({ commandOpen: open }),

      resumes: [sampleResumeDoc()],
      activeResumeId: "resume-sample",
      activeResume: () => {
        const s = get();
        return s.resumes.find((r) => r.id === s.activeResumeId) ?? s.resumes[0];
      },
      setActiveResume: (id) => set({ activeResumeId: id }),
      createResume: (title, data = SAMPLE_RESUME_DATA, meta = DEFAULT_META) => {
        const id = uid("resume");
        const now = new Date().toISOString();
        const doc: ResumeDocument = {
          id,
          title,
          meta,
          data: structuredClone(data),
          isFavorite: false,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ resumes: [doc, ...s.resumes], activeResumeId: id }));
        get().log("resume.create", { id, title });
        return id;
      },
      updateResume: (id, patch) =>
        set((s) => ({
          resumes: s.resumes.map((r) =>
            r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r,
          ),
        })),
      updateActiveData: (patch) => {
        const s = get();
        const r = s.activeResume();
        if (!r) return;
        set((st) => ({
          resumes: st.resumes.map((x) =>
            x.id === r.id ? { ...x, data: { ...x.data, ...patch }, updatedAt: new Date().toISOString() } : x,
          ),
        }));
      },
      updateActiveMeta: (patch) => {
        const s = get();
        const r = s.activeResume();
        if (!r) return;
        set((st) => ({
          resumes: st.resumes.map((x) =>
            x.id === r.id ? { ...x, meta: { ...x.meta, ...patch }, updatedAt: new Date().toISOString() } : x,
          ),
        }));
      },
      deleteResume: (id) =>
        set((s) => {
          const remaining = s.resumes.filter((r) => r.id !== id);
          return {
            resumes: remaining.length ? remaining : [sampleResumeDoc()],
            activeResumeId:
              s.activeResumeId === id ? (remaining[0]?.id ?? "resume-sample") : s.activeResumeId,
          };
        }),
      duplicateResume: (id) => {
        const src = get().resumes.find((r) => r.id === id);
        if (!src) return id;
        const newId = uid("resume");
        const now = new Date().toISOString();
        const copy: ResumeDocument = {
          ...structuredClone(src),
          id: newId,
          title: `${src.title} (copy)`,
          isFavorite: false,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ resumes: [copy, ...s.resumes], activeResumeId: newId }));
        return newId;
      },

      versions: [],
      saveVersion: (resumeId, label, note) => {
        const r = get().resumes.find((x) => x.id === resumeId);
        if (!r) return;
        const v: ResumeVersion = {
          id: uid("ver"),
          resumeId,
          label,
          note,
          data: structuredClone(r.data),
          meta: { ...r.meta },
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ versions: [v, ...s.versions] }));
        get().log("version.save", { resumeId, label });
      },
      restoreVersion: (versionId) => {
        const v = get().versions.find((x) => x.id === versionId);
        if (!v) return;
        get().updateResume(v.resumeId, { data: structuredClone(v.data), meta: { ...v.meta } });
        get().log("version.restore", { versionId });
      },

      atsReports: [],
      addATSReport: (r) =>
        set((s) => ({ atsReports: [r, ...s.atsReports].slice(0, 50) })),

      jobDescriptions: [
        {
          id: "jd-sample",
          title: "Senior Software Engineer — Platform",
          content: SAMPLE_JOB_DESCRIPTION,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      activeJobId: "jd-sample",
      activeJob: () => {
        const s = get();
        return s.jobDescriptions.find((j) => j.id === s.activeJobId) ?? s.jobDescriptions[0];
      },
      setActiveJob: (id) => set({ activeJobId: id }),
      saveJobDescription: (title, content, company) => {
        const id = uid("jd");
        const now = new Date().toISOString();
        const jd: JobDescription = { id, title, content, company, createdAt: now, updatedAt: now };
        set((s) => ({ jobDescriptions: [jd, ...s.jobDescriptions], activeJobId: id }));
        return id;
      },
      updateJobDescription: (id, patch) =>
        set((s) => ({
          jobDescriptions: s.jobDescriptions.map((j) =>
            j.id === id ? { ...j, ...patch, updatedAt: new Date().toISOString() } : j,
          ),
        })),
      deleteJobDescription: (id) =>
        set((s) => {
          const remaining = s.jobDescriptions.filter((j) => j.id !== id);
          return {
            jobDescriptions: remaining,
            activeJobId: s.activeJobId === id ? remaining[0]?.id ?? "" : s.activeJobId,
          };
        }),

      coverLetters: [],
      addCoverLetter: (cl) => set((s) => ({ coverLetters: [cl, ...s.coverLetters] })),
      updateCoverLetter: (id, patch) =>
        set((s) => ({
          coverLetters: s.coverLetters.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c,
          ),
        })),
      deleteCoverLetter: (id) =>
        set((s) => ({ coverLetters: s.coverLetters.filter((c) => c.id !== id) })),

      conversations: [],
      activeConversationId: "",
      activeConversation: () => {
        const s = get();
        return s.conversations.find((c) => c.id === s.activeConversationId) ?? s.conversations[0];
      },
      setActiveConversation: (id) => set({ activeConversationId: id }),
      createConversation: () => {
        const id = uid("conv");
        const now = new Date().toISOString();
        const conv: AIConversation = {
          id,
          title: "New conversation",
          messages: [],
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ conversations: [conv, ...s.conversations], activeConversationId: id }));
        return id;
      },
      appendMessage: (id, msg) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id
              ? {
                  ...c,
                  messages: [...c.messages, msg],
                  updatedAt: new Date().toISOString(),
                  title:
                    c.messages.length === 0 && msg.role === "user"
                      ? msg.content.slice(0, 48)
                      : c.title,
                }
              : c,
          ),
        })),
      updateMessage: (convId, msgId, patch) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  messages: c.messages.map((m) => (m.id === msgId ? { ...m, ...patch } : m)),
                }
              : c,
          ),
        })),
      deleteConversation: (id) =>
        set((s) => ({ conversations: s.conversations.filter((c) => c.id !== id) })),

      applications: [
        { id: "app1", company: "Anthropic", role: "Senior SWE", status: "interview", url: "", appliedAt: new Date(Date.now() - 86400000 * 3).toISOString() },
        { id: "app2", company: "Linear", role: "Frontend Engineer", status: "applied", appliedAt: new Date(Date.now() - 86400000 * 8).toISOString() },
        { id: "app3", company: "Vercel", role: "Platform Engineer", status: "saved" },
      ],
      addApplication: (a) => set((s) => ({ applications: [a, ...s.applications] })),
      updateApplication: (id, patch) =>
        set((s) => ({
          applications: s.applications.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
      deleteApplication: (id) =>
        set((s) => ({ applications: s.applications.filter((a) => a.id !== id) })),

      activity: [],
      log: (action, meta) =>
        set((s) => ({
          activity: [
            { id: uid("log"), action, meta, createdAt: new Date().toISOString() },
            ...s.activity,
          ].slice(0, 100),
        })),

      hydrate: () => {
        
        if (get().resumes.length === 0) {
          set({ resumes: [sampleResumeDoc()], activeResumeId: "resume-sample" });
        }
      },
    }),
    {
      name: "resume-platform-v1",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : ({
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
              length: 0,
              clear: () => {},
              key: () => null,
            } as Storage),
      ),
      
      
      
      skipHydration: true,
      partialize: (s) => ({
        resumes: s.resumes,
        activeResumeId: s.activeResumeId,
        versions: s.versions,
        atsReports: s.atsReports,
        jobDescriptions: s.jobDescriptions,
        activeJobId: s.activeJobId,
        coverLetters: s.coverLetters,
        conversations: s.conversations,
        activeConversationId: s.activeConversationId,
        applications: s.applications,
        activity: s.activity,
      }),
    },
  ),
);

export { uid };

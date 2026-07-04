
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  ScanSearch,
  Target,
  Sparkles,
  Mail,
  GitBranch,
  MessageSquare,
  Code2,
  Briefcase,
  Menu,
  X,
  Command as CommandIcon,
  Plus,
  Star,
} from "lucide-react";
import { useStore, type ViewId } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandPalette } from "@/components/command-palette";
import { ResumeManager } from "@/components/resume-manager";
import { toast } from "sonner";

interface NavItem {
  id: ViewId;
  label: string;
  icon: React.ElementType;
  hint: string;
  group: string;
}

export const NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, hint: "Overview & analytics", group: "Overview" },
  { id: "builder", label: "Resume Builder", icon: FileText, hint: "Edit & preview", group: "Build" },
  { id: "ats", label: "ATS Checker", icon: ScanSearch, hint: "Score your resume", group: "Analyze" },
  { id: "matcher", label: "Job Matcher", icon: Target, hint: "Match a job description", group: "Analyze" },
  { id: "optimizer", label: "AI Optimizer", icon: Sparkles, hint: "Rewrite & improve", group: "AI" },
  { id: "cover-letter", label: "Cover Letter", icon: Mail, hint: "Generate letters", group: "AI" },
  { id: "chat", label: "AI Assistant", icon: MessageSquare, hint: "Chat with AI", group: "AI" },
  { id: "latex", label: "LaTeX Studio", icon: Code2, hint: "Edit & export LaTeX", group: "Export" },
  { id: "versions", label: "Versions", icon: GitBranch, hint: "Save & restore", group: "Manage" },
  { id: "applications", label: "Applications", icon: Briefcase, hint: "Track applications", group: "Manage" },
];

const KEYMAP: Record<string, ViewId> = {
  "1": "dashboard",
  "2": "builder",
  "3": "ats",
  "4": "matcher",
  "5": "optimizer",
  "6": "cover-letter",
  "7": "chat",
  "8": "latex",
  "9": "versions",
  "0": "applications",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { view, setView, sidebarOpen, setSidebarOpen, setCommandOpen, resumes, activeResumeId, setActiveResume, createResume, log } = useStore();

  
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.tagName === "SELECT";

      
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(true);
        return;
      }
      if (typing) return;

      
      if ((e.metaKey || e.ctrlKey) && KEYMAP[e.key]) {
        e.preventDefault();
        setView(KEYMAP[e.key]);
        return;
      }
      if (e.key >= "0" && e.key <= "9" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const v = KEYMAP[e.key];
        if (v) {
          setView(v);
          toast.success(`Switched to ${NAV.find((n) => n.id === v)?.label}`, { duration: 1200 });
        }
      }
      if (e.key === "?" && e.shiftKey) {
        toast.info("Press 1–9 to navigate · ⌘K for command palette", { duration: 3000 });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setView, setCommandOpen]);

  const activeResume = resumes.find((r) => r.id === activeResumeId) ?? resumes[0];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex flex-1 min-h-0">
        {}
        <aside
          className={cn(
            "hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar/50 backdrop-blur",
            "sticky top-0 h-screen",
          )}
        >
          <SidebarContent
            view={view}
            onNavigate={(v) => {
              setView(v);
              setSidebarOpen(false);
            }}
            resumes={resumes}
            activeResumeId={activeResumeId}
            setActiveResume={setActiveResume}
            onCreateResume={() => {
              const id = createResume("Untitled Resume");
              toast.success("New resume created");
              setView("builder");
              void id;
            }}
          />
        </aside>

        {}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                className="fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-border lg:hidden flex flex-col"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 26, stiffness: 240 }}
              >
                <SidebarContent
                  view={view}
                  onNavigate={(v) => {
                    setView(v);
                    setSidebarOpen(false);
                  }}
                  resumes={resumes}
                  activeResumeId={activeResumeId}
                  setActiveResume={setActiveResume}
                  onCreateResume={() => {
                    createResume("Untitled Resume");
                    toast.success("New resume created");
                    setView("builder");
                    setSidebarOpen(false);
                  }}
                  onClose={() => setSidebarOpen(false)}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {}
        <div className="flex-1 min-w-0 flex flex-col">
          {}
          <header className="sticky top-0 z-30 h-14 border-b border-border glass flex items-center gap-2 px-3 sm:px-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium truncate max-w-[40vw] sm:max-w-xs">
                {activeResume?.title ?? "No resume"}
              </span>
              {activeResume?.isFavorite && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />}
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex gap-2 text-xs"
                onClick={() => setCommandOpen(true)}
              >
                <CommandIcon className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Search</span>
                <kbd className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
              </Button>
              <ThemeToggle />
            </div>
          </header>

          {}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>

          {}
          <footer className="mt-auto border-t border-border bg-background/80 backdrop-blur py-3 px-4 text-xs text-muted-foreground flex flex-col items-center justify-center gap-1 no-print">
            <p className="text-center">
              © 2026 <span className="font-medium text-foreground">ResuMind</span> by Pallavi Thakur | All Rights Reserved
            </p>
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <span><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">1–9</kbd> navigate</span>
              <span><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">⌘K</kbd> command</span>
            </div>
          </footer>
        </div>
      </div>

      <CommandPalette />
    </div>
  );
}

function SidebarContent({
  view,
  onNavigate,
  resumes,
  activeResumeId,
  setActiveResume,
  onCreateResume,
  onClose,
}: {
  view: ViewId;
  onNavigate: (v: ViewId) => void;
  resumes: { id: string; title: string; isFavorite?: boolean }[];
  activeResumeId: string;
  setActiveResume: (id: string) => void;
  onCreateResume: () => void;
  onClose?: () => void;
}) {
  const groups = Array.from(new Set(NAV.map((n) => n.group)));
  return (
    <div className="flex flex-col h-full">
      {}
      <div className="h-14 flex items-center gap-2 px-4 border-b border-border shrink-0">
        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          R
        </div>
        <span className="font-semibold tracking-tight">ResuMind</span>
        {onClose && (
          <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {}
      <div className="p-3 border-b border-border shrink-0">
        <ResumeManager
          activeResumeId={activeResumeId}
          setActiveResume={setActiveResume}
          onCreateResume={onCreateResume}
        />
      </div>

      {}
      <nav className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-4">
        {groups.map((group) => (
          <div key={group}>
            <p className="px-2 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              {group}
            </p>
            <div className="space-y-0.5">
              {NAV.filter((n) => n.group === group).map((item) => {
                const active = view === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors group",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                    title={item.hint}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", active && "text-emerald-500")} />
                    <span className="truncate">{item.label}</span>
                    <kbd className="ml-auto text-[10px] font-mono text-muted-foreground/60 group-hover:text-muted-foreground">
                      {NAV.indexOf(item) + 1 <= 9 ? NAV.indexOf(item) + 1 : ""}
                    </kbd>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-border text-[10px] text-muted-foreground shrink-0">
        <p>ResuMind by Pallavi Thakur | All Rights Reserved</p>
      </div>
    </div>
  );
}

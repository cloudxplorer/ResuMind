
"use client";

import * as React from "react";
import { Download, FileText, Loader2, Code2, FileJson, FileDown, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { toHTML, toJSON, toLatex, downloadFile, PAGE_SIZES, type PageSize } from "@/lib/export";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type ExportKind = "pdf" | "latex-pdf" | "latex" | "json" | "docx";

interface ExportOption {
  kind: ExportKind;
  label: string;
  desc: string;
  icon: React.ElementType;
  badge?: string;
}

const OPTIONS: ExportOption[] = [
  { kind: "pdf", label: "ATS-Friendly PDF", desc: "Server-rendered, single-column, parser-optimized", icon: FileText, badge: "Recommended" },
  { kind: "latex-pdf", label: "LaTeX → PDF", desc: "Server-compiled LaTeX (Jake's template)", icon: Code2, badge: "Real LaTeX" },
  { kind: "latex", label: "LaTeX Source (.tex)", desc: "Overleaf-ready, 3 variants", icon: Code2 },
  { kind: "json", label: "JSON", desc: "Portable structured data", icon: FileJson },
  { kind: "docx", label: "DOCX", desc: "Word-compatible HTML", icon: FileDown },
];

export function ExportModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { activeResume, log } = useStore();
  const resume = activeResume();
  const [loading, setLoading] = React.useState<ExportKind | null>(null);
  const [done, setDone] = React.useState<ExportKind | null>(null);
  const [pageSize, setPageSize] = React.useState<PageSize>("letter");

  React.useEffect(() => {
    if (!open) { setLoading(null); setDone(null); }
  }, [open]);

  async function handleExport(kind: ExportKind) {
    setLoading(kind); setDone(null);
    log("export", { kind, pageSize });
    const safe = resume.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    try {
      if (kind === "pdf" || kind === "latex-pdf") {
        const endpoint = kind === "pdf" ? "/api/pdf" : "/api/latex-pdf";
        const body = kind === "latex-pdf"
          ? { doc: resume, variant: "jake" as const, pageSize }
          : { doc: resume, pageSize };
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Export failed" }));
          throw new Error(err.error || `HTTP ${res.status}`);
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${safe}${kind === "latex-pdf" ? "-latex" : ""}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      } else if (kind === "latex") {
        downloadFile(`${safe}.tex`, toLatex(resume), "application/x-tex");
      } else if (kind === "json") {
        downloadFile(`${safe}.json`, toJSON(resume), "application/json");
      } else if (kind === "docx") {
        downloadFile(`${safe}.doc`, toHTML(resume), "application/msword");
      }
      setDone(kind);
      toast.success(`${OPTIONS.find((o) => o.kind === kind)?.label} exported`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Download className="h-5 w-5" /> Export resume</DialogTitle>
          <DialogDescription>Choose a format and page size. The ATS-Friendly PDF is recommended for job applications.</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          <span className="text-xs font-medium text-muted-foreground mr-1">Page size:</span>
          <div className="flex gap-1 flex-wrap">
            {PAGE_SIZES.map((ps) => (
              <button
                key={ps.id}
                onClick={() => setPageSize(ps.id)}
                className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors ${pageSize === ps.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                title={`${ps.label} (${ps.dimensions})`}
              >
                {ps.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isLoading = loading === opt.kind;
            const isDone = done === opt.kind;
            return (
              <button
                key={opt.kind}
                onClick={() => handleExport(opt.kind)}
                disabled={loading !== null}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all text-left disabled:opacity-50 group"
              >
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-emerald-500" /> : isDone ? <Check className="h-4 w-4 text-emerald-500" /> : <Icon className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{opt.label}</span>
                    {opt.badge && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">{opt.badge}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

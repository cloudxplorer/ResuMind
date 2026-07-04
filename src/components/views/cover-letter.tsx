
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, Sparkles, Copy, Trash2, Plus, FileDown } from "lucide-react";
import { useStore, uid } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { downloadFile } from "@/lib/export";
import type { CoverLetter } from "@/lib/types";

const TONES = ["professional", "enthusiastic", "concise", "narrative", "bold"];

export function CoverLetterView() {
  const { activeResume, jobDescriptions, activeJobId, setActiveJob, coverLetters, addCoverLetter, updateCoverLetter, deleteCoverLetter, log } = useStore();
  const resume = activeResume();
  const job = jobDescriptions.find((j) => j.id === activeJobId);
  const [tone, setTone] = React.useState("professional");
  const [loading, setLoading] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(coverLetters[0]?.id ?? null);
  const active = coverLetters.find((c) => c.id === activeId);

  async function generate() {
    if (!job) { toast.error("Select a job description first"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task: "cover-letter", payload: { resumeData: resume.data, jobDescription: job.content, tone } }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      const cl: CoverLetter = { id: uid("cl"), resumeId: resume.id, jobDescId: job.id, title: data.title || `Cover letter — ${job.title}`, content: data.content, tone, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      addCoverLetter(cl);
      setActiveId(cl.id);
      log("ai.cover-letter", { job: job.title });
      toast.success("Cover letter generated");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Generation failed"); }
    finally { setLoading(false); }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1300px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Cover Letter Generator</h1>
          <p className="text-muted-foreground text-sm mt-1">AI-generated, specific to your resume and the target role. Editable after generation.</p>
        </div>
        <Button size="sm" onClick={generate} disabled={loading || !job}>
          {loading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1.5" />}
          Generate
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Settings</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">Target job</Label>
            <Select value={activeJobId} onValueChange={setActiveJob}>
              <SelectTrigger className="h-9 mt-0.5"><SelectValue placeholder="Select job" /></SelectTrigger>
              <SelectContent>
                {jobDescriptions.map((j) => <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="h-9 mt-0.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TONES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        {}
        <Card className="h-fit">
          <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm">Saved letters</CardTitle>
            <Badge variant="secondary">{coverLetters.length}</Badge>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {coverLetters.length === 0 && <p className="text-xs text-muted-foreground">No letters yet. Generate one.</p>}
            {coverLetters.map((c) => (
              <button key={c.id} onClick={() => setActiveId(c.id)} className={`w-full text-left p-2.5 rounded-lg border transition-colors ${activeId === c.id ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:border-emerald-500/40"}`}>
                <p className="text-sm font-medium truncate">{c.title}</p>
                <p className="text-xs text-muted-foreground capitalize">{c.tone} · {new Date(c.createdAt).toLocaleDateString()}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">{active?.title ?? "No letter selected"}</CardTitle>
              <CardDescription>{active ? `Resume: ${resume.title} · Tone: ${active.tone}` : "Generate or select a letter"}</CardDescription>
            </div>
            {active && (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Copy" onClick={() => { navigator.clipboard.writeText(active.content); toast.success("Copied"); }}><Copy className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Download" onClick={() => downloadFile(`${active.title}.txt`, active.content)}><FileDown className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="Delete" onClick={() => { deleteCoverLetter(active.id); setActiveId(null); }}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!active ? (
              <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                <Mail className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm">Generate a cover letter to start editing.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Input value={active.title} onChange={(e) => updateCoverLetter(active.id, { title: e.target.value })} className="h-9" />
                <Textarea value={active.content} onChange={(e) => updateCoverLetter(active.id, { content: e.target.value })} rows={20} className="resize-y text-sm leading-relaxed" />
                <p className="text-xs text-muted-foreground">{active.content.trim().split(/\s+/).filter(Boolean).length} words</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

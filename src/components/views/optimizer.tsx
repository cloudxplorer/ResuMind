
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, Loader2, Check, X, ArrowRight, Star, Award, KeyRound, Zap } from "lucide-react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ImprovedBullet } from "@/lib/ai";

export function OptimizerView() {
  const { activeResume, jobDescriptions, activeJobId, updateActiveData, log, setView } = useStore();
  const resume = activeResume();
  const job = jobDescriptions.find((j) => j.id === activeJobId);

  const [summaryLoading, setSummaryLoading] = React.useState(false);
  const [summaryDraft, setSummaryDraft] = React.useState<string | null>(null);

  const [bulletsLoading, setBulletsLoading] = React.useState(false);
  const [bulletResults, setBulletResults] = React.useState<Record<string, ImprovedBullet[]> | null>(null);

  const [tailorLoading, setTailorLoading] = React.useState(false);
  const [tailorDraft, setTailorDraft] = React.useState<{ summary: string; experience: { id: string; bullets: string[] }[]; notes: string[] } | null>(null);

  const [suggestLoading, setSuggestLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<{ missingSkills: string[]; certifications: string[]; keywords: string[]; actionVerbs: string[]; summary: string } | null>(null);

  async function post(task: string, payload: Record<string, unknown>) {
    const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task, payload }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "AI request failed");
    return data;
  }

  async function rewriteSummary() {
    setSummaryLoading(true); setSummaryDraft(null);
    try {
      const r = await post("rewrite", { kind: "summary", text: resume.data.summary, context: { role: resume.data.contact.title, jobDescription: job?.content } });
      setSummaryDraft(r.after);
      log("ai.rewrite-summary", {});
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setSummaryLoading(false); }
  }

  async function improveBullets() {
    setBulletsLoading(true); setBulletResults(null);
    try {
      const all = resume.data.experience;
      const flat = all.flatMap((e) => e.bullets);
      const r = await post("improve-bullets", { bullets: flat });
      
      const map: Record<string, ImprovedBullet[]> = {};
      let idx = 0;
      for (const e of all) {
        map[e.id] = r.items.slice(idx, idx + e.bullets.length);
        idx += e.bullets.length;
      }
      setBulletResults(map);
      log("ai.improve-bullets", { count: flat.length });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBulletsLoading(false); }
  }

  async function tailor() {
    if (!job) { toast.error("Select a job description first (Job Matcher)"); setView("matcher"); return; }
    setTailorLoading(true); setTailorDraft(null);
    try {
      const r = await post("tailor", { resumeData: resume.data, jobDescription: job.content });
      setTailorDraft(r);
      log("ai.tailor", { job: job.title });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setTailorLoading(false); }
  }

  async function suggest() {
    setSuggestLoading(true); setSuggestions(null);
    try {
      const r = await post("suggestions", { resumeData: resume.data, jobDescription: job?.content });
      setSuggestions(r);
      log("ai.suggestions", {});
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setSuggestLoading(false); }
  }

  function applySummary() {
    if (summaryDraft) { updateActiveData({ summary: summaryDraft }); setSummaryDraft(null); toast.success("Summary applied"); }
  }
  function applyBullet(expId: string, idx: number) {
    if (!bulletResults?.[expId]?.[idx]) return;
    const improved = bulletResults[expId][idx].improved;
    updateActiveData({
      experience: resume.data.experience.map((e) => e.id === expId ? { ...e, bullets: e.bullets.map((b, j) => (j === idx ? improved : b)) } : e),
    });
    setBulletResults((prev) => {
      if (!prev) return prev;
      const next = { ...prev };
      next[expId] = next[expId].filter((_, i) => i !== idx);
      return next;
    });
    toast.success("Bullet applied");
  }
  function applyTailor() {
    if (!tailorDraft) return;
    updateActiveData({
      summary: tailorDraft.summary,
      experience: resume.data.experience.map((e) => {
        const t = tailorDraft.experience.find((x) => x.id === e.id);
        return t ? { ...e, bullets: t.bullets } : e;
      }),
    });
    setTailorDraft(null);
    toast.success("Tailored resume applied");
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">AI Optimizer</h1>
        <p className="text-muted-foreground text-sm mt-1">Powered by <span className="font-mono text-xs">openai/gpt-oss-120b</span> via the AI router. Returns structured JSON only — every suggestion is reviewable before applying.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base flex items-center gap-2"><Wand2 className="h-4 w-4 text-emerald-500" /> Rewrite summary</CardTitle>
              <CardDescription>Sharpen your professional summary</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={rewriteSummary} disabled={summaryLoading}>
              {summaryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Current</p>
              <p className="text-sm text-muted-foreground line-clamp-3">{resume.data.summary}</p>
            </div>
            <AnimatePresence>
              {summaryDraft && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                  <div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Proposed</p>
                    <Textarea value={summaryDraft} onChange={(e) => setSummaryDraft(e.target.value)} rows={4} className="text-sm" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={applySummary}><Check className="h-3.5 w-3.5 mr-1" /> Apply</Button>
                    <Button size="sm" variant="ghost" onClick={() => setSummaryDraft(null)}><X className="h-3.5 w-3.5 mr-1" /> Discard</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base flex items-center gap-2"><Award className="h-4 w-4 text-amber-500" /> Suggest improvements</CardTitle>
              <CardDescription>Skills, certs, keywords, verbs{job ? ` · vs ${job.title}` : ""}</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={suggest} disabled={suggestLoading}>
              {suggestLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            {!suggestions ? (
              <p className="text-sm text-muted-foreground">Run to get targeted suggestions for your target role.</p>
            ) : (
              <div className="space-y-3 text-sm">
                {suggestions.summary && <p className="text-muted-foreground">{suggestions.summary}</p>}
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><KeyRound className="h-3 w-3" /> Missing skills</p>
                  <div className="flex flex-wrap gap-1">{suggestions.missingSkills.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}</div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Award className="h-3 w-3" /> Certifications</p>
                  <div className="flex flex-wrap gap-1">{suggestions.certifications.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}</div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Zap className="h-3 w-3" /> Stronger action verbs</p>
                  <div className="flex flex-wrap gap-1">{suggestions.actionVerbs.map((s) => <Badge key={s} className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">{s}</Badge>)}</div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><KeyRound className="h-3 w-3" /> Keywords to add</p>
                  <div className="flex flex-wrap gap-1">{suggestions.keywords.map((s) => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" /> Improve bullets (STAR + quantification)</CardTitle>
            <CardDescription>Convert responsibilities into achievements across all experience</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={improveBullets} disabled={bulletsLoading}>
            {bulletsLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Sparkles className="h-4 w-4 mr-1.5" />}
            Improve all
          </Button>
        </CardHeader>
        <CardContent>
          {!bulletResults ? (
            <p className="text-sm text-muted-foreground">Run to rewrite every bullet with stronger action verbs and inferred metrics.</p>
          ) : (
            <div className="space-y-4">
              {resume.data.experience.map((e) => {
                const items = bulletResults[e.id];
                if (!items || items.length === 0) return null;
                return (
                  <div key={e.id}>
                    <p className="text-sm font-medium mb-2">{e.role} · {e.company}</p>
                    <div className="space-y-2">
                      {items.map((it, i) => (
                        <div key={i} className="p-3 rounded-lg border border-border bg-card/50">
                          <p className="text-xs text-muted-foreground line-through">{it.original}</p>
                          <p className="text-sm mt-1">{it.improved}</p>
                          {it.metric && <Badge className="mt-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs">metric: {it.metric}</Badge>}
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline" onClick={() => applyBullet(e.id, i)}><Check className="h-3.5 w-3.5 mr-1" /> Apply</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base flex items-center gap-2"><ArrowRight className="h-4 w-4 text-emerald-500" /> Tailor resume to job</CardTitle>
            <CardDescription>{job ? `Tailoring for: ${job.title}` : "Select a job in the Job Matcher first"}</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={tailor} disabled={tailorLoading || !job}>
            {tailorLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Sparkles className="h-4 w-4 mr-1.5" />}
            Tailor
          </Button>
        </CardHeader>
        <CardContent>
          {!tailorDraft ? (
            <p className="text-sm text-muted-foreground">Rewrites summary + experience bullets to mirror the job description. Review before applying.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Proposed summary</p>
                <Textarea value={tailorDraft.summary} onChange={(e) => setTailorDraft({ ...tailorDraft, summary: e.target.value })} rows={3} className="text-sm" />
              </div>
              {tailorDraft.experience.map((t) => {
                const e = resume.data.experience.find((x) => x.id === t.id);
                if (!e) return null;
                return (
                  <div key={t.id}>
                    <p className="text-sm font-medium mb-1">{e.role} · {e.company}</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {t.bullets.map((b, i) => <li key={i} className="pl-3 border-l-2 border-emerald-500/30">{b}</li>)}
                    </ul>
                  </div>
                );
              })}
              {tailorDraft.notes.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-0.5">{tailorDraft.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
                </div>
              )}
              <div className="flex gap-2">
                <Button size="sm" onClick={applyTailor}><Check className="h-3.5 w-3.5 mr-1" /> Apply all</Button>
                <Button size="sm" variant="ghost" onClick={() => setTailorDraft(null)}><X className="h-3.5 w-3.5 mr-1" /> Discard</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, RefreshCw, CheckCircle2, AlertTriangle, XCircle, TrendingUp, ListChecks, Type, Hash, BookOpen } from "lucide-react";
import { useStore, uid } from "@/lib/store";
import { scoreResume } from "@/lib/ats";
import type { ATSReport } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScoreGauge, ScoreBar } from "@/components/score-gauge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ATSCheckerView() {
  const { activeResume, jobDescriptions, activeJobId, setActiveJob, saveJobDescription, addATSReport, log } = useStore();
  const resume = activeResume();
  const job = jobDescriptions.find((j) => j.id === activeJobId);
  const [jdText, setJdText] = React.useState(job?.content ?? "");
  const [useJob, setUseJob] = React.useState(false);
  const [explaining, setExplaining] = React.useState(false);
  const [explanation, setExplanation] = React.useState<string | undefined>();

  const report = React.useMemo(
    () => scoreResume({ data: resume.data }, useJob && jdText ? { jobDescription: jdText } : {}),
    [resume.data, useJob, jdText],
  );

  function statusIcon(status: "pass" | "warn" | "fail") {
    if (status === "pass") return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    if (status === "warn") return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    return <XCircle className="h-4 w-4 text-rose-500" />;
  }

  async function runExplain() {
    setExplaining(true);
    setExplanation(undefined);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "explain", payload: { report } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setExplanation(data.explanation);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI explanation failed");
    } finally {
      setExplaining(false);
    }
  }

  function saveReport() {
    const r: ATSReport = {
      id: uid("ats"),
      resumeId: resume.id,
      jobDescId: job?.id,
      overall: report.overall,
      keyword: report.keyword,
      formatting: report.formatting,
      sections: report.sections,
      semantic: report.semantic,
      readability: report.readability,
      grammar: report.grammar,
      details: report.details,
      aiExplanation: explanation,
      createdAt: new Date().toISOString(),
    };
    addATSReport(r);
    log("ats.run", { overall: r.overall, resumeId: r.resumeId });
    toast.success("Report saved to history");
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1300px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">ATS Checker</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Deterministic scoring across formatting, sections, keywords, readability and grammar. The AI only explains — it never invents scores.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={saveReport}><RefreshCw className="h-4 w-4 mr-1.5" /> Save report</Button>
          <Button size="sm" onClick={runExplain} disabled={explaining}>
            {explaining ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1.5" />}
            AI explain
          </Button>
        </div>
      </div>

      {}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Optional: compare against a job description</CardTitle>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={useJob} onChange={(e) => setUseJob(e.target.checked)} className="accent-emerald-500" />
              Use for keyword scoring
            </label>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-2">
            {jobDescriptions.map((j) => (
              <Badge key={j.id} variant={j.id === activeJobId ? "default" : "secondary"} className="cursor-pointer" onClick={() => { setActiveJob(j.id); setJdText(j.content); setUseJob(true); }}>
                {j.title}
              </Badge>
            ))}
          </div>
          <Textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            rows={4}
            placeholder="Paste a job description to score keyword & semantic match…"
            className="resize-y text-sm"
          />
        </CardContent>
      </Card>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="flex flex-col items-center">
          <CardHeader className="pb-2 w-full">
            <CardTitle className="text-sm text-muted-foreground">Overall ATS score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ScoreGauge value={report.overall} label="Overall" />
            <p className="text-xs text-muted-foreground mt-2">Weighted: 30% keywords · 20% format · 20% sections · 15% semantic · 10% readability · 5% grammar</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Sub-scores</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-2">
              <ScoreBar label="Keyword match" value={report.keyword} hint={useJob ? "vs pasted JD" : "self-coverage of declared skills"} />
              <ScoreBar label="Formatting" value={report.formatting} hint="ATS-compatible layout signals" />
              <ScoreBar label="Sections" value={report.sections} hint="Completeness of required sections" />
              <ScoreBar label="Semantic" value={report.semantic} hint={useJob ? "TF-IDF cosine vs JD" : "summary↔resume consistency"} />
              <ScoreBar label="Readability" value={report.readability} hint={`Flesch ease ${Math.round(report.details.readabilityScore)} · grade ${report.details.gradeLevel}`} />
              <ScoreBar label="Grammar" value={report.grammar} hint="Heuristic capitalization & phrasing" />
            </div>
          </CardContent>
        </Card>
      </div>

      {}
      {explanation && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-emerald-500/30 bg-emerald-500/[0.03]">
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-emerald-500" /> AI explanation</CardTitle></CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{explanation}</div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><ListChecks className="h-4 w-4" /> Section completeness</CardTitle></CardHeader>
          <CardContent className="space-y-2.5">
            {report.details.sectionChecks.map((c) => (
              <div key={c.id} className="flex items-start gap-2.5">
                <span className="mt-0.5">{statusIcon(c.status)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{c.message}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Type className="h-4 w-4" /> Bullet & language analysis</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Quantified bullets</p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${report.details.totalBullets ? (report.details.quantifiedBullets / report.details.totalBullets) * 100 : 0}%` }} />
                </div>
                <span className="text-xs tabular-nums">{report.details.quantifiedBullets}/{report.details.totalBullets}</span>
              </div>
            </div>
            {report.details.actionVerbsFound.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Action verbs found</p>
                <div className="flex flex-wrap gap-1">
                  {report.details.actionVerbsFound.map((v) => <Badge key={v} variant="outline" className="text-xs">{v}</Badge>)}
                </div>
              </div>
            )}
            {report.details.weakPhrases.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Weak phrases to replace</p>
                <div className="flex flex-wrap gap-1">
                  {report.details.weakPhrases.map((v) => <Badge key={v} variant="destructive" className="text-xs">{v}</Badge>)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {}
      {useJob && jdText && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-500" /> Matched keywords</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {report.details.matchedKeywords.length ? report.details.matchedKeywords.map((k) => <Badge key={k} className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">{k}</Badge>) : <p className="text-sm text-muted-foreground">None matched.</p>}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Hash className="h-4 w-4 text-rose-500" /> Missing keywords</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {report.details.missingKeywords.length ? report.details.missingKeywords.map((k) => <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>) : <p className="text-sm text-muted-foreground">No gaps detected.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4" /> Recommendations</CardTitle><CardDescription>Deterministic, ordered by impact</CardDescription></CardHeader>
        <CardContent className="space-y-2">
          {report.details.suggestions.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-semibold">{i + 1}</span>
              <span className="text-muted-foreground">{s}</span>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

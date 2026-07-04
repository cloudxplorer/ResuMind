
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Target, Loader2, Sparkles, CheckCircle2, AlertCircle, Building2, Clock, TrendingUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { matchJob } from "@/lib/ats";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScoreGauge, ScoreBar } from "@/components/score-gauge";
import { toast } from "sonner";

export function MatcherView() {
  const { activeResume, jobDescriptions, activeJobId, setActiveJob, saveJobDescription, updateJobDescription, log } = useStore();
  const resume = activeResume();
  const job = jobDescriptions.find((j) => j.id === activeJobId);
  const [title, setTitle] = React.useState(job?.title ?? "");
  const [content, setContent] = React.useState(job?.content ?? "");

  const result = React.useMemo(() => {
    if (!content.trim()) return null;
    return matchJob(resume.data, { title: title || "Job", content });
  }, [resume.data, title, content]);

  function save() {
    if (!content.trim()) { toast.error("Paste a job description first"); return; }
    if (job) {
      updateJobDescription(job.id, { title: title || "Untitled job", content });
      toast.success("Updated job description");
    } else {
      saveJobDescription(title || "Untitled job", content);
      toast.success("Saved job description");
    }
    log("job.save", { title });
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1300px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Job Description Matcher</h1>
          <p className="text-muted-foreground text-sm mt-1">Deterministic keyword + TF-IDF semantic matching against your active resume.</p>
        </div>
        <Button size="sm" onClick={save}><Target className="h-4 w-4 mr-1.5" /> Save job</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Job description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Software Engineer" className="h-9 mt-0.5" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Full job description</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16} placeholder="Paste the job description here…" className="resize-y text-sm mt-0.5" />
            </div>
            {jobDescriptions.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Saved jobs</Label>
                <div className="flex flex-wrap gap-1.5">
                  {jobDescriptions.map((j) => (
                    <Badge key={j.id} variant={j.id === activeJobId ? "default" : "secondary"} className="cursor-pointer" onClick={() => { setActiveJob(j.id); setTitle(j.title); setContent(j.content); }}>
                      {j.title}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Match analysis</CardTitle></CardHeader>
          <CardContent>
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-muted-foreground">
                <Target className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm">Paste a job description to compute your match.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <ScoreGauge value={result.overallMatch} size={120} label="Overall" />
                  <div className="flex-1 space-y-2">
                    <ScoreBar label="Keyword match" value={result.keywordMatch} />
                    <ScoreBar label="Semantic similarity" value={result.semanticSimilarity} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> Seniority</p>
                    <p className="text-lg font-semibold mt-1">{result.seniorityMatch.level}</p>
                    <p className="text-xs text-muted-foreground">signal score {result.seniorityMatch.score}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Experience</p>
                    <p className="text-lg font-semibold mt-1">{result.experienceMatch.actual}y / {result.experienceMatch.required || "?"}y</p>
                    <p className="text-xs text-muted-foreground">match {result.experienceMatch.score}%</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Matched keywords</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedKeywords.length ? result.matchedKeywords.map((k) => <Badge key={k} className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">{k}</Badge>) : <p className="text-sm text-muted-foreground">None.</p>}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertCircle className="h-4 w-4 text-amber-500" /> Missing keywords</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords.length ? result.missingKeywords.map((k) => <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>) : <p className="text-sm text-muted-foreground">No gaps — excellent.</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Recommendations</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {result.recommendations.map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-semibold">{i + 1}</span>
                  <span className="text-muted-foreground">{r}</span>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {result.requiredTechnologies.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Required technologies detected in JD</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {result.requiredTechnologies.map((t) => {
                    const matched = result.matchedKeywords.includes(t);
                    return <Badge key={t} variant={matched ? "default" : "outline"} className="text-xs">{matched ? "✓ " : ""}{t}</Badge>;
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}


"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Target,
  GitBranch,
  FileText,
  Briefcase,
  LayoutGrid,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { scoreResume } from "@/lib/ats";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreGauge, ScoreBar } from "@/components/score-gauge";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { timeAgo } from "@/components/utils";
import { PdfUploadButton } from "@/components/pdf-upload-button";
import { ExportBar } from "@/components/export-bar";
import { SampleGallery } from "@/components/sample-gallery";
import type { ResumeData } from "@/lib/types";

export function DashboardView() {
  const { activeResume, jobDescriptions, activeJobId, atsReports, versions, applications, activity, setView, createResume, setActiveResume } = useStore();
  const resume = activeResume();
  const job = jobDescriptions.find((j) => j.id === activeJobId);
  const [sampleOpen, setSampleOpen] = React.useState(false);

  
  const report = React.useMemo(
    () => scoreResume({ data: resume.data }),
    [resume.data],
  );
  const matchReport = React.useMemo(
    () => (job ? scoreResume({ data: resume.data }, { jobDescription: job.content }) : null),
    [resume.data, job],
  );

  const scoreHistory = React.useMemo(() => {
    const base = atsReports.filter((r) => r.resumeId === resume.id).slice(0, 8).reverse();
    return [
      ...base.map((r) => ({ name: timeAgo(r.createdAt), score: r.overall })),
      { name: "Now", score: report.overall },
    ];
  }, [atsReports, resume.id, report.overall]);

  const subScores = [
    { name: "Keyword", value: report.keyword, fill: "var(--chart-1)" },
    { name: "Format", value: report.formatting, fill: "var(--chart-2)" },
    { name: "Sections", value: report.sections, fill: "var(--chart-3)" },
    { name: "Semantic", value: report.semantic, fill: "var(--chart-4)" },
    { name: "Readability", value: report.readability, fill: "var(--chart-5)" },
  ];

  const appCounts = React.useMemo(() => {
    const c: Record<string, number> = { saved: 0, applied: 0, interview: 0, offer: 0, rejected: 0 };
    applications.forEach((a) => (c[a.status] = (c[a.status] || 0) + 1));
    return c;
  }, [applications]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Live ATS snapshot of <span className="text-foreground font-medium">{resume.title}</span>. Scores are deterministic — AI explains, never invents.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setSampleOpen(true)}>
            <LayoutGrid className="h-4 w-4 mr-1.5" /> Templates
          </Button>
          <PdfUploadButton
            label="Import PDF"
            variant="outline"
            size="sm"
            onStructured={(data: ResumeData) => {
              const title = data.contact?.name
                ? `${data.contact.name}${data.contact.title ? " — " + data.contact.title : ""}`
                : "Imported resume";
              const id = createResume(title, data);
              setActiveResume(id);
              setView("builder");
            }}
          />
          <ExportBar label="Download" size="sm" />
          <Button variant="outline" size="sm" onClick={() => setView("ats")}>
            <Sparkles className="h-4 w-4 mr-1.5" /> Run full analysis
          </Button>
          <Button size="sm" onClick={() => setView("optimizer")}>
            <Target className="h-4 w-4 mr-1.5" /> Optimize
          </Button>
        </div>
      </div>

      <SampleGallery open={sampleOpen} onOpenChange={setSampleOpen} />

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">ATS Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-2">
            <ScoreGauge value={report.overall} label="Overall" sublabel="deterministic" />
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {report.details.sectionChecks.filter((s) => s.status === "pass").length} pass</span>
              <span className="flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> {report.details.sectionChecks.filter((s) => s.status === "warn").length} warn</span>
              <span className="flex items-center gap-1"><XCircle className="h-3.5 w-3.5 text-rose-500" /> {report.details.sectionChecks.filter((s) => s.status === "fail").length} fail</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sub-score breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-2">
              {subScores.map((s) => (
                <ScoreBar key={s.name} label={s.name} value={s.value} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          label="Match vs active job"
          value={matchReport ? `${matchReport.keyword}%` : "—"}
          sub={job ? job.title : "No job selected"}
          trend={matchReport ? (matchReport.keyword >= 70 ? "up" : "down") : undefined}
          onClick={() => setView("matcher")}
        />
        <StatCard
          icon={GitBranch}
          label="Saved versions"
          value={versions.filter((v) => v.resumeId === resume.id).length.toString()}
          sub="Snapshots you can restore"
          onClick={() => setView("versions")}
        />
        <StatCard
          icon={Briefcase}
          label="Applications"
          value={applications.length.toString()}
          sub={`${appCounts.interview || 0} interviewing · ${appCounts.offer || 0} offers`}
          onClick={() => setView("applications")}
        />
        <StatCard
          icon={FileText}
          label="Words / pages"
          value={`${report.details.wordCount}`}
          sub={`~${report.details.pageCount} page(s) · grade ${report.details.gradeLevel}`}
          onClick={() => setView("builder")}
        />
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Score history</CardTitle>
            <CardDescription>ATS score over recent runs (live snapshot included)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreHistory} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]} fill="var(--chart-1)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Section strength</CardTitle>
            <CardDescription>Radial view of sub-scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="25%" outerRadius="100%" data={subScores} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={6} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {subScores.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.fill }} />
                  <span className="text-muted-foreground">{s.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Top recommendations</CardTitle>
              <CardDescription>Deterministic, ordered by impact</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setView("optimizer")}>
              AI optimize <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {report.details.suggestions.slice(0, 5).map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2 text-sm"
              >
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-semibold">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{s}</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Missing keywords</CardTitle>
              <CardDescription>{job ? `vs ${job.title}` : "Add a job to detect gaps"}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setView("matcher")}>
              Match <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {report.details.missingKeywords.length === 0 && !matchReport ? (
              <p className="text-sm text-muted-foreground">
                No job description selected. Open the <button className="text-emerald-500 underline" onClick={() => setView("matcher")}>Job Matcher</button> to see missing keywords.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {(matchReport?.details.missingKeywords ?? report.details.missingKeywords).slice(0, 24).map((k) => (
                  <Badge key={k} variant="secondary" className="text-xs font-normal">
                    {k}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4" /> Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet. Try running an analysis or optimizing a section.</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
              {activity.slice(0, 12).map((a) => (
                <li key={a.id} className="flex items-center gap-3 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-mono text-xs text-muted-foreground w-28 shrink-0">{a.action}</span>
                  <span className="text-muted-foreground truncate">{a.meta ? JSON.stringify(a.meta).slice(0, 80) : ""}</span>
                  <span className="ml-auto text-xs text-muted-foreground shrink-0">{timeAgo(a.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down";
  onClick?: () => void;
}) {
  return (
    <Card
      className="hover:border-emerald-500/40 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{label}</span>
          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold tabular-nums">{value}</span>
          {trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-500" />}
          {trend === "down" && <TrendingDown className="h-4 w-4 text-rose-500" />}
        </div>
        {sub && <p className="text-xs text-muted-foreground mt-1 truncate">{sub}</p>}
      </CardContent>
    </Card>
  );
}


"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Briefcase, Plus, Trash2, ExternalLink, Calendar } from "lucide-react";
import { useStore, uid } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { ApplicationItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUSES: { id: ApplicationItem["status"]; label: string; color: string }[] = [
  { id: "saved", label: "Saved", color: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20" },
  { id: "applied", label: "Applied", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  { id: "interview", label: "Interview", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  { id: "offer", label: "Offer", color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20" },
  { id: "rejected", label: "Rejected", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" },
];

export function ApplicationsView() {
  const { applications, addApplication, updateApplication, deleteApplication, log } = useStore();
  const [company, setCompany] = React.useState("");
  const [role, setRole] = React.useState("");
  const [url, setUrl] = React.useState("");

  function add() {
    if (!company || !role) { toast.error("Company and role required"); return; }
    const a: ApplicationItem = { id: uid("app"), company, role, status: "saved", url, appliedAt: new Date().toISOString() };
    addApplication(a);
    log("app.add", { company, role });
    setCompany(""); setRole(""); setUrl("");
    toast.success("Application added");
  }

  const counts = STATUSES.map((s) => ({ ...s, count: applications.filter((a) => a.status === s.id).length }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1300px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Application Tracker</h1>
        <p className="text-muted-foreground text-sm mt-1">Keep your job search organized alongside your resumes.</p>
      </div>

      {}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {counts.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{c.label}</p>
              <p className="text-2xl font-semibold tabular-nums mt-1">{c.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Plus className="h-4 w-4" /> Add application</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_2fr_auto] gap-2 items-end">
          <div><Label className="text-xs text-muted-foreground">Company</Label><Input value={company} onChange={(e) => setCompany(e.target.value)} className="h-9 mt-0.5" placeholder="Anthropic" /></div>
          <div><Label className="text-xs text-muted-foreground">Role</Label><Input value={role} onChange={(e) => setRole(e.target.value)} className="h-9 mt-0.5" placeholder="Senior SWE" /></div>
          <div><Label className="text-xs text-muted-foreground">URL (optional)</Label><Input value={url} onChange={(e) => setUrl(e.target.value)} className="h-9 mt-0.5" placeholder="https://…" /></div>
          <Button onClick={add} className="gap-1.5"><Plus className="h-4 w-4" /> Add</Button>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Applications</CardTitle></CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No applications yet. Add one above.</p>
          ) : (
            <div className="space-y-2">
              {applications.map((a, i) => {
                const st = STATUSES.find((s) => s.id === a.status)!;
                return (
                  <motion.div key={a.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{a.company}</span>
                        <span className="text-muted-foreground text-sm">· {a.role}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        {a.appliedAt && <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(a.appliedAt).toLocaleDateString()}</span>}
                        {a.url && <a href={a.url} target="_blank" rel="noreferrer" className="text-xs text-emerald-500 hover:underline flex items-center gap-0.5"><ExternalLink className="h-3 w-3" /> link</a>}
                      </div>
                    </div>
                    <Select value={a.status} onValueChange={(v) => updateApplication(a.id, { status: v as ApplicationItem["status"] })}>
                      <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => <SelectItem key={s.id} value={s.id} className="text-xs">{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive shrink-0" onClick={() => deleteApplication(a.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

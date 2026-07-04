
"use client";

import * as React from "react";
import { GitBranch, Save, RotateCcw, Trash2, Plus, Clock } from "lucide-react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { timeAgo } from "@/components/utils";
import { ResumePreview } from "@/components/resume-preview";

export function VersionsView() {
  const { activeResume, versions, saveVersion, restoreVersion, log } = useStore();
  const resume = activeResume();
  const [label, setLabel] = React.useState("");
  const [note, setNote] = React.useState("");
  const [previewId, setPreviewId] = React.useState<string | null>(null);

  const resumeVersions = versions.filter((v) => v.resumeId === resume.id);
  const previewVersion = resumeVersions.find((v) => v.id === previewId);

  function save() {
    saveVersion(resume.id, label || `Snapshot ${new Date().toLocaleString()}`, note || undefined);
    setLabel(""); setNote("");
    toast.success("Version saved");
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1300px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Version Manager</h1>
        <p className="text-muted-foreground text-sm mt-1">Save snapshots of <span className="text-foreground font-medium">{resume.title}</span> and restore any of them. Stored locally & in the database.</p>
      </div>

      {}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Save className="h-4 w-4" /> Save current as version</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-3 items-end">
          <div>
            <Label className="text-xs text-muted-foreground">Label</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Before Google tailoring" className="h-9 mt-0.5" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Note (optional)</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="What changed?" className="h-9 mt-0.5" />
          </div>
          <Button onClick={save} className="gap-1.5"><Plus className="h-4 w-4" /> Save version</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
        {}
        <Card>
          <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm flex items-center gap-2"><GitBranch className="h-4 w-4" /> Versions ({resumeVersions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {resumeVersions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No saved versions yet. Save the current resume to create a snapshot you can return to.</p>
            ) : (
              <ul className="space-y-2 max-h-[60vh] overflow-y-auto scrollbar-thin">
                {resumeVersions.map((v) => (
                  <li key={v.id} className={`p-3 rounded-lg border transition-colors ${previewId === v.id ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:border-emerald-500/40"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{v.label}</p>
                        {v.note && <p className="text-xs text-muted-foreground truncate">{v.note}</p>}
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock className="h-3 w-3" /> {timeAgo(v.createdAt)}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setPreviewId(previewId === v.id ? null : v.id)}>Preview</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => { restoreVersion(v.id); toast.success("Restored to current"); log("version.restore", { id: v.id }); }}><RotateCcw className="h-3 w-3" /> Restore</Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Preview</CardTitle><CardDescription>{previewVersion ? previewVersion.label : "Select a version to preview"}</CardDescription></CardHeader>
          <CardContent>
            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin bg-muted/30 rounded-lg p-4">
              {previewVersion ? (
                <div className="origin-top mx-auto" style={{ transform: "scale(0.7)" }}>
                  <ResumePreview data={previewVersion.data} meta={previewVersion.meta} />
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">No version selected</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

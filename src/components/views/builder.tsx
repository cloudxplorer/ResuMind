
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  GripVertical,
  FileDown,
  Wand2,
  Loader2,
  Eye,
  Pencil,
  Save,
  Star,
  Copy,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useStore, uid } from "@/lib/store";
import { TEMPLATE_PRESETS, ACCENT_PRESETS } from "@/lib/sample-data";
import type { ExperienceItem, ResumeMeta, TemplateId } from "@/lib/types";
import { ResumePreview } from "@/components/resume-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PdfUploadButton } from "@/components/pdf-upload-button";
import { ExportModal } from "@/components/export-modal";
import type { ResumeData } from "@/lib/types";

export function BuilderView() {
  const { activeResume, updateActiveData, updateActiveMeta, updateResume, duplicateResume, saveVersion, log } = useStore();
  const resume = activeResume();
  const [mobileTab, setMobileTab] = React.useState<"edit" | "preview">("edit");
  const [exportOpen, setExportOpen] = React.useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem)]">
      {}
      <div className={cn("flex-1 min-w-0 border-r border-border", mobileTab === "preview" && "hidden lg:block")}>
        <div className="p-4 sm:p-6 space-y-5 max-w-3xl mx-auto">
          {}
          <div className="flex flex-col gap-3">
            <div className="flex-1 min-w-0">
              <Input
                value={resume.title}
                onChange={(e) => updateResume(resume.id, { title: e.target.value })}
                className="text-xl font-semibold h-9 border-0 px-0 focus-visible:ring-0 bg-transparent"
              />
              <p className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                Editing · saved locally · last updated {new Date(resume.updatedAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex gap-1.5 flex-wrap items-center">
              <PdfUploadButton
                label="Import PDF"
                variant="outline"
                size="sm"
                onStructured={(data: ResumeData) => {
                  const title = data.contact?.name
                    ? `${data.contact.name}${data.contact.title ? " — " + data.contact.title : ""}`
                    : "Imported resume";
                  updateResume(resume.id, { data, title });
                  toast.success("Resume imported from PDF — review the fields below");
                }}
              />
              <Button variant="ghost" size="icon" className="h-9 w-9" title="Toggle favorite"
                onClick={() => updateResume(resume.id, { isFavorite: !resume.isFavorite })}>
                <Star className={cn("h-4 w-4", resume.isFavorite && "fill-amber-500 text-amber-500")} />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" title="Duplicate"
                onClick={() => { duplicateResume(resume.id); toast.success("Duplicated"); }}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { saveVersion(resume.id, `v${new Date().toLocaleString()}`); toast.success("Version saved"); }}>
                <Save className="h-4 w-4" /> Save version
              </Button>
            </div>
          </div>

          {}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Template & styling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Template</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TEMPLATE_PRESETS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => updateActiveMeta({ template: t.id as TemplateId })}
                      className={cn(
                        "text-left p-2.5 rounded-lg border transition-all text-xs",
                        resume.meta.template === t.id
                          ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/30"
                          : "border-border hover:border-emerald-500/40",
                      )}
                    >
                      <span className="font-medium block">{t.name}</span>
                      <span className="text-muted-foreground text-[10px] leading-tight block mt-0.5">{t.description}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Accent color</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {ACCENT_PRESETS.map((c) => (
                      <button
                        key={c}
                        onClick={() => updateActiveMeta({ accent: c })}
                        className={cn("h-7 w-7 rounded-full border-2 transition-transform hover:scale-110", resume.meta.accent === c ? "border-foreground" : "border-transparent")}
                        style={{ background: c }}
                        aria-label={`Accent ${c}`}
                      />
                    ))}
                    <label className="h-7 w-7 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer relative overflow-hidden">
                      <input
                        type="color"
                        value={resume.meta.accent}
                        onChange={(e) => updateActiveMeta({ accent: e.target.value })}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Plus className="h-3 w-3 text-muted-foreground" />
                    </label>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Font</Label>
                  <div className="flex gap-1.5">
                    {(["inter", "serif", "mono"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => updateActiveMeta({ font: f })}
                        className={cn(
                          "px-3 py-1.5 rounded-md text-xs border transition-colors capitalize",
                          resume.meta.font === f ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:border-emerald-500/40",
                        )}
                        style={{ fontFamily: f === "serif" ? "ui-serif, Georgia, serif" : f === "mono" ? "var(--font-geist-mono), monospace" : undefined }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {}
          <SectionCard title="Contact" defaultOpen>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Full name" value={resume.data.contact.name} onChange={(v) => updateActiveData({ contact: { ...resume.data.contact, name: v } })} />
              <Field label="Title" value={resume.data.contact.title} onChange={(v) => updateActiveData({ contact: { ...resume.data.contact, title: v } })} />
              <Field label="Email" value={resume.data.contact.email} onChange={(v) => updateActiveData({ contact: { ...resume.data.contact, email: v } })} />
              <Field label="Phone" value={resume.data.contact.phone} onChange={(v) => updateActiveData({ contact: { ...resume.data.contact, phone: v } })} />
              <Field label="Location" value={resume.data.contact.location} onChange={(v) => updateActiveData({ contact: { ...resume.data.contact, location: v } })} />
              <Field label="Website" value={resume.data.contact.website ?? ""} onChange={(v) => updateActiveData({ contact: { ...resume.data.contact, website: v } })} />
              <Field label="LinkedIn" value={resume.data.contact.linkedin ?? ""} onChange={(v) => updateActiveData({ contact: { ...resume.data.contact, linkedin: v } })} />
              <Field label="GitHub" value={resume.data.contact.github ?? ""} onChange={(v) => updateActiveData({ contact: { ...resume.data.contact, github: v } })} />
            </div>
          </SectionCard>

          {}
          <SectionCard title="Professional summary" defaultOpen action={
            <AIRewriteButton
              kind="summary"
              text={resume.data.summary}
              context={{ role: resume.data.contact.title }}
              onApply={(after) => { updateActiveData({ summary: after }); toast.success("Summary updated"); }}
            />
          }>
            <Textarea
              value={resume.data.summary}
              onChange={(e) => updateActiveData({ summary: e.target.value })}
              rows={4}
              placeholder="2–4 sentences summarizing your impact and focus."
              className="resize-y"
            />
            <p className="text-xs text-muted-foreground mt-1">{resume.data.summary.trim().split(/\s+/).filter(Boolean).length} words · ideal 30–90</p>
          </SectionCard>

          {}
          <SectionCard title="Experience" defaultOpen action={
            <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs" onClick={() => {
              const item: ExperienceItem = { id: uid("exp"), company: "New Company", role: "Role", startDate: "", endDate: "Present", current: true, bullets: ["Describe an achievement with a metric."] };
              updateActiveData({ experience: [...resume.data.experience, item] });
            }}>
              <Plus className="h-3.5 w-3.5" /> Add role
            </Button>
          }>
            <SortableList
              items={resume.data.experience}
              onReorder={(exp) => updateActiveData({ experience: exp })}
              renderItem={(e, idx) => (
                <ExperienceEditor
                  key={e.id}
                  exp={e}
                  onChange={(patch) => updateActiveData({ experience: resume.data.experience.map((x) => x.id === e.id ? { ...x, ...patch } : x) })}
                  onRemove={() => updateActiveData({ experience: resume.data.experience.filter((x) => x.id !== e.id) })}
                />
              )}
            />
          </SectionCard>

          {}
          <SectionCard title="Projects" action={
            <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs" onClick={() => {
              const p = { id: uid("prj"), name: "New Project", description: "", tech: [], bullets: ["What you built and the impact."] };
              updateActiveData({ projects: [...resume.data.projects, p] });
            }}>
              <Plus className="h-3.5 w-3.5" /> Add project
            </Button>
          }>
            <div className="space-y-3">
              {resume.data.projects.map((p) => (
                <div key={p.id} className="p-3 rounded-lg border border-border space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Field label="Name" value={p.name} onChange={(v) => updateActiveData({ projects: resume.data.projects.map((x) => x.id === p.id ? { ...x, name: v } : x) })} />
                    <Field label="URL" value={p.url ?? ""} onChange={(v) => updateActiveData({ projects: resume.data.projects.map((x) => x.id === p.id ? { ...x, url: v } : x) })} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Start date" value={p.startDate ?? ""} onChange={(v) => updateActiveData({ projects: resume.data.projects.map((x) => x.id === p.id ? { ...x, startDate: v } : x) })} placeholder="Oct 2025" />
                    <Field label="End date" value={p.endDate ?? ""} onChange={(v) => updateActiveData({ projects: resume.data.projects.map((x) => x.id === p.id ? { ...x, endDate: v } : x) })} placeholder="Nov 2025" />
                  </div>
                  <Field label="Description" value={p.description} onChange={(v) => updateActiveData({ projects: resume.data.projects.map((x) => x.id === p.id ? { ...x, description: v } : x) })} />
                  <Field label="Tech (comma separated)" value={p.tech.join(", ")} onChange={(v) => updateActiveData({ projects: resume.data.projects.map((x) => x.id === p.id ? { ...x, tech: v.split(",").map((s) => s.trim()).filter(Boolean) } : x) })} />
                  <BulletList
                    bullets={p.bullets}
                    onChange={(bullets) => updateActiveData({ projects: resume.data.projects.map((x) => x.id === p.id ? { ...x, bullets } : x) })}
                  />
                  <Button variant="ghost" size="sm" className="text-destructive h-7 text-xs" onClick={() => updateActiveData({ projects: resume.data.projects.filter((x) => x.id !== p.id) })}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove project
                  </Button>
                </div>
              ))}
            </div>
          </SectionCard>

          {}
          <SectionCard title="Training" action={
            <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs" onClick={() => {
              const t = { id: uid("trn"), title: "New Training", organization: "", startDate: "", endDate: "", bullets: ["What you learned and built."] };
              updateActiveData({ training: [...resume.data.training, t] });
            }}>
              <Plus className="h-3.5 w-3.5" /> Add training
            </Button>
          }>
            <div className="space-y-3">
              {resume.data.training.map((t) => (
                <div key={t.id} className="p-3 rounded-lg border border-border space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Field label="Title" value={t.title} onChange={(v) => updateActiveData({ training: resume.data.training.map((x) => x.id === t.id ? { ...x, title: v } : x) })} />
                    <Field label="Organization" value={t.organization ?? ""} onChange={(v) => updateActiveData({ training: resume.data.training.map((x) => x.id === t.id ? { ...x, organization: v } : x) })} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Start" value={t.startDate} onChange={(v) => updateActiveData({ training: resume.data.training.map((x) => x.id === t.id ? { ...x, startDate: v } : x) })} placeholder="2025-06" />
                    <Field label="End" value={t.endDate} onChange={(v) => updateActiveData({ training: resume.data.training.map((x) => x.id === t.id ? { ...x, endDate: v } : x) })} placeholder="2025-07" />
                  </div>
                  <BulletList
                    bullets={t.bullets}
                    onChange={(bullets) => updateActiveData({ training: resume.data.training.map((x) => x.id === t.id ? { ...x, bullets } : x) })}
                  />
                  <Button variant="ghost" size="sm" className="text-destructive h-7 text-xs" onClick={() => updateActiveData({ training: resume.data.training.filter((x) => x.id !== t.id) })}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove training
                  </Button>
                </div>
              ))}
            </div>
          </SectionCard>

          {}
          <SectionCard title="Skills" action={
            <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs" onClick={() => updateActiveData({ skills: [...resume.data.skills, { id: uid("sk"), category: "New category", items: [] }] })}>
              <Plus className="h-3.5 w-3.5" /> Add group
            </Button>
          }>
            <div className="space-y-2">
              {resume.data.skills.map((s) => (
                <div key={s.id} className="flex gap-2 items-start">
                  <Input
                    value={s.category}
                    onChange={(e) => updateActiveData({ skills: resume.data.skills.map((x) => x.id === s.id ? { ...x, category: e.target.value } : x) })}
                    className="w-40 shrink-0 h-9"
                    placeholder="Category"
                  />
                  <Input
                    value={s.items.join(", ")}
                    onChange={(e) => updateActiveData({ skills: resume.data.skills.map((x) => x.id === s.id ? { ...x, items: e.target.value.split(",").map((i) => i.trim()).filter(Boolean) } : x) })}
                    className="flex-1 h-9"
                    placeholder="Comma separated skills"
                  />
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive shrink-0" onClick={() => updateActiveData({ skills: resume.data.skills.filter((x) => x.id !== s.id) })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </SectionCard>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SectionCard title="Education" action={
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => updateActiveData({ education: [...resume.data.education, { id: uid("edu"), school: "School", degree: "Degree", startDate: "", endDate: "" }] })}>
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            }>
              <div className="space-y-2">
                {resume.data.education.map((ed) => (
                  <div key={ed.id} className="space-y-1.5 p-2 rounded border border-border">
                    <Field label="School" value={ed.school} onChange={(v) => updateActiveData({ education: resume.data.education.map((x) => x.id === ed.id ? { ...x, school: v } : x) })} />
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Degree" value={ed.degree} onChange={(v) => updateActiveData({ education: resume.data.education.map((x) => x.id === ed.id ? { ...x, degree: v } : x) })} />
                      <Field label="Field" value={ed.field ?? ""} onChange={(v) => updateActiveData({ education: resume.data.education.map((x) => x.id === ed.id ? { ...x, field: v } : x) })} />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Field label="Start" value={ed.startDate} onChange={(v) => updateActiveData({ education: resume.data.education.map((x) => x.id === ed.id ? { ...x, startDate: v } : x) })} placeholder="2014-08" />
                      <Field label="End" value={ed.endDate} onChange={(v) => updateActiveData({ education: resume.data.education.map((x) => x.id === ed.id ? { ...x, endDate: v } : x) })} placeholder="2018-05" />
                      <Field label="GPA" value={ed.gpa ?? ""} onChange={(v) => updateActiveData({ education: resume.data.education.map((x) => x.id === ed.id ? { ...x, gpa: v } : x) })} />
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive h-7 text-xs" onClick={() => updateActiveData({ education: resume.data.education.filter((x) => x.id !== ed.id) })}>
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                    </Button>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Certifications" action={
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => updateActiveData({ certificates: [...resume.data.certificates, { id: uid("cert"), name: "Certificate", issuer: "Issuer", date: "" }] })}>
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            }>
              <div className="space-y-2">
                {resume.data.certificates.map((c) => (
                  <div key={c.id} className="space-y-1.5 p-2 rounded border border-border">
                    <Field label="Name" value={c.name} onChange={(v) => updateActiveData({ certificates: resume.data.certificates.map((x) => x.id === c.id ? { ...x, name: v } : x) })} />
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Issuer" value={c.issuer} onChange={(v) => updateActiveData({ certificates: resume.data.certificates.map((x) => x.id === c.id ? { ...x, issuer: v } : x) })} />
                      <Field label="Date" value={c.date} onChange={(v) => updateActiveData({ certificates: resume.data.certificates.map((x) => x.id === c.id ? { ...x, date: v } : x) })} placeholder="2022-09" />
                    </div>
                    <Field label="URL (optional)" value={c.url ?? ""} onChange={(v) => updateActiveData({ certificates: resume.data.certificates.map((x) => x.id === c.id ? { ...x, url: v } : x) })} placeholder="https://..." />
                    <Button variant="ghost" size="sm" className="text-destructive h-7 text-xs" onClick={() => updateActiveData({ certificates: resume.data.certificates.filter((x) => x.id !== c.id) })}>
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                    </Button>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {}
          <SectionCard title="Achievements" action={
            <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs" onClick={() => {
              const a = { id: uid("ach"), title: "New Achievement", description: "", url: "", bullets: ["What you achieved and its impact."] };
              updateActiveData({ achievements: [...resume.data.achievements, a] });
            }}>
              <Plus className="h-3.5 w-3.5" /> Add achievement
            </Button>
          }>
            <div className="space-y-3">
              {resume.data.achievements.map((a) => (
                <div key={a.id} className="p-3 rounded-lg border border-border space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Field label="Title" value={a.title} onChange={(v) => updateActiveData({ achievements: resume.data.achievements.map((x) => x.id === a.id ? { ...x, title: v } : x) })} />
                    <Field label="Date" value={a.date ?? ""} onChange={(v) => updateActiveData({ achievements: resume.data.achievements.map((x) => x.id === a.id ? { ...x, date: v } : x) })} placeholder="Aug 2025" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Field label="Description" value={a.description ?? ""} onChange={(v) => updateActiveData({ achievements: resume.data.achievements.map((x) => x.id === a.id ? { ...x, description: v } : x) })} />
                    <Field label="URL" value={a.url ?? ""} onChange={(v) => updateActiveData({ achievements: resume.data.achievements.map((x) => x.id === a.id ? { ...x, url: v } : x) })} />
                  </div>
                  <BulletList
                    bullets={a.bullets}
                    onChange={(bullets) => updateActiveData({ achievements: resume.data.achievements.map((x) => x.id === a.id ? { ...x, bullets } : x) })}
                  />
                  <Button variant="ghost" size="sm" className="text-destructive h-7 text-xs" onClick={() => updateActiveData({ achievements: resume.data.achievements.filter((x) => x.id !== a.id) })}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove achievement
                  </Button>
                </div>
              ))}
            </div>
          </SectionCard>

          {}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><FileDown className="h-4 w-4" /> Export</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setExportOpen(true)} className="w-full gap-2">
                <FileDown className="h-4 w-4" /> Download Resume
              </Button>
              <p className="text-xs text-muted-foreground mt-2">PDF (ATS-friendly), LaTeX\u2192PDF, .tex, JSON, or DOCX</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {}
      <div className={cn("lg:w-[46%] xl:w-[42%] shrink-0 bg-muted/30", mobileTab === "edit" && "hidden lg:block")}>
        <div className="lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] overflow-y-auto scrollbar-thin p-4 sm:p-6">
          {}
          <div className="lg:hidden mb-3 flex gap-1 p-1 bg-muted rounded-lg">
            <button onClick={() => setMobileTab("edit")} className={cn("flex-1 py-1.5 text-sm rounded-md flex items-center justify-center gap-1.5", mobileTab === "edit" ? "bg-background shadow-sm" : "text-muted-foreground")}><Pencil className="h-3.5 w-3.5" /> Edit</button>
            <button onClick={() => setMobileTab("preview")} className={cn("flex-1 py-1.5 text-sm rounded-md flex items-center justify-center gap-1.5", mobileTab === "preview" ? "bg-background shadow-sm" : "text-muted-foreground")}><Eye className="h-3.5 w-3.5" /> Preview</button>
          </div>
          <div className="text-xs text-muted-foreground mb-3 hidden lg:block">Live preview · {resume.meta.template}</div>
          <div className="origin-top mx-auto" style={{ transform: "scale(0.92)" }}>
            <ResumePreview data={resume.data} meta={resume.meta} />
          </div>
        </div>
      </div>

      {}
      <div className="lg:hidden sticky bottom-0 border-t border-border bg-background p-2 flex gap-1 no-print">
        <Button variant={mobileTab === "edit" ? "default" : "outline"} size="sm" className="flex-1" onClick={() => setMobileTab("edit")}><Pencil className="h-4 w-4 mr-1.5" /> Edit</Button>
        <Button variant={mobileTab === "preview" ? "default" : "outline"} size="sm" className="flex-1" onClick={() => setMobileTab("preview")}><Eye className="h-4 w-4 mr-1.5" /> Preview</Button>
      </div>

      <ExportModal open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  );
}



function SectionCard({ title, children, action, defaultOpen }: { title: string; children: React.ReactNode; action?: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <Card>
      <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-9 mt-0.5" />
    </div>
  );
}

function BulletList({ bullets, onChange }: { bullets: string[]; onChange: (b: string[]) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">Bullets</Label>
      {bullets.map((b, i) => (
        <div key={i} className="flex gap-1.5">
          <Textarea
            value={b}
            onChange={(e) => onChange(bullets.map((x, j) => (j === i ? e.target.value : x)))}
            rows={2}
            className="resize-y text-sm"
          />
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-destructive" onClick={() => onChange(bullets.filter((_, j) => j !== i))}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => onChange([...bullets, ""])}><Plus className="h-3.5 w-3.5" /> Add bullet</Button>
    </div>
  );
}

function AIRewriteButton({ kind, text, context, onApply }: { kind: "summary" | "bullet" | "project"; text: string; context?: { role?: string; company?: string }; onApply: (after: string) => void }) {
  const [loading, setLoading] = React.useState(false);
  async function run() {
    if (!text.trim()) { toast.error("Nothing to rewrite"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "rewrite", payload: { kind, text, context } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      onApply(data.after);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI rewrite failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs" onClick={run} disabled={loading}>
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
      AI rewrite
    </Button>
  );
}



function SortableList<T extends { id: string }>({ items, onReorder, renderItem }: { items: T[]; onReorder: (items: T[]) => void; renderItem: (item: T, idx: number) => React.ReactNode }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const oldI = items.findIndex((i) => i.id === active.id);
      const newI = items.findIndex((i) => i.id === over.id);
      onReorder(arrayMove(items, oldI, newI));
    }
  }
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map((item, idx) => renderItem(item, idx))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function ExperienceEditor({ exp, onChange, onRemove }: { exp: ExperienceItem; onChange: (patch: Partial<ExperienceItem>) => void; onRemove: () => void }) {
  const { id } = exp;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="rounded-lg border border-border p-3 space-y-2 bg-card/50">
      <div className="flex items-center gap-1">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground touch-none" aria-label="Drag to reorder">
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="text-xs font-medium text-muted-foreground flex-1">{exp.role || "Role"} · {exp.company || "Company"}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={onRemove}><Trash2 className="h-3.5 w-3.5" /></Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Field label="Role" value={exp.role} onChange={(v) => onChange({ role: v })} />
        <Field label="Company" value={exp.company} onChange={(v) => onChange({ company: v })} />
        <Field label="Location" value={exp.location ?? ""} onChange={(v) => onChange({ location: v })} />
        <div className="grid grid-cols-2 gap-2">
          <Field label="Start" value={exp.startDate} onChange={(v) => onChange({ startDate: v })} placeholder="2021-06" />
          <Field label="End" value={exp.endDate} onChange={(v) => onChange({ endDate: v })} placeholder="Present" />
        </div>
      </div>
      <BulletList bullets={exp.bullets} onChange={(bullets) => onChange({ bullets })} />
    </div>
  );
}

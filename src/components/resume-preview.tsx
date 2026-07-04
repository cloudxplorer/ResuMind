
"use client";

import * as React from "react";
import type { ResumeData, ResumeMeta, TemplateId } from "@/lib/types";

const FONT_STACKS: Record<ResumeMeta["font"], string> = {
  inter: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  geist: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  mono: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
};

const SPACING: Record<ResumeMeta["spacing"], string> = {
  compact: "space-y-2",
  normal: "space-y-3.5",
  relaxed: "space-y-5",
};

function fmtDate(s: string): string {
  if (!s) return "";
  
  const m = s.match(/^(\d{4})-(\d{1,2})$/);
  if (m) {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[parseInt(m[2], 10) - 1]} ${m[1]}`;
  }
  return s;
}

function fmtRange(start?: string, end?: string): string {
  return [fmtDate(start ?? ""), fmtDate(end ?? "")].filter(Boolean).join(" — ");
}

interface PreviewProps {
  data: ResumeData;
  meta: ResumeMeta;
  template?: TemplateId;
}

export function ResumePreview({ data, meta, template }: PreviewProps) {
  const tpl = template ?? meta.template;
  const font = FONT_STACKS[meta.font] ?? FONT_STACKS.inter;
  const accent = meta.accent || "#0f766e";

  const common: React.CSSProperties = { fontFamily: font };
  return (
    <div className="resume-page" style={common}>
      <div id="resume-print-area">
        {tpl === "modern" && <ModernTpl data={data} accent={accent} spacing={meta.spacing} />}
        {tpl === "professional" && <ProfessionalTpl data={data} accent={accent} spacing={meta.spacing} />}
        {tpl === "minimal" && <MinimalTpl data={data} spacing={meta.spacing} />}
        {tpl === "academic" && <AcademicTpl data={data} accent={accent} spacing={meta.spacing} />}
        {tpl === "engineer" && <EngineerTpl data={data} accent={accent} spacing={meta.spacing} />}
        {tpl === "pm" && <PMTpl data={data} accent={accent} spacing={meta.spacing} />}
        {tpl === "datasci" && <DataSciTpl data={data} accent={accent} spacing={meta.spacing} />}
        {tpl === "designer" && <DesignerTpl data={data} accent={accent} spacing={meta.spacing} />}
      </div>
    </div>
  );
}



function Header({
  data,
  accent,
  align = "left",
}: {
  data: ResumeData;
  accent: string;
  align?: "left" | "center";
}) {
  return (
    <header style={{ textAlign: align }} className="mb-5">
      <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#111" }}>
        {data.contact.name || "Your Name"}
      </h1>
      <p className="text-base font-medium mt-0.5" style={{ color: accent }}>
        {data.contact.title || "Your Title"}
      </p>
      <p className="text-xs mt-2" style={{ color: "#555" }}>
        {[
          data.contact.email,
          data.contact.phone,
          data.contact.location,
          data.contact.website,
          data.contact.linkedin,
          data.contact.github,
        ]
          .filter(Boolean)
          .join("  •  ")}
      </p>
    </header>
  );
}

function SectionTitle({
  children,
  accent,
  variant = "underline",
}: {
  children: React.ReactNode;
  accent: string;
  variant?: "underline" | "pill" | "mono";
}) {
  if (variant === "pill") {
    return (
      <h2
        className="inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded mb-2"
        style={{ background: accent, color: "#fff" }}
      >
        {children}
      </h2>
    );
  }
  if (variant === "mono") {
    return (
      <h2
        className="text-xs font-bold uppercase tracking-[0.2em] mb-2 font-mono"
        style={{ color: accent, borderBottom: `1px solid ${accent}`, paddingBottom: 4 }}
      >
        {children}
      </h2>
    );
  }
  return (
    <h2
      className="text-sm font-bold uppercase tracking-wider mb-2"
      style={{ color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: 4 }}
    >
      {children}
    </h2>
  );
}

function Bullets({ items, color }: { items: string[]; color?: string }) {
  if (!items.length) return null;
  return (
    <ul className="mt-1.5 space-y-1" style={{ color: color ?? "#222" }}>
      {items.map((b, i) => (
        <li key={i} className="text-sm leading-relaxed pl-4 relative">
          <span className="absolute left-0 top-2.5 w-1 h-1 rounded-full" style={{ background: "#666" }} />
          {b}
        </li>
      ))}
    </ul>
  );
}



function ModernTpl({ data, accent, spacing }: { data: ResumeData; accent: string; spacing: ResumeMeta["spacing"] }) {
  return (
    <div className={SPACING[spacing]}>
      <Header data={data} accent={accent} />
      {data.summary && (
        <section>
          <SectionTitle accent={accent}>Summary</SectionTitle>
          <p className="text-sm leading-relaxed" style={{ color: "#333" }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Experience</SectionTitle>
          <div className="space-y-4">
            {data.experience.map((e) => (
              <div key={e.id}>
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <span className="font-semibold text-base" style={{ color: "#111" }}>
                    {e.role} <span style={{ color: accent }}>· {e.company}</span>
                  </span>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {fmtDate(e.startDate)} — {e.current ? "Present" : fmtDate(e.endDate)}
                  </span>
                </div>
                {e.location && <p className="text-xs text-gray-500">{e.location}</p>}
                <Bullets items={e.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
      {data.projects.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Projects</SectionTitle>
          <div className="space-y-3">
            {data.projects.map((p) => (
              <div key={p.id}>
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <span className="font-semibold text-sm" style={{ color: "#111" }}>
                    {p.name} {p.tech.length > 0 && <span className="text-xs font-normal text-gray-500">· {p.tech.join(", ")}</span>}
                  </span>
                  <div className="flex items-baseline gap-2">
                    {(p.startDate || p.endDate) && (
                      <span className="text-xs text-gray-500 whitespace-nowrap">{fmtRange(p.startDate, p.endDate)}</span>
                    )}
                    {p.url && <span className="text-xs" style={{ color: accent }}>{p.url}</span>}
                  </div>
                </div>
                {p.description && <p className="text-sm text-gray-600">{p.description}</p>}
                <Bullets items={p.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
      {data.skills.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Skills</SectionTitle>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {data.skills.map((s) => (
              <div key={s.id} className="text-sm">
                <span className="font-semibold" style={{ color: "#111" }}>{s.category}: </span>
                <span style={{ color: "#444" }}>{s.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      {data.training.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Training</SectionTitle>
          <div className="space-y-3">
            {data.training.map((t) => (
              <div key={t.id}>
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <span className="font-semibold text-sm" style={{ color: "#111" }}>
                    {t.title}{t.organization && <span style={{ color: accent }}> · {t.organization}</span>}
                  </span>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{fmtRange(t.startDate, t.endDate)}</span>
                </div>
                <Bullets items={t.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="grid grid-cols-2 gap-x-6">
        {data.education.length > 0 && (
          <section>
            <SectionTitle accent={accent}>Education</SectionTitle>
            {data.education.map((ed) => (
              <div key={ed.id} className="mb-2">
                <p className="font-semibold text-sm" style={{ color: "#111" }}>{ed.degree}{ed.field ? `, ${ed.field}` : ""}</p>
                <p className="text-sm" style={{ color: "#444" }}>{ed.school}</p>
                <p className="text-xs text-gray-500">{fmtDate(ed.startDate)} — {fmtDate(ed.endDate)}{ed.gpa ? ` · GPA ${ed.gpa}` : ""}</p>
              </div>
            ))}
          </section>
        )}
        {data.certificates.length > 0 && (
          <section>
            <SectionTitle accent={accent}>Certifications</SectionTitle>
            {data.certificates.map((c) => (
              <div key={c.id} className="mb-1 text-sm">
                <span className="font-semibold" style={{ color: "#111" }}>{c.name}</span>
                <span style={{ color: "#555" }}> — {c.issuer}</span>
                {c.date && <span className="text-xs text-gray-500"> · {fmtDate(c.date)}</span>}
                {c.url && <span className="text-xs" style={{ color: accent }}> · Link</span>}
              </div>
            ))}
          </section>
        )}
      </div>
      {data.achievements.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Achievements</SectionTitle>
          <div className="space-y-2">
            {data.achievements.map((a) => (
              <div key={a.id}>
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <span className="font-semibold text-sm" style={{ color: "#111" }}>{a.title}</span>
                  <span className="text-xs text-gray-500">{[a.date, a.url].filter(Boolean).join(" | ")}</span>
                </div>
                {a.description && <p className="text-sm text-gray-600">{a.description}</p>}
                <Bullets items={a.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ProfessionalTpl({ data, accent, spacing }: { data: ResumeData; accent: string; spacing: ResumeMeta["spacing"] }) {
  return (
    <div className={SPACING[spacing]} style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
      <Header data={data} accent={accent} align="center" />
      {data.summary && (
        <section>
          <SectionTitle accent={accent}>Professional Summary</SectionTitle>
          <p className="text-sm leading-relaxed" style={{ color: "#333" }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Professional Experience</SectionTitle>
          <div className="space-y-4">
            {data.experience.map((e) => (
              <div key={e.id}>
                <div>
                  <span className="font-bold text-base" style={{ color: "#111" }}>{e.company}</span>
                  <span className="text-sm float-right" style={{ color: "#555" }}>{fmtDate(e.startDate)} — {e.current ? "Present" : fmtDate(e.endDate)}</span>
                </div>
                <p className="text-sm italic" style={{ color: accent }}>{e.role}{e.location ? ` · ${e.location}` : ""}</p>
                <Bullets items={e.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
      {data.skills.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Core Competencies</SectionTitle>
          <p className="text-sm" style={{ color: "#333" }}>
            {data.skills.map((s) => `${s.category}: ${s.items.join(", ")}`).join("  |  ")}
          </p>
        </section>
      )}
      {data.projects.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Selected Projects</SectionTitle>
          <div className="space-y-2">
            {data.projects.map((p) => (
              <div key={p.id} className="text-sm">
                {(p.startDate || p.endDate) && <span className="text-sm float-right" style={{ color: "#555" }}>{fmtRange(p.startDate, p.endDate)}</span>}
                <span className="font-semibold" style={{ color: "#111" }}>{p.name}</span>
                {p.tech.length > 0 && <span style={{ color: "#666" }}> — {p.tech.join(", ")}</span>}
                {p.description && <span style={{ color: "#444" }}> — {p.description}</span>}
                <Bullets items={p.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
      {data.training.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Training</SectionTitle>
          <div className="space-y-2">
            {data.training.map((t) => (
              <div key={t.id} className="text-sm">
                <span className="text-sm float-right" style={{ color: "#555" }}>{fmtRange(t.startDate, t.endDate)}</span>
                <span className="font-semibold" style={{ color: "#111" }}>{t.title}</span>
                {t.organization && <span style={{ color: "#666" }}> — {t.organization}</span>}
                <Bullets items={t.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="grid grid-cols-2 gap-6">
        {data.education.length > 0 && (
          <section>
            <SectionTitle accent={accent}>Education</SectionTitle>
            {data.education.map((ed) => (
              <div key={ed.id} className="text-sm mb-1">
                <p className="font-semibold" style={{ color: "#111" }}>{ed.school}</p>
                <p style={{ color: "#444" }}>{ed.degree}{ed.field ? `, ${ed.field}` : ""}</p>
                <p className="text-xs text-gray-500">{fmtDate(ed.startDate)} — {fmtDate(ed.endDate)}{ed.gpa ? ` · GPA ${ed.gpa}` : ""}</p>
              </div>
            ))}
          </section>
        )}
        {data.certificates.length > 0 && (
          <section>
            <SectionTitle accent={accent}>Certifications</SectionTitle>
            {data.certificates.map((c) => (
              <p key={c.id} className="text-sm" style={{ color: "#333" }}>
                <span className="font-semibold">{c.name}</span> — {c.issuer} ({fmtDate(c.date)})
              </p>
            ))}
          </section>
        )}
      </div>
      {data.achievements.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Achievements</SectionTitle>
          <div className="space-y-2">
            {data.achievements.map((a) => (
              <div key={a.id} className="text-sm">
                <span className="font-semibold" style={{ color: "#111" }}>{a.title}</span>
                {a.description && <span style={{ color: "#444" }}> — {a.description}</span>}
                {a.url && <span style={{ color: accent }}> · {a.url}</span>}
                <Bullets items={a.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MinimalTpl({ data, spacing }: { data: ResumeData; spacing: ResumeMeta["spacing"] }) {
  return (
    <div className={SPACING[spacing]}>
      <header className="mb-6">
        <h1 className="text-4xl font-light tracking-tight" style={{ color: "#111" }}>{data.contact.name || "Your Name"}</h1>
        <p className="text-sm mt-1" style={{ color: "#666" }}>
          {[
            data.contact.title,
            data.contact.email,
            data.contact.phone,
            data.contact.location,
            data.contact.website,
          ].filter(Boolean).join("  ·  ")}
        </p>
      </header>
      {data.summary && <p className="text-sm leading-relaxed mb-6" style={{ color: "#333" }}>{data.summary}</p>}
      {data.experience.map((e) => (
        <div key={e.id} className="mb-5 grid grid-cols-[120px_1fr] gap-4">
          <p className="text-xs text-gray-400 pt-1">{fmtDate(e.startDate)} — {e.current ? "Now" : fmtDate(e.endDate)}</p>
          <div>
            <p className="font-medium text-sm" style={{ color: "#111" }}>{e.role}</p>
            <p className="text-xs text-gray-500 mb-1">{e.company}{e.location ? ` · ${e.location}` : ""}</p>
            <Bullets items={e.bullets} />
          </div>
        </div>
      ))}
      {data.projects.length > 0 && (
        <div className="mb-5">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Projects</p>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <p className="font-medium text-sm" style={{ color: "#111" }}>{p.name}{p.tech.length ? <span className="text-gray-400 font-normal"> · {p.tech.join(", ")}</span> : null}</p>
              {(p.startDate || p.endDate) && <p className="text-xs text-gray-400">{fmtRange(p.startDate, p.endDate)}</p>}
              <Bullets items={p.bullets} />
            </div>
          ))}
        </div>
      )}
      {data.skills.length > 0 && (
        <div className="mb-5">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Skills</p>
          <p className="text-sm" style={{ color: "#333" }}>{data.skills.flatMap((s) => s.items).join(" · ")}</p>
        </div>
      )}
      {data.training.length > 0 && (
        <div className="mb-5">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Training</p>
          {data.training.map((t) => (
            <div key={t.id} className="mb-2">
              <p className="font-medium text-sm" style={{ color: "#111" }}>{t.title}{t.organization ? <span className="text-gray-400 font-normal"> · {t.organization}</span> : null}</p>
              <p className="text-xs text-gray-400">{fmtRange(t.startDate, t.endDate)}</p>
              <Bullets items={t.bullets} />
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {data.education.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Education</p>
            {data.education.map((ed) => (
              <p key={ed.id} className="text-sm" style={{ color: "#333" }}>
                <span className="font-medium">{ed.degree}</span>, {ed.school} · {fmtDate(ed.endDate)}
              </p>
            ))}
          </div>
        )}
        {data.certificates.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Certifications</p>
            {data.certificates.map((c) => (
              <p key={c.id} className="text-sm" style={{ color: "#333" }}>{c.name} — {c.issuer}</p>
            ))}
          </div>
        )}
      </div>
      {data.achievements.length > 0 && (
        <div className="mb-5">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Achievements</p>
          {data.achievements.map((a) => (
            <div key={a.id} className="mb-2">
              <p className="font-medium text-sm" style={{ color: "#111" }}>{a.title}{a.url ? <span className="text-gray-400 font-normal"> · {a.url}</span> : null}</p>
              {a.description && <p className="text-sm" style={{ color: "#333" }}>{a.description}</p>}
              <Bullets items={a.bullets} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AcademicTpl({ data, accent, spacing }: { data: ResumeData; accent: string; spacing: ResumeMeta["spacing"] }) {
  return (
    <div className={SPACING[spacing]} style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
      <header className="text-center mb-5">
        <h1 className="text-2xl font-bold" style={{ color: "#111" }}>{data.contact.name}</h1>
        <p className="text-xs mt-1" style={{ color: "#555" }}>
          {[data.contact.email, data.contact.phone, data.contact.location, data.contact.website].filter(Boolean).join("  |  ")}
        </p>
      </header>
      {data.summary && (
        <section>
          <SectionTitle accent={accent}>Research Interests</SectionTitle>
          <p className="text-sm leading-relaxed" style={{ color: "#333" }}>{data.summary}</p>
        </section>
      )}
      {data.education.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Education</SectionTitle>
          {data.education.map((ed) => (
            <div key={ed.id} className="mb-1.5 text-sm">
              <span className="font-bold" style={{ color: "#111" }}>{ed.degree}{ed.field ? `, ${ed.field}` : ""}</span>
              <span className="float-right text-xs" style={{ color: "#555" }}>{fmtDate(ed.startDate)} — {fmtDate(ed.endDate)}</span>
              <p style={{ color: "#444" }}>{ed.school}{ed.gpa ? ` · GPA ${ed.gpa}` : ""}</p>
            </div>
          ))}
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Experience</SectionTitle>
          {data.experience.map((e) => (
            <div key={e.id} className="mb-2 text-sm">
              <span className="font-bold" style={{ color: "#111" }}>{e.role}</span>, {e.company}
              <span className="float-right text-xs" style={{ color: "#555" }}>{fmtDate(e.startDate)} — {e.current ? "Present" : fmtDate(e.endDate)}</span>
              <Bullets items={e.bullets} />
            </div>
          ))}
        </section>
      )}
      {data.projects.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Publications & Projects</SectionTitle>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-1.5 text-sm">
              {(p.startDate || p.endDate) && <span className="float-right text-xs" style={{ color: "#555" }}>{fmtRange(p.startDate, p.endDate)}</span>}
              <span className="font-bold" style={{ color: "#111" }}>{p.name}.</span>
              <span style={{ color: "#333" }}> {p.description}</span>
            </div>
          ))}
        </section>
      )}
      {data.skills.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Skills</SectionTitle>
          <p className="text-sm" style={{ color: "#333" }}>{data.skills.map((s) => `${s.category}: ${s.items.join(", ")}`).join("  |  ")}</p>
        </section>
      )}
      {data.training.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Summer Training</SectionTitle>
          {data.training.map((t) => (
            <div key={t.id} className="mb-1.5 text-sm">
              <span className="float-right text-xs" style={{ color: "#555" }}>{fmtRange(t.startDate, t.endDate)}</span>
              <span className="font-bold" style={{ color: "#111" }}>{t.title}.</span>
              {t.organization && <span style={{ color: "#333" }}> {t.organization}.</span>}
              <Bullets items={t.bullets} />
            </div>
          ))}
        </section>
      )}
      {data.certificates.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Certifications & Awards</SectionTitle>
          {data.certificates.map((c) => (
            <p key={c.id} className="text-sm" style={{ color: "#333" }}>{c.name} — {c.issuer} ({fmtDate(c.date)})</p>
          ))}
        </section>
      )}
      {data.achievements.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Achievements</SectionTitle>
          {data.achievements.map((a) => (
            <div key={a.id} className="mb-1.5 text-sm">
              <span className="font-bold" style={{ color: "#111" }}>{a.title}.</span>
              {a.description && <span style={{ color: "#333" }}> {a.description}</span>}
              {a.url && <span style={{ color: accent }}> {a.url}</span>}
              <Bullets items={a.bullets} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function EngineerTpl({ data, accent, spacing }: { data: ResumeData; accent: string; spacing: ResumeMeta["spacing"] }) {
  return (
    <div className={SPACING[spacing]} style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}>
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: accent }}>{data.contact.name}</h1>
        <p className="text-sm font-mono" style={{ color: "#666" }}>{data.contact.title}</p>
        <p className="text-xs mt-1 font-mono" style={{ color: "#888" }}>
          {[data.contact.email, data.contact.phone, data.contact.github, data.contact.linkedin, data.contact.website].filter(Boolean).join("  //  ")}
        </p>
      </header>
      {data.summary && (
        <section>
          <SectionTitle accent={accent} variant="mono">~/summary</SectionTitle>
          <p className="text-sm leading-relaxed" style={{ color: "#333" }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          <SectionTitle accent={accent} variant="mono">~/experience</SectionTitle>
          <div className="space-y-4">
            {data.experience.map((e) => (
              <div key={e.id} className="border-l-2 pl-3" style={{ borderColor: accent }}>
                <div className="flex justify-between flex-wrap gap-2">
                  <span className="font-bold text-sm" style={{ color: "#111" }}>{e.role} @ {e.company}</span>
                  <span className="text-xs font-mono" style={{ color: "#888" }}>{fmtDate(e.startDate)} → {e.current ? "now" : fmtDate(e.endDate)}</span>
                </div>
                <Bullets items={e.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
      {data.projects.length > 0 && (
        <section>
          <SectionTitle accent={accent} variant="mono">~/projects</SectionTitle>
          <div className="space-y-2">
            {data.projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between flex-wrap gap-2">
                  <p className="text-sm">
                    <span className="font-bold" style={{ color: "#111" }}>{p.name}</span>
                    {p.tech.length > 0 && <span className="text-xs font-mono" style={{ color: accent }}> [{p.tech.join(", ")}]</span>}
                  </p>
                  {(p.startDate || p.endDate) && <span className="text-xs font-mono" style={{ color: "#888" }}>{fmtRange(p.startDate, p.endDate)}</span>}
                </div>
                {p.description && <p className="text-sm" style={{ color: "#555" }}>{p.description}</p>}
                <Bullets items={p.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
      {data.skills.length > 0 && (
        <section>
          <SectionTitle accent={accent} variant="mono">~/skills</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.flatMap((s) => s.items).map((s, i) => (
              <span key={i} className="text-xs font-mono px-2 py-0.5 rounded border" style={{ borderColor: accent, color: accent }}>{s}</span>
            ))}
          </div>
        </section>
      )}
      {data.training.length > 0 && (
        <section>
          <SectionTitle accent={accent} variant="mono">~/training</SectionTitle>
          <div className="space-y-2">
            {data.training.map((t) => (
              <div key={t.id}>
                <div className="flex justify-between flex-wrap gap-2">
                  <p className="text-sm">
                    <span className="font-bold" style={{ color: "#111" }}>{t.title}</span>
                    {t.organization && <span className="text-xs font-mono" style={{ color: accent }}> [{t.organization}]</span>}
                  </p>
                  <span className="text-xs font-mono" style={{ color: "#888" }}>{fmtRange(t.startDate, t.endDate)}</span>
                </div>
                <Bullets items={t.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="grid grid-cols-2 gap-4">
        {data.education.length > 0 && (
          <section>
            <SectionTitle accent={accent} variant="mono">~/edu</SectionTitle>
            {data.education.map((ed) => (
              <p key={ed.id} className="text-sm" style={{ color: "#333" }}>
                <span className="font-bold" style={{ color: "#111" }}>{ed.degree}</span> · {ed.school}
                <span className="text-xs block font-mono" style={{ color: "#888" }}>{fmtDate(ed.endDate)}</span>
              </p>
            ))}
          </section>
        )}
        {data.certificates.length > 0 && (
          <section>
            <SectionTitle accent={accent} variant="mono">~/certs</SectionTitle>
            {data.certificates.map((c) => (
              <p key={c.id} className="text-sm" style={{ color: "#333" }}>
                <span className="font-bold" style={{ color: "#111" }}>{c.name}</span>
                <span className="text-xs block font-mono" style={{ color: "#888" }}>{c.issuer} · {fmtDate(c.date)}</span>
              </p>
            ))}
          </section>
        )}
      </div>
      {data.achievements.length > 0 && (
        <section>
          <SectionTitle accent={accent} variant="mono">~/achievements</SectionTitle>
          <div className="space-y-2">
            {data.achievements.map((a) => (
              <div key={a.id}>
                <p className="text-sm">
                  <span className="font-bold" style={{ color: "#111" }}>{a.title}</span>
                  {a.url && <span className="text-xs font-mono" style={{ color: accent }}> {a.url}</span>}
                </p>
                {a.description && <p className="text-sm" style={{ color: "#555" }}>{a.description}</p>}
                <Bullets items={a.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function PMTpl({ data, accent, spacing }: { data: ResumeData; accent: string; spacing: ResumeMeta["spacing"] }) {
  return (
    <div className={SPACING[spacing]}>
      <header className="mb-5 pb-4" style={{ borderBottom: `3px solid ${accent}` }}>
        <h1 className="text-3xl font-bold" style={{ color: "#111" }}>{data.contact.name}</h1>
        <p className="text-lg font-medium" style={{ color: accent }}>{data.contact.title}</p>
        <p className="text-xs mt-2" style={{ color: "#555" }}>
          {[data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin].filter(Boolean).join("  •  ")}
        </p>
      </header>
      {data.summary && (
        <section>
          <SectionTitle accent={accent}>Profile</SectionTitle>
          <p className="text-sm leading-relaxed" style={{ color: "#333" }}>{data.summary}</p>
        </section>
      )}
      {}
      {data.experience.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Impact Highlights</SectionTitle>
          <div className="grid grid-cols-3 gap-3 mb-2">
            {data.experience
              .flatMap((e) => e.bullets)
              .filter((b) => /\d+%|\$|\d+x\b/i.test(b))
              .slice(0, 3)
              .map((b, i) => {
                const m = b.match(/(\d+%|\$\d[\d,]*[KMB]?|\d+x\b)/i);
                return (
                  <div key={i} className="p-2 rounded text-center" style={{ background: `${accent}15` }}>
                    <p className="text-lg font-bold" style={{ color: accent }}>{m?.[1] ?? "—"}</p>
                    <p className="text-[10px] leading-tight" style={{ color: "#555" }}>{b.slice(0, 70)}</p>
                  </div>
                );
              })}
          </div>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Experience</SectionTitle>
          <div className="space-y-4">
            {data.experience.map((e) => (
              <div key={e.id}>
                <div className="flex justify-between flex-wrap">
                  <span className="font-bold text-base" style={{ color: "#111" }}>{e.role}</span>
                  <span className="text-xs" style={{ color: "#777" }}>{fmtDate(e.startDate)} — {e.current ? "Present" : fmtDate(e.endDate)}</span>
                </div>
                <p className="text-sm font-medium" style={{ color: accent }}>{e.company}{e.location ? ` · ${e.location}` : ""}</p>
                <Bullets items={e.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
      {data.skills.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Core Competencies</SectionTitle>
          <div className="space-y-1">
            {data.skills.map((s) => (
              <p key={s.id} className="text-sm"><span className="font-semibold" style={{ color: "#111" }}>{s.category}:</span> <span style={{ color: "#444" }}>{s.items.join(", ")}</span></p>
            ))}
          </div>
        </section>
      )}
      {data.training.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Training</SectionTitle>
          <div className="space-y-2">
            {data.training.map((t) => (
              <div key={t.id}>
                <div className="flex justify-between flex-wrap">
                  <span className="font-bold text-sm" style={{ color: "#111" }}>{t.title}{t.organization ? ` · ${t.organization}` : ""}</span>
                  <span className="text-xs" style={{ color: "#777" }}>{fmtRange(t.startDate, t.endDate)}</span>
                </div>
                <Bullets items={t.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="grid grid-cols-2 gap-4">
        {data.education.length > 0 && (
          <section>
            <SectionTitle accent={accent}>Education</SectionTitle>
            {data.education.map((ed) => (
              <p key={ed.id} className="text-sm" style={{ color: "#333" }}><span className="font-semibold">{ed.degree}</span>, {ed.school}</p>
            ))}
          </section>
        )}
        {data.certificates.length > 0 && (
          <section>
            <SectionTitle accent={accent}>Certifications</SectionTitle>
            {data.certificates.map((c) => (
              <p key={c.id} className="text-sm" style={{ color: "#333" }}>{c.name} — {c.issuer}</p>
            ))}
          </section>
        )}
      </div>
      {data.achievements.length > 0 && (
        <section>
          <SectionTitle accent={accent}>Achievements</SectionTitle>
          <div className="space-y-2">
            {data.achievements.map((a) => (
              <div key={a.id}>
                <div className="flex justify-between flex-wrap">
                  <span className="font-bold text-sm" style={{ color: "#111" }}>{a.title}</span>
                  {a.url && <span className="text-xs" style={{ color: accent }}>{a.url}</span>}
                </div>
                {a.description && <p className="text-sm" style={{ color: "#333" }}>{a.description}</p>}
                <Bullets items={a.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function DataSciTpl({ data, accent, spacing }: { data: ResumeData; accent: string; spacing: ResumeMeta["spacing"] }) {
  return (
    <div className={SPACING[spacing]}>
      <Header data={data} accent={accent} />
      {data.summary && (
        <section>
          <SectionTitle accent={accent} variant="pill">Summary</SectionTitle>
          <p className="text-sm leading-relaxed" style={{ color: "#333" }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section>
          <SectionTitle accent={accent} variant="pill">Experience</SectionTitle>
          <div className="space-y-3">
            {data.experience.map((e) => (
              <div key={e.id}>
                <div className="flex justify-between flex-wrap">
                  <span className="font-bold text-sm" style={{ color: "#111" }}>{e.role} · {e.company}</span>
                  <span className="text-xs" style={{ color: "#777" }}>{fmtDate(e.startDate)} — {e.current ? "Present" : fmtDate(e.endDate)}</span>
                </div>
                <Bullets items={e.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
      {data.projects.length > 0 && (
        <section>
          <SectionTitle accent={accent} variant="pill">Models & Projects</SectionTitle>
          <div className="space-y-2">
            {data.projects.map((p) => (
              <div key={p.id} className="text-sm">
                <div className="flex justify-between flex-wrap">
                  <div>
                    <span className="font-bold" style={{ color: "#111" }}>{p.name}</span>
                    {p.tech.length > 0 && <span style={{ color: accent }}> · {p.tech.join(", ")}</span>}
                  </div>
                  {(p.startDate || p.endDate) && <span className="text-xs" style={{ color: "#777" }}>{fmtRange(p.startDate, p.endDate)}</span>}
                </div>
                {p.description && <p style={{ color: "#444" }}>{p.description}</p>}
                <Bullets items={p.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
      {data.skills.length > 0 && (
        <section>
          <SectionTitle accent={accent} variant="pill">Technical Skills</SectionTitle>
          <div className="space-y-1">
            {data.skills.map((s) => (
              <p key={s.id} className="text-sm"><span className="font-semibold" style={{ color: "#111" }}>{s.category}:</span> <span style={{ color: "#444" }}>{s.items.join(", ")}</span></p>
            ))}
          </div>
        </section>
      )}
      {data.training.length > 0 && (
        <section>
          <SectionTitle accent={accent} variant="pill">Training</SectionTitle>
          <div className="space-y-2">
            {data.training.map((t) => (
              <div key={t.id} className="text-sm">
                <div className="flex justify-between flex-wrap">
                  <div>
                    <span className="font-bold" style={{ color: "#111" }}>{t.title}</span>
                    {t.organization && <span style={{ color: accent }}> · {t.organization}</span>}
                  </div>
                  <span className="text-xs" style={{ color: "#777" }}>{fmtRange(t.startDate, t.endDate)}</span>
                </div>
                <Bullets items={t.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="grid grid-cols-2 gap-4">
        {data.education.length > 0 && (
          <section>
            <SectionTitle accent={accent} variant="pill">Education</SectionTitle>
            {data.education.map((ed) => (
              <p key={ed.id} className="text-sm" style={{ color: "#333" }}><span className="font-semibold">{ed.degree}</span>{ed.field ? `, ${ed.field}` : ""}<br />{ed.school}</p>
            ))}
          </section>
        )}
        {data.certificates.length > 0 && (
          <section>
            <SectionTitle accent={accent} variant="pill">Certifications</SectionTitle>
            {data.certificates.map((c) => (
              <p key={c.id} className="text-sm" style={{ color: "#333" }}>{c.name} — {c.issuer}</p>
            ))}
          </section>
        )}
      </div>
      {data.achievements.length > 0 && (
        <section>
          <SectionTitle accent={accent} variant="pill">Achievements</SectionTitle>
          <div className="space-y-2">
            {data.achievements.map((a) => (
              <div key={a.id} className="text-sm">
                <div className="flex justify-between flex-wrap">
                  <span className="font-bold" style={{ color: "#111" }}>{a.title}</span>
                  {a.url && <span style={{ color: accent }}>{a.url}</span>}
                </div>
                {a.description && <p style={{ color: "#444" }}>{a.description}</p>}
                <Bullets items={a.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function DesignerTpl({ data, accent, spacing }: { data: ResumeData; accent: string; spacing: ResumeMeta["spacing"] }) {
  return (
    <div className={SPACING[spacing]} style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
      <header className="mb-6">
        <h1 className="text-5xl font-light tracking-tighter" style={{ color: "#111" }}>{data.contact.name}</h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="h-px flex-1" style={{ background: accent }} />
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: accent }}>{data.contact.title}</p>
        </div>
        <p className="text-xs mt-2" style={{ color: "#888" }}>
          {[data.contact.email, data.contact.phone, data.contact.location, data.contact.website, data.contact.linkedin].filter(Boolean).join("   /   ")}
        </p>
      </header>
      {data.summary && (
        <section className="mb-6">
          <p className="text-lg font-light leading-relaxed" style={{ color: "#333" }}>{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: accent }}>Experience</p>
          <div className="space-y-5">
            {data.experience.map((e) => (
              <div key={e.id} className="grid grid-cols-[100px_1fr] gap-4">
                <p className="text-xs pt-1" style={{ color: "#999" }}>{fmtDate(e.startDate)}<br />— {e.current ? "Now" : fmtDate(e.endDate)}</p>
                <div>
                  <p className="text-base font-medium" style={{ color: "#111" }}>{e.role}</p>
                  <p className="text-sm" style={{ color: accent }}>{e.company}</p>
                  <Bullets items={e.bullets} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {data.projects.length > 0 && (
        <section className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: accent }}>Selected Work</p>
          <div className="space-y-3">
            {data.projects.map((p) => (
              <div key={p.id}>
                <p className="text-base font-medium" style={{ color: "#111" }}>{p.name}{p.tech.length ? <span className="text-sm font-normal" style={{ color: "#999" }}> — {p.tech.join(", ")}</span> : null}</p>
                {(p.startDate || p.endDate) && <p className="text-xs" style={{ color: "#999" }}>{fmtRange(p.startDate, p.endDate)}</p>}
                {p.description && <p className="text-sm" style={{ color: "#555" }}>{p.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
      {data.skills.length > 0 && (
        <section className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: accent }}>Toolkit</p>
          <div className="flex flex-wrap gap-2">
            {data.skills.flatMap((s) => s.items).map((s, i) => (
              <span key={i} className="text-sm px-3 py-1 rounded-full border" style={{ borderColor: "#e5e5e5", color: "#444" }}>{s}</span>
            ))}
          </div>
        </section>
      )}
      {data.training.length > 0 && (
        <section className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: accent }}>Training</p>
          <div className="space-y-3">
            {data.training.map((t) => (
              <div key={t.id}>
                <p className="text-base font-medium" style={{ color: "#111" }}>{t.title}{t.organization ? <span className="text-sm font-normal" style={{ color: "#999" }}> — {t.organization}</span> : null}</p>
                <p className="text-xs" style={{ color: "#999" }}>{fmtRange(t.startDate, t.endDate)}</p>
                <Bullets items={t.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="grid grid-cols-2 gap-6">
        {data.education.length > 0 && (
          <section>
            <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: accent }}>Education</p>
            {data.education.map((ed) => (
              <p key={ed.id} className="text-sm" style={{ color: "#333" }}>{ed.degree}, {ed.school}</p>
            ))}
          </section>
        )}
        {data.certificates.length > 0 && (
          <section>
            <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: accent }}>Awards</p>
            {data.certificates.map((c) => (
              <p key={c.id} className="text-sm" style={{ color: "#333" }}>{c.name} — {c.issuer}</p>
            ))}
          </section>
        )}
      </div>
      {data.achievements.length > 0 && (
        <section className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: accent }}>Achievements</p>
          <div className="space-y-3">
            {data.achievements.map((a) => (
              <div key={a.id}>
                <p className="text-base font-medium" style={{ color: "#111" }}>{a.title}{a.url ? <span className="text-sm font-normal" style={{ color: "#999" }}> — {a.url}</span> : null}</p>
                {a.description && <p className="text-sm" style={{ color: "#555" }}>{a.description}</p>}
                <Bullets items={a.bullets} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

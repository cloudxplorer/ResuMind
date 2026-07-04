import { NextRequest, NextResponse } from "next/server";
import { toLatex, toLatexStyleHTML, type PageSize } from "@/lib/export";
import { htmlToPdfBuffer } from "@/lib/pdf";
import type { ResumeDocument } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

const LATEX_API = "https://latexonline.net/compile";

async function compileLatexOnline(texSource: string): Promise<Buffer | null> {
  try {
    const blob = new Blob([texSource], { type: "text/x-tex" });
    const form = new FormData();
    form.append("file", blob, "resume.tex");
    form.append("compiler", "pdflatex");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90000);
    const res = await fetch(LATEX_API, { method: "POST", body: form, signal: controller.signal });
    clearTimeout(timer);
    const ct = res.headers.get("content-type") || "";
    if (!res.ok || !ct.includes("application/pdf")) return null;
    const buf = await res.arrayBuffer();
    if (buf.byteLength < 1000) return null;
    return Buffer.from(buf);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const { doc, variant = "jake", pageSize = "letter" } = body as {
    doc: ResumeDocument;
    variant?: "jake" | "moderncv" | "altacv";
    pageSize?: PageSize;
  };
  if (!doc?.data) return NextResponse.json({ error: "doc.data required" }, { status: 400 });

  const texSource = toLatex(doc, variant, pageSize);

  if (variant !== "jake") {
    return NextResponse.json(
      {
        error:
          `${variant} template requires class files not available server-side. Use Jake's template for direct PDF compilation, or copy the LaTeX source to Overleaf.`,
        latexSource: texSource,
      },
      { status: 422 },
    );
  }

  const safeName = (doc.title || "resume").replace(/[^a-z0-9]+/gi, "-").toLowerCase();

  const compiled = await compileLatexOnline(texSource);
  if (compiled) {
    return new NextResponse(compiled as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}-latex.pdf"`,
        "Content-Length": compiled.length.toString(),
        "Cache-Control": "no-store",
        "X-LaTeX-Compiled": "pdflatex",
      },
    });
  }

  try {
    const html = toLatexStyleHTML(doc, pageSize);
    const pdfBuffer = await htmlToPdfBuffer(html, pageSize);
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}-latex.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "no-store",
        "X-LaTeX-Compiled": "rendered",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "LaTeX PDF generation failed";
    return NextResponse.json(
      { error: `LaTeX PDF generation failed: ${message}`, latexSource: texSource },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "LaTeX PDF endpoint ready. POST a ResumeDocument to receive a PDF.",
  });
}


import { NextRequest, NextResponse } from "next/server";
import { toPrintableHTML, type PageSize } from "@/lib/export";
import { htmlToPdfBuffer } from "@/lib/pdf";
import type { ResumeDocument } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const { doc, pageSize = "letter" } = body as { doc: ResumeDocument; pageSize?: PageSize };
  if (!doc?.data) return NextResponse.json({ error: "doc.data required" }, { status: 400 });

  try {
    const html = toPrintableHTML(doc, pageSize);
    const pdfBuffer = await htmlToPdfBuffer(html, pageSize);

    const safeName = (doc.title || "resume").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PDF generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "PDF endpoint ready. POST a ResumeDocument to receive a PDF.",
  });
}

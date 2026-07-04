
import { NextRequest, NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";
import { aiStructureResume } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const structure = formData.get("structure") === "true";

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded. Attach a PDF as 'file'." }, { status: 400 });
    }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 5 MB)." }, { status: 413 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());

    if (bytes.length < 5 || bytes[0] !== 0x25 || bytes[1] !== 0x50 || bytes[2] !== 0x44 || bytes[3] !== 0x46) {
      return NextResponse.json({ error: "Invalid PDF file (missing %PDF header)." }, { status: 400 });
    }

    const pdf = await getDocumentProxy(bytes);
    const { text: rawText } = await extractText(pdf, { mergePages: false });
    const text = Array.isArray(rawText) ? rawText.join("\n\n") : rawText;

    if (!text || text.trim().length < 20) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from this PDF. It may be a scanned image — OCR is not supported. Try a text-based PDF.",
        },
        { status: 422 },
      );
    }

    if (!structure) {
      return NextResponse.json({ text, chars: text.length });
    }

    try {
      const structured = await aiStructureResume(text);
      return NextResponse.json({ text, structured, chars: text.length });
    } catch (structErr) {
      const message = structErr instanceof Error ? structErr.message : "AI structuring failed";
      return NextResponse.json({ text, structured: null, warning: message, chars: text.length });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "PDF upload endpoint ready. POST a PDF file to extract and structure text.",
  });
}

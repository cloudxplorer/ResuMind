


import { NextRequest, NextResponse } from "next/server";
import { scoreResume } from "@/lib/ats";
import { aiExplainScores } from "@/lib/ai";
import type { ResumeDocument } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const { doc, jobDescription, explain } = body as {
    doc: ResumeDocument | { data: ResumeDocument["data"] };
    jobDescription?: string;
    explain?: boolean;
  };
  if (!doc?.data) return NextResponse.json({ error: "doc.data required" }, { status: 400 });
  const report = scoreResume(doc, { jobDescription });
  let aiExplanation: string | undefined;
  if (explain) {
    try {
      aiExplanation = await aiExplainScores(report);
    } catch {
      aiExplanation = undefined;
    }
  }
  return NextResponse.json({ report, aiExplanation });
}

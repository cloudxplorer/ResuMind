


import { NextRequest, NextResponse } from "next/server";
import {
  aiAssistant,
  aiCoverLetter,
  aiExplainScores,
  aiImproveBullets,
  aiRewriteSection,
  aiSuggestions,
  aiTailorResume,
} from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  task:
    | "explain"
    | "rewrite"
    | "improve-bullets"
    | "tailor"
    | "cover-letter"
    | "suggestions"
    | "chat";
  payload?: Record<string, unknown>;
};

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { task, payload = {} } = body;
  try {
    switch (task) {
      case "explain": {
        const report = payload.report;
        if (!report) return NextResponse.json({ error: "report required" }, { status: 400 });
        const explanation = await aiExplainScores(report);
        return NextResponse.json({ explanation });
      }
      case "rewrite": {
        const { kind, text, context } = payload as {
          kind: "summary" | "bullet" | "project";
          text: string;
          context?: { role?: string; company?: string; jobDescription?: string };
        };
        if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });
        const result = await aiRewriteSection(kind, text, context);
        return NextResponse.json(result);
      }
      case "improve-bullets": {
        const { bullets } = payload as { bullets: string[] };
        if (!Array.isArray(bullets)) return NextResponse.json({ error: "bullets[] required" }, { status: 400 });
        const items = await aiImproveBullets(bullets);
        return NextResponse.json({ items });
      }
      case "tailor": {
        const { resumeData, jobDescription } = payload as { resumeData: unknown; jobDescription: string };
        if (!resumeData || !jobDescription)
          return NextResponse.json({ error: "resumeData and jobDescription required" }, { status: 400 });
        const result = await aiTailorResume(resumeData, jobDescription);
        return NextResponse.json(result);
      }
      case "cover-letter": {
        const { resumeData, jobDescription, tone } = payload as {
          resumeData: unknown;
          jobDescription: string;
          tone?: string;
        };
        if (!resumeData || !jobDescription)
          return NextResponse.json({ error: "resumeData and jobDescription required" }, { status: 400 });
        const result = await aiCoverLetter(resumeData, jobDescription, tone || "professional");
        return NextResponse.json(result);
      }
      case "suggestions": {
        const { resumeData, jobDescription } = payload as { resumeData: unknown; jobDescription?: string };
        if (!resumeData) return NextResponse.json({ error: "resumeData required" }, { status: 400 });
        const result = await aiSuggestions(resumeData, jobDescription);
        return NextResponse.json(result);
      }
      case "chat": {
        const { messages, resumeData, jobDescription } = payload as {
          messages: { role: "user" | "assistant"; content: string }[];
          resumeData: unknown;
          jobDescription?: string;
        };
        if (!messages || !resumeData)
          return NextResponse.json({ error: "messages and resumeData required" }, { status: 400 });
        const result = await aiAssistant(messages, resumeData, jobDescription);
        return NextResponse.json(result);
      }
      default:
        return NextResponse.json({ error: `Unknown task: ${task}` }, { status: 400 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

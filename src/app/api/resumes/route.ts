




import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const DEMO_USER_ID = "demo-user";

async function ensureDemoUser() {
  const existing = await db.user.findUnique({ where: { id: DEMO_USER_ID } });
  if (!existing) {
    await db.user.create({
      data: { id: DEMO_USER_ID, email: "demo@resume.local", name: "Demo User" },
    });
  }
}

export async function GET() {
  await ensureDemoUser();
  const user = await db.user.findUnique({
    where: { id: DEMO_USER_ID },
    include: {
      resumes: { orderBy: { updatedAt: "desc" } },
      jobDescs: { orderBy: { updatedAt: "desc" } },
      coverLetters: { orderBy: { updatedAt: "desc" } },
      aiConversations: { orderBy: { updatedAt: "desc" } },
      activityLogs: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });
  if (!user) return NextResponse.json({});
  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
    resumes: user.resumes,
    jobDescs: user.jobDescs,
    coverLetters: user.coverLetters,
    conversations: user.aiConversations,
    activity: user.activityLogs,
  });
}

export async function POST(req: NextRequest) {
  await ensureDemoUser();
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const { kind, data } = body as { kind: string; data: Record<string, unknown> };
  try {
    switch (kind) {
      case "resume":
        if (typeof data.id !== "string") return NextResponse.json({ error: "id required" }, { status: 400 });
        await db.resume.upsert({
          where: { id: data.id },
          create: {
            id: data.id,
            userId: DEMO_USER_ID,
            title: String(data.title ?? "Untitled"),
            template: String(data.template ?? "modern"),
            accent: String(data.accent ?? "#0f766e"),
            font: String(data.font ?? "inter"),
            data: JSON.stringify(data.data ?? {}),
            isFavorite: Boolean(data.isFavorite),
          },
          update: {
            title: String(data.title ?? "Untitled"),
            template: String(data.template ?? "modern"),
            accent: String(data.accent ?? "#0f766e"),
            font: String(data.font ?? "inter"),
            data: JSON.stringify(data.data ?? {}),
            isFavorite: Boolean(data.isFavorite),
          },
        });
        return NextResponse.json({ ok: true });
      case "ats-report":
        await db.aTSReport.create({
          data: {
            resumeId: String(data.resumeId),
            jobDescId: (data.jobDescId as string) || null,
            overall: Number(data.overall),
            keyword: Number(data.keyword),
            formatting: Number(data.formatting),
            sections: Number(data.sections),
            semantic: Number(data.semantic),
            readability: Number(data.readability),
            grammar: Number(data.grammar),
            details: JSON.stringify(data.details ?? {}),
          },
        });
        return NextResponse.json({ ok: true });
      case "activity":
        await db.activityLog.create({
          data: {
            userId: DEMO_USER_ID,
            action: String(data.action),
            meta: data.meta ? JSON.stringify(data.meta) : null,
          },
        });
        return NextResponse.json({ ok: true });
      default:
        return NextResponse.json({ error: `Unknown kind: ${kind}` }, { status: 400 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "DB error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

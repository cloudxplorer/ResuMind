

import { NextRequest, NextResponse } from "next/server";
import { matchJob } from "@/lib/ats";
import type { ResumeData } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const { data, job } = body as { data: ResumeData; job: { content: string; title: string } | string };
  if (!data || !job) return NextResponse.json({ error: "data and job required" }, { status: 400 });
  const result = matchJob(data, job);
  return NextResponse.json({ result });
}


"use client";

import * as React from "react";
import { AppShell } from "@/components/app-shell";
import { HydrationGate } from "@/components/hydration-gate";
import { useStore } from "@/lib/store";
import { DashboardView } from "@/components/views/dashboard";
import { BuilderView } from "@/components/views/builder";
import { ATSCheckerView } from "@/components/views/ats-checker";
import { MatcherView } from "@/components/views/matcher";
import { OptimizerView } from "@/components/views/optimizer";
import { CoverLetterView } from "@/components/views/cover-letter";
import { VersionsView } from "@/components/views/versions";
import { ChatView } from "@/components/views/chat";
import { LatexView } from "@/components/views/latex";
import { ApplicationsView } from "@/components/views/applications";

export default function Home() {
  return (
    <HydrationGate>
      <AppShell>
        <Views />
      </AppShell>
    </HydrationGate>
  );
}

function Views() {
  const view = useStore((s) => s.view);
  return (
    <>
      {view === "dashboard" && <DashboardView />}
      {view === "builder" && <BuilderView />}
      {view === "ats" && <ATSCheckerView />}
      {view === "matcher" && <MatcherView />}
      {view === "optimizer" && <OptimizerView />}
      {view === "cover-letter" && <CoverLetterView />}
      {view === "versions" && <VersionsView />}
      {view === "chat" && <ChatView />}
      {view === "latex" && <LatexView />}
      {view === "applications" && <ApplicationsView />}
    </>
  );
}

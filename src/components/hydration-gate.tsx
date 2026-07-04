
"use client";

import * as React from "react";
import { useStore } from "@/lib/store";


export function HydrationGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    
    const result = useStore.persist.rehydrate() as unknown as Promise<void> | void;
    const finish = () => {
      useStore.getState().hydrate();
      setReady(true);
    };
    if (result && typeof (result as Promise<void>).then === "function") {
      (result as Promise<void>).then(finish).catch(() => setReady(true));
    } else {
      finish();
    }
  }, []);

  if (!ready) return <BootSkeleton />;

  return <>{children}</>;
}

function BootSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex flex-1 min-h-0">
        {}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar/50">
          <div className="h-14 flex items-center gap-2 px-4 border-b border-border">
            <div className="h-7 w-7 rounded-lg bg-muted animate-pulse" />
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          </div>
          <div className="p-3 border-b border-border space-y-2">
            <div className="h-3 w-20 rounded bg-muted animate-pulse" />
            <div className="h-9 rounded bg-muted animate-pulse" />
            <div className="h-8 rounded bg-muted animate-pulse" />
          </div>
          <div className="p-2 space-y-4 flex-1">
            {[0, 1, 2].map((g) => (
              <div key={g} className="space-y-1.5">
                <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                {[0, 1].map((i) => (
                  <div key={i} className="h-8 rounded bg-muted animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        </aside>
        {}
        <div className="flex-1 flex flex-col">
          <div className="h-14 border-b border-border glass flex items-center px-4 gap-3">
            <div className="h-4 w-40 rounded bg-muted animate-pulse" />
            <div className="ml-auto h-8 w-20 rounded bg-muted animate-pulse" />
          </div>
          <main className="flex-1 p-6 lg:p-8 space-y-6">
            <div className="space-y-2">
              <div className="h-8 w-48 rounded bg-muted animate-pulse" />
              <div className="h-4 w-72 rounded bg-muted animate-pulse" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="h-48 rounded-lg border border-border bg-card animate-pulse" />
              <div className="lg:col-span-2 h-48 rounded-lg border border-border bg-card animate-pulse" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-lg border border-border bg-card animate-pulse" />
              ))}
            </div>
          </main>
          <footer className="mt-auto border-t border-border py-3 px-4 h-12" />
        </div>
      </div>
    </div>
  );
}


"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useStore, type ViewId } from "@/lib/store";
import { NAV } from "@/components/app-shell";
import { FileText, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function CommandPalette() {
  const { commandOpen, setCommandOpen, setView, resumes, setActiveResume, createResume, duplicateResume, deleteResume, activeResumeId } = useStore();

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commandOpen, setCommandOpen]);

  function go(v: ViewId) {
    setView(v);
    setCommandOpen(false);
  }

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <CommandItem key={n.id} value={`${n.label} ${n.hint}`} onSelect={() => go(n.id)}>
                <Icon className="mr-2 h-4 w-4" />
                <span>{n.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">{n.hint}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Resumes">
          <CommandItem
            onSelect={() => {
              createResume("Untitled Resume");
              setCommandOpen(false);
              setView("builder");
              toast.success("New resume created");
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Create new resume</span>
          </CommandItem>
          {resumes.map((r) => (
            <CommandItem
              key={r.id}
              value={`resume ${r.title}`}
              onSelect={() => {
                setActiveResume(r.id);
                setView("builder");
                setCommandOpen(false);
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span className="truncate">{r.title}</span>
              {r.isFavorite && <Star className="mx-1 h-3 w-3 text-amber-500 fill-amber-500" />}
              {r.id === activeResumeId && <span className="ml-auto text-xs text-emerald-500">active</span>}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              const id = duplicateResume(activeResumeId);
              setActiveResume(id);
              setCommandOpen(false);
              toast.success("Duplicated resume");
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            <span>Duplicate active resume</span>
          </CommandItem>
          <CommandItem
            className="text-destructive data-[selected=true]:text-destructive"
            onSelect={() => {
              deleteResume(activeResumeId);
              setCommandOpen(false);
              toast.success("Resume deleted");
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete active resume</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

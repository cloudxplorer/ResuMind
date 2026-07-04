
"use client";

import * as React from "react";
import { Plus, Star, MoreVertical, Trash2, Copy, Pencil, Check, FileText } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";


export function ResumeManager({
  activeResumeId,
  setActiveResume,
  onCreateResume,
}: {
  activeResumeId: string;
  setActiveResume: (id: string) => void;
  onCreateResume: () => void;
}) {
  const { resumes, deleteResume, duplicateResume, updateResume } = useStore();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState("");

  function startEdit(id: string, title: string) {
    setEditingId(id);
    setEditValue(title);
  }
  function commitEdit() {
    if (editingId && editValue.trim()) {
      updateResume(editingId, { title: editValue.trim() });
      toast.success("Renamed");
    }
    setEditingId(null);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          Resumes ({resumes.length})
        </label>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onCreateResume} title="New resume">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-thin">
        {resumes.map((r) => {
          const active = r.id === activeResumeId;
          return (
            <div
              key={r.id}
              className={cn(
                "group flex items-center gap-1.5 rounded-md px-2 py-1.5 cursor-pointer transition-colors",
                active ? "bg-accent" : "hover:bg-accent/60",
              )}
              onClick={() => setActiveResume(r.id)}
            >
              {editingId === r.id ? (
                <Input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditingId(null); }}
                  className="h-6 text-xs"
                />
              ) : (
                <>
                  <FileText className={cn("h-3.5 w-3.5 shrink-0", active ? "text-emerald-500" : "text-muted-foreground")} />
                  <span className="flex-1 text-xs truncate">{r.title}</span>
                  {r.isFavorite && <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 flex items-center justify-center rounded hover:bg-background text-muted-foreground"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); startEdit(r.id, r.title); }}>
                        <Pencil className="h-3.5 w-3.5 mr-2" /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateResume(r.id, { isFavorite: !r.isFavorite }); }}>
                        <Star className={cn("h-3.5 w-3.5 mr-2", r.isFavorite && "fill-amber-500 text-amber-500")} /> {r.isFavorite ? "Unfavorite" : "Favorite"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); duplicateResume(r.id); toast.success("Duplicated"); }}>
                        <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (resumes.length <= 1) { toast.error("Cannot delete the last resume"); return; }
                          deleteResume(r.id);
                          toast.success("Resume deleted");
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          );
        })}
      </div>

      <Button variant="outline" size="sm" className="w-full text-xs h-8 gap-1.5" onClick={onCreateResume}>
        <Plus className="h-3.5 w-3.5" /> New Resume
      </Button>
    </div>
  );
}
